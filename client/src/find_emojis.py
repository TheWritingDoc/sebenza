import os, sys
sys.stdout.reconfigure(encoding='utf-8')

def find_emojis_in_file(filepath):
    emojis = set()
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for i, line in enumerate(f, 1):
                for ch in line:
                    cp = ord(ch)
                    if (0x1F300 <= cp <= 0x1F9FF or 
                        0x2600 <= cp <= 0x26FF or 
                        0x2700 <= cp <= 0x27BF or
                        cp == 0x2B50):
                        emojis.add((ch, i))
    except:
        pass
    return emojis

for root, dirs, filenames in os.walk('.'):
    for f in filenames:
        if f.endswith('.js'):
            fp = os.path.join(root, f)
            emojis = find_emojis_in_file(fp)
            if emojis:
                uniq = sorted(set(ch for ch, _ in emojis))
                print(f"{fp}: {' '.join(uniq)}")
