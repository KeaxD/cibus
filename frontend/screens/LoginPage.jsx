import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { BACKEND_URI } from "@env";

import styles from "../styles/loginpage";
import { useAuth } from "../context/authContext";
import CircleLoadingAnimation from "../components/circleLoading";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URI}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        login(token);
      } else {
        console.error("Login failed");
        setErrorMessage(response.json());
      }
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URI}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        console.log("Signup was successful");
        login(token);
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsNewUser(!isNewUser);
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <CircleLoadingAnimation />
      ) : (
        <>
          <Text style={styles.title}>{isNewUser ? "Sign Up" : "Login"}</Text>
          {setErrorMessage !==
          (
            <>
              <Text>{errorMessage}</Text>
            </>
          )}
          {isNewUser && (
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            title={isNewUser ? "Sign Up" : "Login"}
            onPress={isNewUser ? handleSignUp : handleLogin}
          />
          <TouchableOpacity onPress={toggleForm}>
            <Text style={styles.text}>
              {isNewUser
                ? "Already have an account? Login here"
                : "New? Sign up here"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default LoginScreen;
