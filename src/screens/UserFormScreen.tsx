import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/MainNavigator';
import { ValidationUtils } from '../utils/validation';
import { User, UserRole, USER_ROLES } from '../types';
import { X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../utils/colors';
import { TabBar } from '../components/TabBar';
import Input from '../components/Input';
import Button from '../components/Button';
import { useToast } from '../contexts/ToastContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  getUserById,
  addUser,
  updateUser,
  selectLoading,
} from '../store/userSlice';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type UserFormRouteProp = RouteProp<RootStackParamList, 'UserForm'>;

const UserFormScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<UserFormRouteProp>();
  const { userId, mode } = route.params;
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(USER_ROLES.ADMIN as UserRole);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const tabTranslate = useRef(new Animated.Value(0)).current; // 0..2

  // Redux state
  const loading = useAppSelector(selectLoading);
  const animateTo = useCallback(
    (value: number) => {
      Animated.timing(tabTranslate, {
        toValue: value,
        duration: 500, // Medium speed animation
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    [tabTranslate],
  );

  const onTabPress = useCallback(
    (index: number) => {
      setRole(index === 0 ? USER_ROLES.ADMIN : USER_ROLES.MANAGER);
      animateTo(index);
    },
    [animateTo],
  );

  const loadUser = useCallback(async () => {
    if (!userId) return;

    try {
      const userData = await dispatch(getUserById(userId)).unwrap();
      if (userData) {
        setUser(userData);
        const nameParts = userData.name.split(' ');
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
        setEmail(userData.email || '');
        setRole(userData.role);
        animateTo(userData.role === USER_ROLES.ADMIN ? 0 : 1);
      } else {
        Alert.alert('Error', 'User not found', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load user', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setInitialLoading(false);
    }
  }, [userId, navigation, animateTo, dispatch]);

  useEffect(() => {
    if (isEditMode && userId) {
      loadUser();
    } else {
      setInitialLoading(false);
    }
  }, [userId, isEditMode, loadUser]);

  const handleSave = async () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const validation = ValidationUtils.validateUser({ name: fullName, email });
    if (!validation.isValid) {
      const fieldErrors: { [key: string]: string } = {};
      validation.errors.forEach(error => {
        if (error.includes('name') || error.includes('Name')) {
          fieldErrors.name = error;
        } else if (error.includes('email') || error.includes('Email')) {
          fieldErrors.email = error;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    try {
      if (isEditMode && userId) {
        await dispatch(
          updateUser({
            userId,
            userData: {
              name: fullName,
              email: email.trim() || undefined,
              role,
            },
          }),
        ).unwrap();
        showToast('User updated successfully', 'success');
        navigation.goBack();
      } else if (isAddMode) {
        await dispatch(
          addUser({
            name: fullName,
            email: email.trim() || undefined,
            role,
          }),
        ).unwrap();
        showToast('User created successfully', 'success');
        navigation.goBack();
      }
    } catch (error) {
      showToast(`Failed to ${isEditMode ? 'update' : 'create'} user`, 'error');
    }
  };

  const handleCancel = () => {
    if (isEditMode && user) {
      // Check if there are changes in edit mode
      const hasChanges =
        firstName !== (user.name.split(' ')[0] || '') ||
        lastName !== (user.name.split(' ').slice(1).join(' ') || '') ||
        email !== (user.email || '') ||
        role !== user.role;

      if (hasChanges) {
        Alert.alert(
          'Discard Changes',
          'Are you sure you want to discard your changes?',
          [
            { text: 'Keep Editing', style: 'cancel' },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => navigation.goBack(),
            },
          ],
        );
        return;
      }
    } else if (isAddMode) {
      // Check if there are any inputs in add mode
      if (firstName.trim() || lastName.trim() || email.trim()) {
        Alert.alert(
          'Discard Changes',
          'Are you sure you want to discard your changes?',
          [
            { text: 'Keep Editing', style: 'cancel' },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => navigation.goBack(),
            },
          ],
        );
        return;
      }
    }

    navigation.goBack();
  };

  const getHeaderTitle = () => {
    if (isEditMode) return 'Edit User';
    if (isAddMode) return 'New User';
    return 'User Form';
  };

  const getButtonText = () => {
    if (isEditMode) return loading ? 'Updating...' : 'Update User';
    if (isAddMode) return loading ? 'Creating...' : 'Create User';
    return 'Save';
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading user...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isEditMode && !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Button onPress={handleCancel} variant="none" size="small">
        <X size={24} color={colors.primary} />
      </Button>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
            {/* Name Field */}

            <Input
              value={firstName.trim()}
              onChangeText={text => {
                setFirstName(text);
              }}
              placeholder="First Name"
              autoCapitalize="words"
              error={errors.name}
            />

            <Input
              value={lastName.trim()}
              onChangeText={setLastName}
              placeholder="Last Name"
              autoCapitalize="words"
              error={errors.name}
            />
            {/* Email Field */}
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />

            <Text style={styles.headerSubtitle}>User Role</Text>
            <TabBar
              currentPage={role === USER_ROLES.ADMIN ? 0 : 1}
              data={[
                { index: 0, label: 'Admin' },
                { index: 1, label: 'Manager' },
              ]}
              onTabPress={onTabPress}
              animateTo={animateTo}
              tabTranslate={tabTranslate}
            />
          </View>
        </ScrollView>

        {/* Save Button */}
        <Button
          title={getButtonText()}
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          fullWidth
          style={styles.saveButton}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  closeButton: {
    padding: 4,
    margin: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginVertical: 16,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.black,
    marginVertical: 16,
  },
  headerSpacer: {
    width: 28,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  input: {
    fontSize: 16,
    color: colors.primaryText,
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  inputUnderline: {
    height: 1,
    backgroundColor: colors.secondary,
    marginTop: 4,
  },
  fieldError: {
    fontSize: 12,
    color: colors.error,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 4,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeRoleButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.secondaryText,
  },
  activeRoleButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.secondaryText,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: colors.secondary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  },
});

export default UserFormScreen;
