import React from 'react';
import { View, Text } from 'react-native';

export const MotiView: React.FC<any> = (props) => React.createElement(View, props);
export const MotiText: React.FC<any> = (props) => React.createElement(Text, props);
export const AnimatePresence: React.FC<any> = ({ children }) => React.createElement(React.Fragment, null, children);
