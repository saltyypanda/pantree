import { Tabs, Redirect, RelativePathString } from "expo-router";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function TabsLayout() {
  const { status } = useAuth();

  if (status === "loading") return null;
  if (status === "unauthed") return <Redirect href={"/(auth)/signin" as RelativePathString} />;

  return <Tabs />;
}
