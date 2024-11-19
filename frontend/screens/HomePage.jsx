import { Text, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../context/authContext";

export default function HomePage() {
  const { logout } = useAuth();

  return (
    <SafeAreaView>
      <Text>Homepage</Text>
      <Button title="Logout" onPress={logout} />
    </SafeAreaView>
  );
}
