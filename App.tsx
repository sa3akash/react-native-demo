import React from 'react';
import { RootProvider } from './src/app/providers/RootProvider';
import { GlobalErrorBoundary } from './src/components/feedback/GlobalErrorBoundary';
import { RootNavigator } from './src/navigation/RootNavigator';

export const App: React.FC = () => {
  return (
    <GlobalErrorBoundary>
      <RootProvider>
        <RootNavigator />
      </RootProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
