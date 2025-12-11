# Famly - Family Social Network App

A mobile iOS app that helps families discover and connect with other families in their local area. A thoughtful, trust-first social network designed specifically for families.

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Backend:** Supabase (auth, database, real-time, storage)
- **Maps:** MapKit (iOS native) via react-native-maps
- **Push Notifications:** Expo Notifications + APNs
- **State Management:** Zustand
- **Styling:** NativeWind (Tailwind for React Native)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)

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

## Project Structure

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
  /families        # Family-related components
  /connections     # Connection components
  /messages        # Messaging components
  /events          # Event components

/lib               # Utility functions and configurations
/hooks             # Custom React hooks
/stores            # Zustand state stores
/types             # TypeScript type definitions
/constants         # App constants
```

## Development

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android (future)
- `npm run web` - Run on web
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

Private - All rights reserved

