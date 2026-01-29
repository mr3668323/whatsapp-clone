import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

interface DateSeparatorProps {
  label: string;
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({ label }) => {
  return (
    <View style={styles.container}>
      <View style={styles.chip}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xl,            // pill shape
    backgroundColor: colors.white,       // pure white, no opacity
    borderWidth: 1,
    borderColor: colors.border,          // subtle outline
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,           // stronger contrast like WhatsApp
  },
});
