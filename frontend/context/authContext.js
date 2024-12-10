import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { View, Text } from "react-native";

import { BACKEND_URI } from "@env";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayMessage, setDisplayMessage] = useState("");

  useEffect(() => {
    // Check login status from secure storage
    const checkLoginStatus = async () => {
      try {
        console.log("Checking for your token");
        const token = await SecureStore.getItemAsync("token");

        if (token) {
          console.log("Sending validation request");
          const request = await fetch(`${BACKEND_URI}/auth/validate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          if (request.ok) {
            const token = await request.json();
            console.log(token);
            // await SecureStore.setItemAsync("token", token);
            setIsLoggedIn(true);
          } else {
            const response = await request.json();
            showMessage(response.message);
          }
        }
      } catch (error) {
        console.error("Failed to get token from SecureStore", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const login = async (token) => {
    await SecureStore.setItemAsync("token", token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setIsLoggedIn(false);
  };

  const showMessage = (message) => {
    setDisplayMessage(message);
    setTimeout(() => {
      setDisplayMessage("");
    }, 2000);
  };

  if (displayMessage !== "") {
    return (
      <View
        style={[
          {
            top: "50%",
            left: 0,
            width: "100%",
            position: "absolute",
          },
        ]}
      >
        <Text style={[{ textAlign: "center", fontSize: 16 }]}>
          {displayMessage}
        </Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
