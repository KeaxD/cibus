import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "./screens/HomePage";
import Camera from "./screens/CameraPage";
import Inventory from "./screens/Inventory";

const Tab = createBottomTabNavigator();

function BottomTabGroup() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Camera" component={Camera} />
      <Tab.Screen name="Inventory" component={Inventory} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <BottomTabGroup />
    </NavigationContainer>
  );
}
