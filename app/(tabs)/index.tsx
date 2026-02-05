import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/lib/auth/AuthProvider';
import * as React from 'react';
import { View } from 'react-native';

export default function Screen() {
  const { signOut } = useAuth();

  return (
    <View className="flex-1 items-center justify-center gap-8 p-4">
      <Button
        onPress={() => {
          signOut();
        }}>
        <Text>Sign out</Text>
      </Button>
    </View>
  );
}
