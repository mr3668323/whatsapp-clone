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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconImage: {
    width: spacing.iconSize,
    height: spacing.iconSize,
  },
  name: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
});