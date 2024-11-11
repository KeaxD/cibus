import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomePage from "../screens/HomePage";
import Camera from "../screens/CameraPage";
import InventoryDrawer from "./inventoryDrawer";

const Tab = createBottomTabNavigator();

function BottomTabGroup() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen
        name="Camera"
        component={Camera}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryDrawer}
        options={{ headerShown: false }}
      />
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
