/**
 * GoSeat - Bus Ticket Booking UI Kit / Type-Safe Enterprise Navigation Entry
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/design-system/theme/ThemeContext';
import { AppNavigationContainer } from './src/navigation';

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigationContainer />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
