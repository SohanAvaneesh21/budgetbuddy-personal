import { apiClient } from "@/app/api-client";

export const authApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Email verification endpoints
    sendVerificationOTP: builder.mutation({
      query: (email) => ({
        url: "/auth/send-verification-otp",
        method: "POST",
        body: { email },
      }),
    }),
    verifyEmailOTP: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify-email-otp",
        method: "POST",
        body: { email, otp },
      }),
    }),

    // Password reset endpoints
    sendResetOTP: builder.mutation({
      query: (email) => ({
        url: "/auth/send-reset-otp",
        method: "POST",
        body: { email },
      }),
    }),
    verifyResetOTP: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify-reset-otp",
        method: "POST",
        body: { email, otp },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ email, otp, password }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { email, otp, password },
      }),
    }),

    //skip
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
  useSendVerificationOTPMutation,
  useVerifyEmailOTPMutation,
  useSendResetOTPMutation,
  useVerifyResetOTPMutation,
  useResetPasswordMutation,
} = authApi;
