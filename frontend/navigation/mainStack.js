import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabs from "./bottomTabs";
import RecipeStackScreen from "./recipeStack";
import RecipeDetailPage from "../screens/RecipeDetailPage";

const MainStack = createStackNavigator();

function MainStackNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Main"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="RecipeDetails"
        component={RecipeDetailPage}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
}

export default MainStackNavigator;
