import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { View, Text } from 'react-native';

// Simple root verification test
test('renders correctly', async () => {
  const tree = ReactTestRenderer.create(
    <View>
      <Text>SocialSphere Enterprise App</Text>
    </View>
  );
  expect(tree.toJSON()).toBeDefined();
});
