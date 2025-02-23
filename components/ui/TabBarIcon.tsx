// components/ui/TabBarIcon.tsx
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type TabBarIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
};

export const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color, size = 28 }) => {
  return <Ionicons name={name} size={size} color={color} />;
};