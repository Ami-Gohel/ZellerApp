import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from '../types';
import { Pencil, Trash } from 'lucide-react-native';
import { colors } from '../utils/colors';
import { USER_ROLE } from '../types';
import Button from './Button';

interface UserCardProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  // Compute initials from name
  const initials = user.name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={[styles.roleText]}>
            {USER_ROLE[user.role as keyof typeof USER_ROLE]}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            onPress={onEdit}
            variant="outline"
            size="small"
            style={styles.actionButton}
          >
            <Pencil size={18} color={colors.primary} />
          </Button>
          <Button
            onPress={onDelete}
            variant="outline"
            size="small"
            style={styles.actionButton}
          >
            <Trash size={18} color={colors.primary} />
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: colors.tertiary,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '300',
    marginLeft: 4,
    color: colors.secondaryText,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: colors.tertiary,
  },
  editButton: {
    backgroundColor: '#E3F2FD',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
});

export default UserCard;
