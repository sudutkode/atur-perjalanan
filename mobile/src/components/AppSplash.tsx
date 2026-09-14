import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Polygon } from 'react-native-svg';

/** Faithful React Native port of Figma Make's Screen1Splash. */
export function AppSplash() {
  return (
    <LinearGradient
      colors={['#FF8A65', '#FF6B6B', '#F94E4E']}
      locations={[0, 0.48, 1]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={styles.container}
    >
      <View pointerEvents="none" style={[styles.ring, styles.outerRing]} />
      <View pointerEvents="none" style={[styles.ring, styles.innerRing]} />

      <View style={styles.logoWell}>
        <Svg width={128} height={128} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={10} stroke="white" strokeWidth={2} />
          <Polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="white" />
        </Svg>
      </View>
      <Text style={styles.title}>Atur Perjalanan</Text>
      <Text style={styles.tagline}>Rencanakan. Jelajahi. Kenang.</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  outerRing: { width: 480, height: 480 },
  innerRing: {
    width: 340,
    height: 340,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  logoWell: {
    width: 156,
    height: 156,
    marginBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 10,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 30,
    letterSpacing: -0.8,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  tagline: {
    color: 'rgba(255,255,255,0.72)',
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
