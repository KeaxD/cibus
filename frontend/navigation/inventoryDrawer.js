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
        initialParams={{
          category: ["Snacks", "Chips and fries"],
        }}
      />
      <Drawer.Screen
        name="Beverages"
        component={Inventory}
        initialParams={{ category: ["Beverages"] }}
      />
      <Drawer.Screen
        name="Plant-based foods"
        component={Inventory}
        initialParams={{ category: ["Plant-based foods"] }}
      />
      <Drawer.Screen
        name="Meats"
        component={Inventory}
        initialParams={{ category: ["Meats and their products"] }}
      />
      <Drawer.Screen
        name="Dairies"
        component={Inventory}
        initialParams={{ category: ["Dairies"] }}
      />
      <Drawer.Screen
        name="Vegetables"
        component={Inventory}
        initialParams={{ category: ["Vegetables"] }}
      />
      <Drawer.Screen
        name="Condiments"
        component={Inventory}
        initialParams={{ category: ["Condiments", "Syrups", "Sweeteners"] }}
      />
      <Drawer.Screen
        name="Frozen foods"
        component={Inventory}
        initialParams={{ category: ["Frozen foods"] }}
      />
      <Drawer.Screen
        name="Desserts"
        component={Inventory}
        initialParams={{ category: ["Desserts"] }}
      />
    </Drawer.Navigator>
  );
};

export default InventoryDrawer;
