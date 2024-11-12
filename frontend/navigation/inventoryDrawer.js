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
          category: ["Snacks", "Chips and fries", "Sweet snacks", "Biscuits"],
        }}
      />
      <Drawer.Screen
        name="Beverages"
        component={Inventory}
        initialParams={{ category: ["Beverages"] }}
      />
      <Drawer.Screen
        name="Meats"
        component={Inventory}
        initialParams={{ category: ["Meats"] }}
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
    </Drawer.Navigator>
  );
};

export default InventoryDrawer;
