import Navigation from "./navigation/bottomTabs";
import LoginScreen from "./screens/LoginPage";
import { AuthProvider, useAuth } from "./context/authContext";

const AppContent = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Navigation /> : <LoginScreen />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
