import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "../screens/HomePage";
import ProfilePage from "../screens/ProfilePage";

const HomeStack = createStackNavigator();

export default function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomePage"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}
