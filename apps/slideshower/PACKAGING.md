# Packaging Slideshower

## macOS DMG

```bash
npm run package:mac
```

Output:

```text
release/Slideshower-0.1.0-arm64.dmg
```

This local build is unsigned, so macOS may show a Gatekeeper warning the first time it is opened. For public distribution, add Apple Developer signing and notarization.

### Gatekeeper, GitHub Releases, and "damaged" DMGs

The DMG generated locally can open correctly on the same Mac because macOS treats it as a local file. After the same DMG is uploaded to GitHub Releases and downloaded again through a browser, macOS adds the `com.apple.quarantine` attribute. That makes Gatekeeper apply stricter checks to the app inside the DMG.

If the app is unsigned or not notarized, macOS may show a misleading warning such as:

```text
"Slideshower" is damaged and can't be opened.
```

This usually does not mean GitHub corrupted the DMG. It means the downloaded app is blocked because it is not trusted by Gatekeeper.

Useful checks on a downloaded build:

```bash
xattr -l release/Slideshower-0.1.0-arm64.dmg
spctl --assess --type open --verbose release/Slideshower-0.1.0-arm64.dmg
```

For a trusted local test only, copy the app to `Applications` and remove the quarantine attribute:

```bash
xattr -dr com.apple.quarantine /Applications/Slideshower.app
```

Do not present this as the normal public installation path. It is a workaround for testers who explicitly trust the build.

For public macOS releases, the correct fix is:

1. Join the Apple Developer Program.
2. Create and install a `Developer ID Application` certificate.
3. Sign the Electron app with hardened runtime enabled.
4. Notarize the app or DMG with Apple.
5. Staple the notarization ticket before uploading the release asset.

## Windows EXE

```bash
npm run package:win
```

On macOS, Windows packaging may require Wine. The most reliable option for a release `.exe` is running the same command on Windows or in a Windows CI runner.

The script builds both Windows `x64` and Windows `arm64` installers. This matters when building from Apple Silicon Macs, because otherwise only a Windows ARM64 package may be produced. The NSIS installers are configured to create Start Menu and Desktop shortcuts named `Slideshower`.

## Android APK

Install Android Studio, the Android SDK, and a JDK first.

### Android Studio Setup On macOS

1. Download Android Studio:

   ```text
   https://developer.android.com/studio
   ```

2. Install it by dragging Android Studio into `Applications`.

3. Open Android Studio once and complete the first setup wizard.

4. In Android Studio, open:

   ```text
   Android Studio > Settings > Languages & Frameworks > Android SDK
   ```

5. In `SDK Platforms`, install at least one recent Android platform, for example the latest stable Android API.

6. In `SDK Tools`, make sure these are installed:

   ```text
   Android SDK Platform-Tools
   Android SDK Build-Tools
   Android SDK Command-line Tools
   Android Emulator
   ```

7. Note the `Android SDK Location` shown at the top of that settings screen. On macOS it is usually:

   ```bash
   ~/Library/Android/sdk
   ```

8. Add the SDK path to your shell profile:

   ```bash
   nano ~/.zshrc
   ```

   Add:

   ```bash
   export ANDROID_HOME="$HOME/Library/Android/sdk"
   export ANDROID_SDK_ROOT="$ANDROID_HOME"
   export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
   ```

   Save, then reload:

   ```bash
   source ~/.zshrc
   ```

9. Verify:

   ```bash
   echo $ANDROID_HOME
   ls "$ANDROID_HOME"
   java -version
   ```

10. Then run:

   ```bash
   npm run package:android
   ```

If `java -version` fails, install a JDK. Android Studio often includes one, but installing a standard JDK also works.

On macOS, the Android SDK is usually installed here:

```bash
~/Library/Android/sdk
```

If Gradle says `SDK location not found`, open Android Studio and install the SDK from:

```text
Android Studio > Settings > Languages & Frameworks > Android SDK
```

Then set these environment variables in your shell profile, for example `~/.zshrc`:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$PATH"
```

Reload the terminal:

```bash
source ~/.zshrc
```

If your SDK is installed somewhere else, create this file:

```text
android/local.properties
```

with:

```properties
sdk.dir=/absolute/path/to/Android/sdk
```

The packaging script now tries to create `android/local.properties` automatically when it can find the SDK.

First-time setup:

```bash
npm run android:init
```

This also generates the native Android launcher icons from `public/logo.png`.

Build a debug APK:

```bash
npm run package:android
```

The packaging script syncs Capacitor and regenerates Android launcher icons before Gradle builds the APK.

Output is usually under:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

For Play Store or public distribution, generate a signed release APK/AAB from Android Studio.

## All Targets

```bash
npm run package:all
```

This tries macOS, Windows, and Android in sequence. It only succeeds if the current machine has all required toolchains installed.

## Cleaning Generated Packages

To remove generated installers/packages and keep the project folder cleaner:

```bash
npm run clean:packages
```

This removes files such as:

```text
release/*.dmg
release/*.exe
android/app/build/outputs/apk/debug/*.apk
android/app/build/outputs/apk/release/*.apk
```

It does not remove source files or packaging configuration.

## Changing Version

The app version comes from `package.json`:

```json
{
  "version": "0.1.0"
}
```

This version is used by Electron Builder for installer names such as:

```text
Slideshower-0.1.0-arm64.dmg
```

Recommended command:

```bash
npm version patch --no-git-tag-version
```

Use:

```bash
npm version minor --no-git-tag-version
npm version major --no-git-tag-version
```

when you want to bump `0.1.0` to `0.2.0` or `1.0.0`.

After changing the version, rebuild the package:

```bash
npm run package:mac
```

For Android, also update/sync the native project:

```bash
npm run android:sync
```

If you are preparing a public Android release, also update the native Android `versionCode`/`versionName` in Android Studio before generating a signed APK/AAB.
