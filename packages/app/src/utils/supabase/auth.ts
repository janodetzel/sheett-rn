import { Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "./client";

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthResult {
  success: boolean;
  error?: AuthError;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignUpParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

/**
 * Sign in with email and password
 */
export const signIn = async ({
  email,
  password,
}: SignInParams): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.name,
        },
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        message: "An unexpected error occurred during sign in",
      },
    };
  }
};

/**
 * Sign up with email and password
 */
export const signUp = async ({
  email,
  password,
}: SignUpParams): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.name,
        },
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        message: "An unexpected error occurred during sign up",
      },
    };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.name,
        },
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        message: "An unexpected error occurred during sign out",
      },
    };
  }
};

/**
 * Reset password for email
 */
export const resetPassword = async ({
  email,
}: ResetPasswordParams): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "sheett://reset-password",
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.name,
        },
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        message: "An unexpected error occurred during password reset",
      },
    };
  }
};

/**
 * Get current user session
 */
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
};

/**
 * Get current session
 */
export const getCurrentSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
};

/**
 * Update user password
 */
export const updatePassword = async (password: string): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.name,
        },
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        message: "An unexpected error occurred while updating password",
      },
    };
  }
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Handle auth errors with user-friendly messages
 */
export const handleAuthError = (
  result: AuthResult,
  showAlert = true
): boolean => {
  if (!result.success && result.error) {
    if (showAlert) {
      Alert.alert("Error", result.error.message);
    }
    return false;
  }
  return true;
};
