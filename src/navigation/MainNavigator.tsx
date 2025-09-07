import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserListScreen from '../screens/UserListScreen';
import UserFormScreen from '../screens/UserFormScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  UserForm: { mode: 'add' | 'edit'; userId?: string };
};

export type MainTabParamList = {
  AllUsers: { filter: string };
  AdminUsers: { filter: string };
  ManagerUsers: { filter: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={UserListScreen} />
        <Stack.Screen
          name="UserForm"
          component={UserFormScreen}
          options={{
            presentation: 'modal',
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
