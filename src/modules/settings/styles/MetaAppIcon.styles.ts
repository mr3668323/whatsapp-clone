import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const metaAppIconStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
    backgroundColor: colors.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.regular,
    color: colors.iconGray,
  },
  name: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});