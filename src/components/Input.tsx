import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { colors } from '../utils/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
  errorStyle?: any;
}

const Input: React.FC<InputProps> = ({
  error,
  containerStyle,
  inputStyle,
  errorStyle,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, error && styles.inputError, inputStyle]}
        placeholderTextColor={colors.secondaryText}
        {...textInputProps}
      />
      {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.secondaryText,
    marginBottom: 8,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  },
});

export default Input;
