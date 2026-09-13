import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { logger } from '../../services/logging/logger';
import { Button } from '../buttons/Button';
import { BodyText } from '../typography/BodyText';
import { Heading } from '../typography/Heading';

interface Props {
  readonly children: ReactNode;
}

interface State {
  readonly hasError: boolean;
  readonly error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('Unhandled Global React Component Error', error, {
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Heading level="h1">App Error Encountered</Heading>
          <BodyText color="#EF4444" style={styles.errorText}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </BodyText>
          <Button title="Restart Application View" onPress={this.handleReset} />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
  },
  errorText: {
    marginVertical: 16,
    textAlign: 'center',
  },
});
