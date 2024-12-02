import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IconFA6 from "react-native-vector-icons/FontAwesome6";
import IconFA from "react-native-vector-icons/FontAwesome";
import IconMCI from "react-native-vector-icons/MaterialCommunityIcons";

import Camera from "../screens/CameraPage";
import InventoryDrawer from "./inventoryDrawer";
import RecipeStackScreen from "./recipeStack";
import HomeStack from "./homeStack";

const Tab = createBottomTabNavigator();

function BottomTabGroup() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#c4c4c4",
        tabBarInactiveTintColor: "#f4f4f4",
        tabBarStyle: { backgroundColor: "#333" },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ color, size }) => (
            <IconFA name="home" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={Camera}
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ color, size }) => (
            <IconFA6 name="barcode" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryDrawer}
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ color, size }) => (
            <IconMCI name="fridge" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="RecipesStack"
        component={RecipeStackScreen}
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ color, size }) => (
            <IconMCI name="chef-hat" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return <BottomTabGroup />;
}
