import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const callCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
  },
  avatarContainer: {
    width: spacing.iconSize * 2,
    height: spacing.iconSize * 2,
    borderRadius: spacing.iconSize,
    backgroundColor: colors.whatsappGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  callTypeIcon: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },
  callTypeText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  videoButton: {
    padding: spacing.xs,
  },
  videoIcon: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    color: colors.iconGray,
  },
  audioButton: {
    padding: spacing.xs,
  },
  audioIcon: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    color: colors.iconGray,
  },
});