import CircleLoadingAnimation from "./components/circleLoading";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./context/authContext";
import AuthStackNavigator from "./navigation/authStack";
import MainStackNavigator from "./navigation/mainStack";

function RootNavigator() {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return <CircleLoadingAnimation />;
  }

  return isLoggedIn ? <MainStackNavigator /> : <AuthStackNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
