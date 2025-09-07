import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  SectionList,
  RefreshControl,
  StyleSheet,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/MainNavigator';
import { User, UserRole, USER_ROLES } from '../types';
import UserCard from '../components/UserCard';
import { Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../utils/colors';
import { TabBar } from '../components/TabBar';
import Button from '../components/Button';
import { useToast } from '../contexts/ToastContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loadUsers,
  refreshUsers,
  deleteUser,
  setSearchQuery,
  setCurrentPage,
  selectFilteredUsers,
  selectRefreshing,
  selectSearchQuery,
  selectCurrentPage,
} from '../store/userSlice';
type UserListScreenProps = {
  route?: {
    params?: {
      filter?: 'all' | UserRole;
    };
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const UserListScreen: React.FC<UserListScreenProps> = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  // Redux state
  const users = useAppSelector(selectFilteredUsers);
  const refreshing = useAppSelector(selectRefreshing);
  const searchQuery = useAppSelector(selectSearchQuery);
  const currentPage = useAppSelector(selectCurrentPage);

  const tabTranslate = useRef(new Animated.Value(0)).current; // 0..2

  // Load users on component mount
  const loadUsersData = useCallback(async () => {
    try {
      await dispatch(loadUsers()).unwrap();
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadUsersData();
    }, [loadUsersData]),
  );

  // Animate tab indicator when page changes

  const onRefresh = useCallback(async () => {
    try {
      await dispatch(refreshUsers()).unwrap();
    } catch (error) {
      console.error('Refresh error:', error);
      Alert.alert('Error', 'Failed to refresh users');
    }
  }, [dispatch]);

  const animateTo = useCallback(
    (value: number) => {
      Animated.timing(tabTranslate, {
        toValue: value,
        duration: 1000, // Medium speed animation
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    [tabTranslate],
  );

  const onTabPress = useCallback(
    (index: number) => {
      animateTo(index);
      dispatch(setCurrentPage(index));
    },
    [animateTo, dispatch],
  );

  const handleDeleteUser = useCallback(
    async (userId: string, userName: string) => {
      Alert.alert(
        'Delete User',
        `Are you sure you want to delete ${userName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await dispatch(deleteUser(userId)).unwrap();
                showToast('User deleted successfully', 'success');
              } catch (error) {
                showToast('Failed to delete user', 'error');
              }
            },
          },
        ],
      );
    },
    [dispatch, showToast],
  );

  const handleEditUser = useCallback(
    (userId: string) => {
      navigation.navigate('UserForm', { mode: 'edit', userId });
    },
    [navigation],
  );

  const groupUsersByLetter = (userList: User[]) => {
    const grouped: { [key: string]: User[] } = {};

    userList.forEach(user => {
      const firstLetter = user.name.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(user);
    });

    return Object.keys(grouped)
      .sort()
      .map(letter => ({
        title: letter,
        data: grouped[letter],
      }));
  };
  const renderUser = ({ item }: { item: User }) => (
    <UserCard
      user={item}
      onEdit={() => handleEditUser(item.id!)}
      onDelete={() => handleDeleteUser(item.id!, item.name)}
    />
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: { title: string; data: User[] };
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  const renderUserList = (filter: 'all' | UserRole) => {
    // Filter users based on the current filter
    let usersForFilter = users;
    if (filter !== 'all') {
      usersForFilter = users.filter(user => user.role === filter);
    }

    const sections = groupUsersByLetter(usersForFilter);

    const renderEmptyList = () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No users found</Text>
        <Text style={styles.emptySubtext}>
          {searchQuery
            ? 'Try adjusting your search'
            : 'Pull to refresh to load users'}
        </Text>
      </View>
    );
    return (
      <SectionList
        sections={sections}
        renderItem={renderUser}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.id!}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={renderEmptyList}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* TabBar with integrated PagerView */}
      <TabBar
        currentPage={currentPage}
        onTabPress={onTabPress}
        animateTo={animateTo}
        tabTranslate={tabTranslate}
        searchQuery={searchQuery}
        setSearchQuery={(query: string) => dispatch(setSearchQuery(query))}
        data={[
          { index: 0, label: 'All' },
          { index: 1, label: 'Admin' },
          { index: 2, label: 'Manager' },
        ]}
      >
        <View key="0">{renderUserList('all')}</View>
        <View key="1">{renderUserList(USER_ROLES.ADMIN)}</View>
        <View key="2">{renderUserList(USER_ROLES.MANAGER)}</View>
      </TabBar>

      {/* Add Button */}
      <Button
        onPress={() => navigation.navigate('UserForm', { mode: 'add' })}
        variant="primary"
        size="large"
        style={styles.addButton}
      >
        <Plus size={24} color="white" />
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    marginBottom: 8,
    marginLeft: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.black,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.secondaryText,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default UserListScreen;
