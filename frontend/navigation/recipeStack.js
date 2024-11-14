import { createStackNavigator } from "@react-navigation/stack";
import RecipePage from "../screens/RecipePage";
import RecipeDetailPage from "../screens/RecipeDetailPage";

const RecipeStack = createStackNavigator();

export default function RecipeStackScreen() {
  return (
    <RecipeStack.Navigator>
      <RecipeStack.Screen
        name="Recipes"
        component={RecipePage}
        options={{ headerShown: false }}
      />
      <RecipeStack.Screen
        name="RecipeDetails"
        component={RecipeDetailPage}
        options={{ title: "Recipe Details" }}
      />
    </RecipeStack.Navigator>
  );
}
