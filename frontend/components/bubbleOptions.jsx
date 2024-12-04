import React, { useCallback, useEffect } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const BubbleButtons = ({
  index,
  children,
  isMainButton = false,
  expanded,
  onPress,
}) => {
  const position = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: position.value }],
    };
  });

  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  useEffect(() => {
    if (!isMainButton) {
      if (expanded) {
        position.value = withSpring(-70 * index, {
          damping: 80,
          stiffness: 100,
        });
      } else {
        position.value = withTiming(0); // Move down without spring animation
      }
    }
  }, [expanded]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable onPress={handlePress} style={styles.buttonCircle}>
        {children}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
  },
  buttonCircle: {
    width: 50,
    height: 50,
    margin: 8,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
  },
  container: {
    position: "absolute",
  },
});

export default BubbleButtons;
