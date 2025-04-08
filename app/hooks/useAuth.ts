import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { SignUpRequest, SignUpResponse, SignInRequest, SignInResponse, ForgotPasswordRequest, ForgotPasswordResponse } from '../types/auth';
import { login, forgotPassword } from '../services/RequestManager';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useSignUp = () => {
  return useMutation<SignUpResponse, Error, SignUpRequest>({
    mutationFn: async (data) => {
      const response = await axios.post(`${API_URL}/auth/signUp`, data);
      return response.data;
    },
  });
};

export interface LoginError extends Error {
  message: string;
}

export const useSignIn = () => {
  return useMutation<SignInResponse, LoginError, SignInRequest>({
    mutationFn: async (data) => {
      const result = await login(data.userName, data.password);
      
      if (result.success) {
        // Return a valid SignInResponse structure to maintain API consistency
        return {
          success: true,
          message: "Login successful",
          // Add an empty data object to satisfy the type
          data: {
            accessToken: localStorage.getItem("accessToken") || "",
            refreshToken: localStorage.getItem("refreshToken") || "",
            roles: []
          }
        };
      } else {
        // Throw an error with the message from the API to be caught by the form
        const error = new Error(result.message || "Sai tên đăng nhập hoặc mật khẩu") as LoginError;
        error.message = result.message || "Sai tên đăng nhập hoặc mật khẩu";
        throw error;
      }
    },
  });
};

export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
    mutationFn: async (data) => {
      const response = await forgotPassword(data.email);
      return response;
    },
  });
}; 