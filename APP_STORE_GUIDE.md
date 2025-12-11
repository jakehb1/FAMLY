# iOS App Store Submission Guide

## Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at https://developer.apple.com
   - Enroll in the Apple Developer Program

2. **Expo Application Services (EAS) Account**
   - Sign up at https://expo.dev
   - Install EAS CLI: `npm install -g eas-cli`
   - Login: `eas login`

## Step 1: Configure EAS

1. Initialize EAS in your project:
   ```bash
   eas build:configure
   ```

2. Update `eas.json` with your project settings (already created)

3. Update `app.json` with your EAS project ID:
   ```bash
   eas init
   ```

## Step 2: Build for iOS

### Development Build (for testing)
```bash
eas build --platform ios --profile development
```

### Production Build (for App Store)
```bash
eas build --platform ios --profile production
```

This will:
- Create an iOS build
- Upload to EAS servers
- Provide a download link when complete

## Step 3: Submit to App Store

### Option A: Using EAS Submit (Recommended)
```bash
eas submit --platform ios
```

This will:
- Guide you through App Store Connect setup
- Upload your build automatically
- Handle certificates and provisioning

### Option B: Manual Submission
1. Download the `.ipa` file from EAS
2. Use Transporter app or Xcode to upload
3. Complete submission in App Store Connect

## Step 4: App Store Connect Setup

1. **Create App Record**
   - Go to https://appstoreconnect.apple.com
   - Click "My Apps" → "+" → "New App"
   - Fill in app information:
     - Name: Famly
     - Primary Language: English
     - Bundle ID: com.famly.app
     - SKU: famly-001

2. **App Information**
   - Category: Social Networking
   - Age Rating: 4+ (no objectionable content)
   - Privacy Policy URL: (required)
   - Terms of Service URL: (required)

3. **App Store Listing**
   - Screenshots (required for all device sizes)
   - Description
   - Keywords
   - Support URL
   - Marketing URL (optional)

4. **Version Information**
   - What's New in This Version
   - Screenshots
   - App Preview (optional but recommended)

## Step 5: Required Assets

### App Icon
- 1024x1024px PNG
- No transparency
- No rounded corners (iOS adds them)
- Place in `assets/icon.png`

### Screenshots
Required sizes:
- 6.7" Display (iPhone 14 Pro Max): 1290 x 2796
- 6.5" Display (iPhone 11 Pro Max): 1242 x 2688
- 5.5" Display (iPhone 8 Plus): 1242 x 2208

### App Preview Video (Optional)
- 15-30 seconds
- Show key features
- Can significantly improve conversion

## Step 6: Privacy & Compliance

### Privacy Policy
Required. Must include:
- What data you collect
- How you use it
- Third-party services (Supabase)
- User rights

### App Privacy Details
In App Store Connect, answer:
- Data collection practices
- Data linked to user
- Data used to track user
- Data not collected

## Step 7: TestFlight Beta

1. **Add Testers**
   - Internal testers (up to 100)
   - External testers (up to 10,000)

2. **Upload Build**
   - EAS submit will automatically create TestFlight build
   - Or manually upload via App Store Connect

3. **Beta Testing**
   - Test for at least 1-2 weeks
   - Gather feedback
   - Fix critical bugs

## Step 8: Submit for Review

1. **Complete All Sections**
   - App Information ✓
   - Pricing and Availability ✓
   - Version Information ✓
   - App Store Review Information ✓

2. **App Review Information**
   - Demo account credentials (if needed)
   - Notes for reviewer
   - Contact information

3. **Submit for Review**
   - Click "Submit for Review"
   - Wait for review (typically 24-48 hours)

## Common Issues & Solutions

### Build Fails
- Check `eas.json` configuration
- Verify bundle identifier matches App Store Connect
- Check for missing dependencies

### Rejected for Missing Privacy Policy
- Add privacy policy URL in App Store Connect
- Ensure it's accessible and complete

### Rejected for Missing Permissions
- Update `app.json` with proper permission descriptions
- Ensure Info.plist has all required descriptions

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

