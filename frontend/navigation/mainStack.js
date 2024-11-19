import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabs from "./bottomTabs";

const MainStack = createStackNavigator();

function MainStackNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Main"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
}

export default MainStackNavigator;
