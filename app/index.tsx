import { Redirect, RelativePathString } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../lib/auth/AuthProvider';

export default function Index() {
  const { status } = useAuth();

  // 1. Loading State
  // While we are checking SecureStore, show a spinner so the user sees nothing.
  if (status === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2. Authenticated -> Go to Main App
  if (status === 'authed') {
    return <Redirect href={"/(tabs)/recipes" as RelativePathString} />;
  }

  // 3. Not Authenticated -> Go to Login
  return <Redirect href={"/(auth)/signin" as RelativePathString} />;
}