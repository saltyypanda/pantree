import { useAuth } from "@/lib/auth/AuthProvider";
import { Redirect, RelativePathString, Stack } from "expo-router";

export default function AuthLayout() {
  const { status } = useAuth();
  
  if (status === "loading") return null;
  if (status === "authed") return <Redirect href={"/(tabs)/recipes" as RelativePathString} />;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: "Welcome",
      }}
    />
  );
}
