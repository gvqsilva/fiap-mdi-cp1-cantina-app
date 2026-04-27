import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

export default function ScalePressable({ children, style, onPress, scaleTo = 0.97, ...props }) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue) => {
    Animated.spring(scale, {
      toValue,
      friction: 8,
      tension: 130,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      {...props}
      onPressIn={() => animateTo(scaleTo)}
      onPressOut={() => animateTo(1)}
      onPress={onPress}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
