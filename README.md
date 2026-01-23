# WhatsApp Clone

A WhatsApp clone built with React Native and Firebase.

## Features

- Phone number authentication with OTP verification
- Real-time chat functionality
- User profiles
- Settings screen
- Firebase Authentication & Firestore integration

## Tech Stack

- React Native
- TypeScript
- Firebase Authentication
- Cloud Firestore
- React Navigation

## Getting Started

### Prerequisites

- Node.js (>=20)
- React Native development environment set up
- Firebase project configured

### Installation

```bash
# Install dependencies
yarn install

# For iOS (first time only)
cd ios && pod install && cd ..

# Run on Android
yarn android

# Run on iOS
yarn ios
```

## Project Structure

```
src/
├── assets/          # Images, fonts, icons
├── components/      # Reusable components
├── modules/         # Feature modules (auth, home, settings, etc.)
├── navigation/      # Navigation configuration
├── services/        # Firebase services, API calls
├── styles/          # Global styles (colors, spacing, typography)
└── types/           # TypeScript type definitions
```

## License

This project is for educational purposes.
