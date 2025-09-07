import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useAppDispatch } from '../store/hooks';
import { refreshUsers } from '../store/userSlice';

interface InitializationScreenProps {
  onInitializationComplete: () => void;
}

const InitializationScreen: React.FC<InitializationScreenProps> = ({
  onInitializationComplete,
}) => {
  const [status, setStatus] = useState('Initializing...');
  const dispatch = useAppDispatch();

  const initializeApp = useCallback(async () => {
    try {
      setStatus('Syncing data from server...');
      await dispatch(refreshUsers()).unwrap();
      setStatus('Initialization complete!');

      // Small delay to show completion message
      setTimeout(() => {
        onInitializationComplete();
      }, 1000);
    } catch (error) {
      console.error('Initialization error:', error);
      setStatus('Initialization failed');
      Alert.alert(
        'Connection Error',
        'Failed to sync data from server. The app will work in offline mode.',
        [
          {
            text: 'Continue Offline',
            onPress: onInitializationComplete,
          },
        ],
      );
    }
  }, [dispatch, onInitializationComplete]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default InitializationScreen;
