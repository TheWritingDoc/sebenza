#!/usr/bin/env python3
import base64
import json
import os
import random
import string
import tempfile
import time
import requests

BASE = os.getenv("GSHOP_BASE_URL", "http://127.0.0.1:3001").rstrip("/")
PASSWORD = os.getenv("GSHOP_TEST_PASSWORD", "Passw0rd!")
PNG = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7Z0ioAAAAASUVORK5CYII=")


def rand_email(prefix: str) -> str:
    suffix = "".join(random.choice(string.ascii_lowercase + string.digits) for _ in range(7))
    return f"{prefix}_{int(time.time())}_{suffix}@example.com"


def auth_header(token: str):
    return {"Authorization": f"Bearer {token}"}


def register_or_login(name: str, email: str) -> tuple[str, str]:
    r = requests.post(f"{BASE}/api/register", json={"name": name, "email": email, "password": PASSWORD}, timeout=20)
    if r.status_code not in (200, 201):
        r = requests.post(f"{BASE}/api/login", json={"email": email, "password": PASSWORD}, timeout=20)
    r.raise_for_status()
    j = r.json()
    return j["token"], str(j.get("user", {}).get("_id", ""))


def post_job(token: str, title: str) -> str:
    payload = {
        "title": title,
        "description": "Nightly lifecycle regression",
        "category": "cleaning",
        "budget": 250,
        "location": {"lat": -33.96, "lng": 25.60},
        "paymentMethod": "cash",
        "estimatedDuration": "1h",
    }
    r = requests.post(f"{BASE}/api/jobs", json=payload, headers=auth_header(token), timeout=20)
    r.raise_for_status()
    return r.json()["job"]["_id"]


def get_job(token: str, job_id: str) -> dict:
    r = requests.get(f"{BASE}/api/jobs/{job_id}", headers=auth_header(token), timeout=20)
    r.raise_for_status()
    return r.json()


def app_id_for(job: dict, applicant_name: str) -> str:
    for app in job.get("applications", []):
        ap = app.get("applicantId")
        if isinstance(ap, dict) and ap.get("name") == applicant_name:
            return app["_id"]
    raise RuntimeError(f"Application not found for {applicant_name}")


def tiny_png(tag: str) -> str:
    fd, path = tempfile.mkstemp(suffix=f"_{tag}.png")
    os.close(fd)
    with open(path, "wb") as f:
        f.write(PNG)
    return path


def run_round(round_no: int) -> dict:
    stamp = int(time.time())
    poster_name = f"PosterReg_{round_no}_{stamp}"
    helper_name = f"HelperReg_{round_no}_{stamp}"
    outsider_name = f"OutReg_{round_no}_{stamp}"

    poster_t, _ = register_or_login(poster_name, rand_email("poster"))
    helper_t, _ = register_or_login(helper_name, rand_email("helper"))
    outsider_t, _ = register_or_login(outsider_name, rand_email("outsider"))

    job_id = post_job(poster_t, f"Nightly QA Job {round_no}")

    requests.post(f"{BASE}/api/jobs/{job_id}/apply", json={"proposedAmount": 235, "message": "Ready"}, headers=auth_header(helper_t), timeout=20).raise_for_status()
    job = get_job(poster_t, job_id)
    aid = app_id_for(job, helper_name)
    helper_id = None
    for app in job.get("applications", []):
        if app.get("_id") == aid:
            ap = app.get("applicantId")
            helper_id = str(ap.get("_id")) if isinstance(ap, dict) else str(ap)
            break
    if not helper_id:
        raise RuntimeError("Unable to resolve helper ID from job applications")

    requests.post(f"{BASE}/api/jobs/{job_id}/applications/{aid}/approve", json={"approvedAmount": 240, "approvedTime": "2026-05-27T16:30:00.000Z"}, headers=auth_header(poster_t), timeout=20).raise_for_status()
    requests.post(f"{BASE}/api/jobs/{job_id}/applications/{aid}/confirm", headers=auth_header(helper_t), timeout=20).raise_for_status()
    requests.post(f"{BASE}/api/jobs/{job_id}/start", headers=auth_header(poster_t), timeout=20).raise_for_status()

    # Required ratings before completion
    requests.post(f"{BASE}/api/jobs/{job_id}/review", json={"overallRating": 5, "comment": "Great"}, headers=auth_header(helper_t), timeout=20).raise_for_status()

    p1 = tiny_png("complete_1")
    p2 = tiny_png("complete_2")
    try:
        with open(p1, "rb") as f1:
            requests.post(f"{BASE}/api/jobs/{job_id}/complete", headers=auth_header(helper_t), files={"completionPhotos": ("a.png", f1, "image/png")}, timeout=20).raise_for_status()

        requests.post(f"{BASE}/api/jobs/{job_id}/review", json={"overallRating": 5, "comment": "Excellent"}, headers=auth_header(poster_t), timeout=20).raise_for_status()

        with open(p2, "rb") as f2:
            requests.post(f"{BASE}/api/jobs/{job_id}/confirm-completion", headers=auth_header(poster_t), files={"completionPhotos": ("b.png", f2, "image/png")}, timeout=20).raise_for_status()
    finally:
        for p in (p1, p2):
            try:
                os.remove(p)
            except OSError:
                pass

    sec = requests.post(f"{BASE}/api/jobs/{job_id}/payment-handshake", headers=auth_header(outsider_t), json={"manual": True}, timeout=20)
    pay = requests.post(f"{BASE}/api/jobs/{job_id}/payment-handshake", headers=auth_header(poster_t), json={"scannedUserId": helper_id}, timeout=20)

    final_job = get_job(poster_t, job_id)
    return {
        "jobId": job_id,
        "outsiderHandshakeStatus": sec.status_code,
        "posterHandshakeStatus": pay.status_code,
        "status": final_job.get("status"),
        "paymentConfirmed": final_job.get("paymentConfirmed"),
        "paymentConfirmedAt": bool(final_job.get("paymentConfirmedAt")),
    }


def main():
    rounds = int(os.getenv("GSHOP_API_REGRESSION_ROUNDS", "2"))
    results = []
    for i in range(1, rounds + 1):
        results.append(run_round(i))

    passed = all(
        r["outsiderHandshakeStatus"] == 403 and
        r["posterHandshakeStatus"] == 200 and
        r["status"] == "completed" and
        r["paymentConfirmed"] is True and
        r["paymentConfirmedAt"] is True
        for r in results
    )

    out = {
        "base": BASE,
        "rounds": rounds,
        "passed": passed,
        "results": results,
    }
    print(json.dumps(out, indent=2))
    if not passed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
