/**
 * GoSeat Navigation System - Auth Stack Param List
 */

export type AuthStackParamList = {
  Login: undefined;
  Register: { email?: string };
  ForgotPassword: { email?: string };
};
