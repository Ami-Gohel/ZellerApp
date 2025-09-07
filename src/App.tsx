import React, { useState, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { apolloClient } from './graphql/client';
import { sqliteService } from './services/SQLiteService';
import { store } from './store';
import { ToastProvider } from './contexts/ToastContext';
import MainNavigator from './navigation/MainNavigator';
import InitializationScreen from './screens/InitializationScreen';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await sqliteService.initDatabase();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initializeDatabase();
  }, []);

  const handleInitializationComplete = () => {
    setIsInitialized(true);
  };

  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <ToastProvider>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

          {isInitialized ? (
            <MainNavigator />
          ) : (
            <InitializationScreen
              onInitializationComplete={handleInitializationComplete}
            />
          )}
        </ToastProvider>
      </ApolloProvider>
    </Provider>
  );
};

export default App;
