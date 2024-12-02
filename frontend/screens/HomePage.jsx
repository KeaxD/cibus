import { Text, View, Button, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../context/authContext";
import styles from "../styles/homepage";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

export default function HomePage() {
  const { logout } = useAuth();
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <IconMCI
            name="account"
            color={"#f4f4f4"}
            size={30}
            style={styles.profileIcon}
            onPress={() => navigation.navigate("ProfilePage")}
          />
        </View>
        <View>
          <Text>Favorite Recipes</Text>
        </View>
      </View>
      <Button title="Logout" onPress={logout} />
    </SafeAreaView>
  );
}
