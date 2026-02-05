import { useAuth } from "@/lib/auth/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { status } = useAuth();
  
  if (status === "loading") return null;
  if (status === "authed") return <Redirect href="/(tabs)" />;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: "Welcome",
      }}
    />
  );
}
