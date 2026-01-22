import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const communitiesMenuBarStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayDark,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    marginTop: spacing["3xl"] + spacing.xs, // Position right below header
    marginRight: spacing.base,
    width: 200,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: spacing.xxs,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: colors.borderLight,
  },
  safeArea: {
    backgroundColor: colors.white,
  },
  menuContent: {
    paddingVertical: spacing.sm,
  },
  menuItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  menuText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
});