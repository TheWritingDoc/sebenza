# Build GShop Android APK

## Prerequisites
- Android Studio (latest stable)
- Java JDK 17+
- Node.js 18+

## Steps

### 1. Build the web app
```bash
cd client
npm run build
```

### 2. Sync Capacitor
```bash
npx cap sync android
```

### 3. Open in Android Studio
```bash
npx cap open android
```

### 4. Build APK
In Android Studio:
- Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
- Or use: **Build → Generate Signed Bundle / APK** for release

### 5. Copy APK to server
The debug APK will be at:
```
client/android/app/build/outputs/apk/debug/app-debug.apk
```

Copy it to the server downloads folder:
```bash
cp client/android/app/build/outputs/apk/debug/app-debug.apk server/downloads/gshop.apk
```

The download button on the website will automatically point to `/downloads/gshop.apk`.
