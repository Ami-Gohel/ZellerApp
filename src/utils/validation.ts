export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationUtils {
  static validateName(name: string): ValidationResult {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (name.length > 50) {
      errors.push('Name must not exceed 50 characters');
    }

    // Check for special characters (only alphabets and spaces allowed)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (name && !nameRegex.test(name)) {
      errors.push('Name can only contain alphabets and spaces');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];

    if (email && email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateUser(userData: { name: string; email?: string }): ValidationResult {
    const nameValidation = this.validateName(userData.name);
    const emailValidation = this.validateEmail(userData.email || '');

    const allErrors = [...nameValidation.errors, ...emailValidation.errors];

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }
}
