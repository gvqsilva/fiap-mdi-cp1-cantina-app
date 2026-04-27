import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { theme } from '../app/theme';

function SkeletonItem({ shimmerX }) {
  return (
    <View style={styles.card}>
      <View style={styles.imagem} />
      <View style={styles.info}>
        <View style={[styles.linha, styles.linhaTitulo]} />
        <View style={[styles.linha, styles.linhaTexto]} />
        <View style={[styles.linha, styles.linhaValor]} />
      </View>
      <View style={styles.botao} />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmer,
          {
            transform: [
              {
                translateX: shimmerX.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-220, 260],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

export default function CardapioSkeleton() {
  const shimmerX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerX, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      })
    );

    loop.start();

    return () => {
      loop.stop();
      shimmerX.stopAnimation();
    };
  }, [shimmerX]);

  return (
    <View style={styles.lista}>
      <SkeletonItem shimmerX={shimmerX} />
      <SkeletonItem shimmerX={shimmerX} />
      <SkeletonItem shimmerX={shimmerX} />
      <SkeletonItem shimmerX={shimmerX} />
    </View>
  );
}

const styles = StyleSheet.create({
  lista: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 22,
    gap: 10,
  },
  card: {
    minHeight: 98,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 9,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagem: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: '#1E1A1F',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    gap: 8,
  },
  linha: {
    borderRadius: 7,
    backgroundColor: '#2A232A',
    height: 12,
  },
  linhaTitulo: {
    width: '66%',
    height: 14,
  },
  linhaTexto: {
    width: '52%',
  },
  linhaValor: {
    width: '38%',
  },
  botao: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2B2127',
  },
  shimmer: {
    position: 'absolute',
    width: 120,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
