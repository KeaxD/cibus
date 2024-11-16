import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const CircleLoadingAnimation = () => {
  const animationValues = Array.from(
    { length: 3 },
    () => new Animated.Value(0)
  );

  useEffect(() => {
    const createAnimation = (animatedValue, delay) => {
      return Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.5,
          duration: 500,
          delay: delay,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]);
    };

    // Start the animations with delays
    const animations = animationValues.map((animatedValue, index) => {
      return createAnimation(animatedValue, index * 100);
    });

    // Run all animations in parallel, wrapped in a loop
    Animated.loop(Animated.parallel(animations)).start();
  }, []);

  return (
    <View style={styles.loadingContainer}>
      <View>
        {animationValues.map((animatedValue, index) => (
          <Animated.View
            key={index}
            style={[
              styles.circle,
              {
                left: index * 25,
                transform: [
                  {
                    translateY: animatedValue.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, -50, 0],
                    }),
                  },
                  {
                    scale: animatedValue.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 0.3, 1],
                    }),
                  },
                ],
                opacity: animatedValue.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0.4, 1],
                }),
                backgroundColor: animatedValue.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: ["turquoise", "blue", "turquoise"],
                }),
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    position: "absolute",
    width: 13,
    height: 13,
    borderRadius: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    right: 33,
  },
});

export default CircleLoadingAnimation;
