# Zeller React Native App

A React Native application that displays, filters, and manages a list of users with offline capabilities and modern UI components.

## Features

- **Data Integration**: Fetches user data from GraphQL API and stores in local SQLite database
- **User Management**: Add, edit, and delete users with form validation
- **Filtering & Search**: Filter by user role (Admin/Manager) and search by name
- **Offline Support**: Works offline with local database persistence
- **Smooth Animations**: PagerView with smooth tab transitions
- **Pull-to-Refresh**: Refresh data from API
- **Toast Notifications**: Modern toast notifications for user feedback
- **Reusable Components**: Custom Input and Button components
- **Cross-Platform**: Runs on both iOS and Android

## Tech Stack

- **React Native** 0.81.1 with TypeScript
- **react-native-sqlite-storage** for local database
- **Redux Toolkit** for state management
- **Apollo Client** for GraphQL integration
- **React Navigation** for navigation
- **React Native Pager View** for tab animations
- **Lucide React Native** for icons
- **Jest** for testing

## Prerequisites

- Node.js (v20 or higher)
- React Native CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd ZellerApp
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. For iOS, install CocoaPods dependencies:
   ```bash
   cd ios && pod install && cd ..
   ```

4. Start the mock server (in a separate terminal):
   ```bash
   cd ../mock-server
   yarn install
   yarn start
   ```

## Running the App

### iOS
```bash
yarn run ios
```

### Android
```bash
yarn run android
```

## Mock Server

The app connects to a mock GraphQL server. The mock server is already set up in the parent directory and should be running on `http://localhost:9002`.

**Note**: Make sure the mock server is running before starting the React Native app, as the app will attempt to sync data from the API during initialization.

## Testing

Run the test suite:
```bash
npm test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Custom button component
│   ├── Input.tsx       # Custom input component
│   ├── TabBar.tsx      # Tab navigation component
│   ├── Toast.tsx       # Toast notification component
│   └── UserCard.tsx    # User card component
├── contexts/           # React contexts
│   └── ToastContext.tsx # Toast notification context
├── graphql/            # GraphQL client and queries
│   ├── client.ts
│   └── queries.ts
├── navigation/         # Navigation configuration
│   └── MainNavigator.tsx
├── screens/            # Screen components
│   ├── InitializationScreen.tsx
│   ├── UserFormScreen.tsx
│   └── UserListScreen.tsx
├── services/           # Business logic services
│   ├── SQLiteService.ts # SQLite database service
│   └── UserService.ts   # User management service
├── store/              # Redux store configuration
│   ├── hooks.ts        # Typed Redux hooks
│   ├── index.ts        # Store configuration
│   └── userSlice.ts    # User state management
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
    ├── colors.ts       # Color constants
    ├── constants.ts    # App constants
    └── validation.ts   # Form validation utilities
```

## Key Features Implementation

### Database Integration
- Uses **react-native-sqlite-storage** for direct SQLite database operations
- Automatic synchronization between API and local database
- Offline-first approach with sync indicators
- Soft delete functionality to prevent re-adding deleted users

### State Management
- **Redux Toolkit** for centralized state management
- Async thunks for API operations
- Optimized selectors for data filtering
- Immutable state updates with Immer

### User Management
- Form validation with real-time feedback
- Name validation (alphabets and spaces only, max 50 characters)
- Email validation (optional but must be valid format)
- Role selection (Admin/Manager)
- Toast notifications for user feedback

### UI/UX Components
- **Custom Input Component**: Reusable input with labels, validation, and error states
- **Custom Button Component**: Multiple variants (primary, secondary, outline, danger) with loading states
- **Toast Notifications**: Modern toast system with 4 types (success, error, info, warning)
- Smooth tab animations using PagerView
- Pull-to-refresh functionality
- Search and filter capabilities
- Material Design-inspired UI
- Cross-platform compatibility

### Data Flow
1. App initializes SQLite database on startup
2. Users are loaded from local database via Redux
3. Pull-to-refresh syncs with GraphQL API
4. Local CRUD operations update database and Redux state
5. Real-time UI updates with Redux state management

## API Integration

The app integrates with the provided GraphQL API:
- **Endpoint**: Configured in `aws-exports.js`
- **Query**: `listZellerCustomers` for fetching users
- **Authentication**: API Key authentication

## Validation Rules

- **Name**: Required, alphabets and spaces only, max 50 characters
- **Email**: Optional, must be valid email format if provided
- **Role**: Required, must be either "Admin" or "Manager"
 
## How it looks visually

<img width="180" height="400" alt="Screenshot_1757256638" src="https://github.com/user-attachments/assets/04257788-e41b-4b29-a222-13bd2efb593c" />
<img width="180" height="400" alt="Screenshot_1757256643" src="https://github.com/user-attachments/assets/891e89d7-bc7b-4f10-bea4-68b794185763"/>
<img width="180" height="400" alt="Screenshot_1757256648" src="https://github.com/user-attachments/assets/1c5a75ab-4af1-48cf-8605-078f2f272fb8" />
<img width="180" height="400" alt="Screenshot_1757256650" src="https://github.com/user-attachments/assets/eff97056-fffb-4ee1-99c9-05662581963d" />

## Tab Animation
https://github.com/user-attachments/assets/cfe2adbe-dc41-4491-8e58-d9613bfb25f9


