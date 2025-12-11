# Famly - Family Social Network App

A mobile iOS app that helps families discover and connect with other families in their local area. A thoughtful, trust-first social network designed specifically for families.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jakehb1/FAMLY.git
cd FAMLY
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. Start the development server:
```bash
npm start
```

## 📱 Running the App

### Web (Browser)
```bash
npm run web
```
Opens at `http://localhost:8081`

### iOS Simulator
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

## 🏗️ Building for Production

### Web (Vercel)
The app is configured for automatic deployment to Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

### iOS App Store
See [APP_STORE_GUIDE.md](./APP_STORE_GUIDE.md) for complete iOS submission guide.

```bash
# Build for iOS
npm run build:ios

# Or use EAS directly
eas build --platform ios --profile production
```

## 🛠️ Development

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android (future)
- `npm run web` - Run on web
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

```
/app
  /(auth)          # Authentication screens
  /(onboarding)    # Onboarding flow
  /(tabs)          # Main tab navigation
  /family          # Family profile screens
  /conversation    # Messaging screens
  /event           # Event screens (v1.1)

/components
  /ui              # Reusable UI components
  /auth            # Authentication components
  /families        # Family-related components
  /connections     # Connection components
  /messages        # Messaging components
  /events          # Event components

/lib               # Utility functions and configurations
/hooks             # Custom React hooks
/stores            # Zustand state stores
/types             # TypeScript type definitions
/constants         # App constants
/scripts           # Build scripts
```

## 🔧 Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Backend:** Supabase (auth, database, real-time, storage)
- **Maps:** MapKit (iOS native) via react-native-maps
- **Push Notifications:** Expo Notifications + APNs
- **State Management:** Zustand
- **Styling:** NativeWind (Tailwind for React Native)

## 📝 Environment Variables

Required environment variables (see `.env.example`):

- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `EXPO_PUBLIC_APP_ENV` - Environment (development/production)

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Deploying to Vercel
- [App Store Guide](./APP_STORE_GUIDE.md) - iOS App Store submission
- [Contributing](./CONTRIBUTING.md) - Contributing guidelines

## 🐛 Troubleshooting

### Build Issues
- Clear cache: `npm cache clean --force && rm -rf node_modules && npm install`
- Update Expo: `npx expo install --fix`

### TypeScript Errors
- Run `npm run type-check` to see all errors
- Ensure NativeWind types are properly configured

### Metro Bundler Issues
- Reset cache: `npm start -- --reset-cache`

## 📄 License

Private - All rights reserved

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.
