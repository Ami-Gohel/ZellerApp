import { ValidationUtils } from '../utils/validation';

describe('ValidationUtils', () => {
  describe('validateName', () => {
    it('should return valid for a proper name', () => {
      const result = ValidationUtils.validateName('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for empty name', () => {
      const result = ValidationUtils.validateName('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name is required');
    });

    it('should return invalid for name with special characters', () => {
      const result = ValidationUtils.validateName('John@Doe');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name can only contain alphabets and spaces');
    });

    it('should return invalid for name exceeding 50 characters', () => {
      const longName = 'A'.repeat(51);
      const result = ValidationUtils.validateName(longName);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name must not exceed 50 characters');
    });
  });

  describe('validateEmail', () => {
    it('should return valid for proper email', () => {
      const result = ValidationUtils.validateEmail('john@example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return valid for empty email', () => {
      const result = ValidationUtils.validateEmail('');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for malformed email', () => {
      const result = ValidationUtils.validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Please enter a valid email address');
    });
  });

  describe('validateUser', () => {
    it('should return valid for proper user data', () => {
      const result = ValidationUtils.validateUser({
        name: 'John Doe',
        email: 'john@example.com',
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for user with invalid name and email', () => {
      const result = ValidationUtils.validateUser({
        name: 'John@Doe',
        email: 'invalid-email',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });
});
