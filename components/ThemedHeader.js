import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../app/theme';

export default function ThemedHeader({ title, subtitle, rightContent }) {
  return (
    <View style={styles.header}>
      <View style={styles.accentGlow} />
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightContent ? <View style={styles.rightSlot}>{rightContent}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.surfaceAlt,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    paddingTop: 18,
    paddingHorizontal: 14,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  accentGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    right: -40,
    top: -90,
    backgroundColor: 'rgba(173, 57, 90, 0.22)',
  },
  title: {
    color: theme.colors.text,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 4,
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  rightSlot: {
    marginLeft: 10,
  },
});
