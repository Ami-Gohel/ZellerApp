import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../utils/colors';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'none';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  children,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = colors.primary;
        break;
      case 'secondary':
        baseStyle.backgroundColor = colors.secondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.primary;
        break;
      case 'none':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 0;
        baseStyle.alignItems = 'flex-start';
        baseStyle.justifyContent = 'flex-start';
        baseStyle.padding = 20;
        break;
      case 'danger':
        baseStyle.backgroundColor = colors.error;
        break;
    }

    return StyleSheet.flatten([baseStyle, style]);
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    if (disabled || loading) {
      baseStyle.opacity = 0.7;
    }

    switch (size) {
      case 'small':
        baseStyle.fontSize = 14;
        break;
      case 'medium':
        baseStyle.fontSize = 16;
        break;
      case 'large':
        baseStyle.fontSize = 18;
        break;
    }

    switch (variant) {
      case 'primary':
        baseStyle.color = colors.white;
        break;
      case 'secondary':
        baseStyle.color = colors.white;
        break;
      case 'outline':
        baseStyle.color = colors.primary;
        break;
      case 'danger':
        baseStyle.color = colors.white;
        break;
    }

    return StyleSheet.flatten([baseStyle, textStyle]);
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : colors.white}
          size="small"
        />
      ) : (
        <>
          {title && <Text style={getTextStyle()}>{title}</Text>}
          {children}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
