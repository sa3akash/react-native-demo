import React, { useState } from "react";
import { LoginScreen } from "../../features/auth/screens/LoginScreen";
import { RegisterScreen } from "../../features/auth/screens/RegisterScreen";

export const AuthNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<"login" | "register">("login");

  if (currentScreen === "register") {
    return <RegisterScreen onNavigateToLogin={() => setCurrentScreen("login")} />;
  }

  return (
    <LoginScreen
      onNavigateToRegister={() => setCurrentScreen("register")}
      onNavigateToForgotPassword={() => {}}
    />
  );
};
