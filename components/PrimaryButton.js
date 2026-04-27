import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../app/theme';

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  style,
}) {
  const secondary = variant === 'secondary';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        secondary ? styles.buttonSecondary : styles.buttonPrimary,
        disabled && styles.buttonDisabled,
        style,
      ]}
      activeOpacity={0.88}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        style={[
          styles.label,
          secondary ? styles.labelSecondary : styles.labelPrimary,
          disabled && styles.labelDisabled,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accentStrong,
    ...theme.glow,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.surfaceAlt,
    borderColor: theme.colors.border,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  labelPrimary: {
    color: '#FFFFFF',
  },
  labelSecondary: {
    color: theme.colors.text,
  },
  labelDisabled: {
    color: '#D4D4D4',
  },
});
