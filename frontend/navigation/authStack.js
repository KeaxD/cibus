import LoginScreen from "../screens/LoginPage";
import { createStackNavigator } from "@react-navigation/stack";

const AuthStack = createStackNavigator();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
}

export default AuthStackNavigator;
