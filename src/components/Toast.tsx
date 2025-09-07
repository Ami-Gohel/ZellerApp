import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../utils/colors';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  visible: boolean;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  visible,
}) => {
  const hideToast = useCallback(() => {
    onClose();
  }, [onClose]);

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return styles.successToast;
      case 'error':
        return styles.errorToast;
      case 'warning':
        return styles.warningToast;
      default:
        return styles.infoToast;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color={colors.white} />;
      case 'error':
        return <AlertCircle size={20} color={colors.white} />;
      case 'warning':
        return <AlertCircle size={20} color={colors.white} />;
      default:
        return <Info size={20} color={colors.white} />;
    }
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, getToastStyle()]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>{getIcon()}</View>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
          <X size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: colors.white,
    fontWeight: '500',
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
  successToast: {
    backgroundColor: '#10B981',
  },
  errorToast: {
    backgroundColor: colors.error,
  },
  warningToast: {
    backgroundColor: '#F59E0B',
  },
  infoToast: {
    backgroundColor: colors.primary,
  },
});

export default Toast;
