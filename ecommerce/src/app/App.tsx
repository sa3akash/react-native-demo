import React from "react";
import { AppProviders } from "./providers/AppProviders";
import { RootNavigator } from "./navigation/RootNavigator";

export const App: React.FC = () => {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
};

export default App;
