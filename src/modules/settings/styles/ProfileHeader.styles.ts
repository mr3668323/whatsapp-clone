import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const profileHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: spacing.avatarSize + spacing.xs,
    height: spacing.avatarSize + spacing.xs,
    borderRadius: (spacing.avatarSize + spacing.xs) / 2,
    backgroundColor: colors.whatsappGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitleContainer: {
    backgroundColor: colors.backgroundGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.md,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  iconButton: {
    width: spacing["3xl"] + spacing.xs,
    height: spacing["3xl"] + spacing.xs,
    borderRadius: spacing.lg,
    backgroundColor: colors.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    color: colors.iconGray,
  },
});