import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Inventory from "../screens/Inventory.jsx";

const Drawer = createDrawerNavigator();

const InventoryDrawer = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="All" component={Inventory} />
      <Drawer.Screen
        name="Snacks"
        component={Inventory}
        initialParams={{ category: "Snacks" }}
      />
      <Drawer.Screen
        name="Beverages"
        component={Inventory}
        initialParams={{ category: "Beverages" }}
      />
      <Drawer.Screen
        name="Meats and their products"
        component={Inventory}
        initialParams={{ category: "Meats and their products" }}
      />
      <Drawer.Screen
        name="Dairies"
        component={Inventory}
        initialParams={{ category: "Dairies" }}
      />
    </Drawer.Navigator>
  );
};

export default InventoryDrawer;
