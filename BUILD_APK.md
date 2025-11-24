# How to Rebuild the Android APK

This guide explains how to rebuild the Android APK after making changes to the mobile app.

**This project uses Expo with EAS Build** - the recommended method is below.

---

## Prerequisites

Before building, ensure you have:

- ✅ Node.js installed (v16 or higher)
- ✅ Expo account (sign up at https://expo.dev)
- ✅ EAS CLI installed globally

---

## Method 1: EAS Build (Recommended) ⭐

This is the **easiest and recommended** method for Expo projects.

### Step 1: Install EAS CLI (if not already installed)

```bash
npm install -g eas-cli
```

### Step 2: Login to Expo

```bash
eas login
```

Enter your Expo account credentials.

### Step 3: Navigate to Mobile Directory

```bash
cd /home/mamunhossain/Projects/kyau/advising-app/mobile
```

### Step 4: Build APK

```bash
eas build --platform android --profile preview
```

**What happens:**
- ✅ Code is uploaded to Expo servers
- ✅ APK is built in the cloud
- ✅ Download link is provided when complete
- ⏱️ Takes 5-15 minutes

### Step 5: Download APK

After build completes, you'll get a download link. Or visit:
```
https://expo.dev/accounts/[your-account]/projects/[project-name]/builds
```

---

## Method 2: Local Build with Gradle

```bash
./gradlew assembleRelease
```

### Step 5: Find Your APK

The APK will be located at:
```
android/app/build/outputs/apk/release/app-release.apk
```

Copy it to an easy location:
```bash
cp app/build/outputs/apk/release/app-release.apk ~/Desktop/advising-app.apk
```

---

## Full Build Commands (All in One)

```bash
cd /home/mamunhossain/Projects/kyau/advising-app/mobile
npm install
cd android
./gradlew clean
./gradlew assembleRelease
cp app/build/outputs/apk/release/app-release.apk ~/Desktop/advising-app-$(date +%Y%m%d).apk
```

This will:
1. Install dependencies
2. Clean previous builds
3. Build new release APK
4. Copy APK to Desktop with date stamp

---

## Build Types

### Debug APK (for testing)

```bash
cd android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (for distribution)

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

---

## Troubleshooting

### Error: "JAVA_HOME is not set"

Set JAVA_HOME environment variable:

```bash
# Find Java path
which java

# Set JAVA_HOME (add to ~/.bashrc for permanent)
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

### Error: "SDK location not found"

Create `local.properties` file in `android/` directory:

```bash
cd android
echo "sdk.dir=/home/mamunhossain/Android/Sdk" > local.properties
```

Replace the path with your actual Android SDK location.

### Error: "Gradle build failed"

Clean and rebuild:

```bash
cd android
./gradlew clean
./gradlew assembleRelease --stacktrace
```

### Error: "Permission denied: ./gradlew"

Make gradlew executable:

```bash
chmod +x gradlew
```

---

## Signing the APK (Optional)

For production release, you should sign the APK with a keystore.

### Generate Keystore (first time only)

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Configure Signing

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword 'your-store-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

Then build:
```bash
./gradlew assembleRelease
```

---

## After Building

### Test the APK

1. Transfer APK to Android device
2. Enable "Install from Unknown Sources" in device settings
3. Install and test the app
4. Verify all features work correctly

### Distribute the APK

Options:
- 📧 Email to users
- 🔗 Upload to Google Drive/Dropbox
- 📱 Upload to Google Play Store (requires signing)
- 🌐 Host on your website

---

## Build Checklist

Before distributing:

- [ ] Test on at least one physical device
- [ ] Verify backend connection works
- [ ] Test student registration
- [ ] Test teacher login (using add-teacher.js)
- [ ] Test appointment creation
- [ ] Test appointment accept/reject
- [ ] Check notifications work
- [ ] Verify no console errors

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `./gradlew assembleRelease` | Build release APK |
| `./gradlew assembleDebug` | Build debug APK |
| `./gradlew clean` | Clean previous builds |
| `./gradlew bundleRelease` | Build AAB for Play Store |
| `./gradlew installRelease` | Build and install on connected device |

---

## File Locations

| File | Location |
|------|----------|
| Release APK | `android/app/build/outputs/apk/release/app-release.apk` |
| Debug APK | `android/app/build/outputs/apk/debug/app-debug.apk` |
| Build logs | `android/app/build/outputs/logs/` |
| Keystore | `android/app/my-release-key.keystore` |

---

## When to Rebuild

You need to rebuild the APK when:

- ✅ You change mobile app UI (like removing teacher registration)
- ✅ You update mobile app logic
- ✅ You change app configuration
- ❌ You only change backend code (no rebuild needed)
- ❌ You only change database (no rebuild needed)

---

## Need Help?

Common issues:
1. **Build fails**: Run `./gradlew clean` first
2. **Old version installs**: Uninstall old app first
3. **Can't find APK**: Check the exact path in build output
4. **Gradle is slow**: Add `org.gradle.daemon=true` to `gradle.properties`
