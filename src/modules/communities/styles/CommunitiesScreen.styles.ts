import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const communitiesScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  headerButton: {
    padding: spacing.xs,
  },
  menuIcon: {
    width: typography.fontSize.lg * 1.3,
    height: typography.fontSize.lg * 1.3,
    tintColor: colors.textPrimary,
  },
  infoSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 8,
    borderBottomColor: colors.backgroundGray,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: spacing.lg + spacing.xs,
  },
  listContent: {
    paddingBottom: spacing["5xl"] + spacing.base + spacing.xs,
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
  },
  communityAvatar: {
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
    backgroundColor: colors.whatsappGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  communityAvatarText: {
    fontSize: typography.fontSize.xl,
    color: colors.white,
  },
  communityInfo: {
    flex: 1,
  },
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  communityName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  unreadBadge: {
    minWidth: spacing.xl,
    height: spacing.xl,
    borderRadius: spacing.xl / 2,
    backgroundColor: colors.whatsappGreen,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  unreadBadgeText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  communityDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: spacing.lg + spacing.xs,
  },
  memberCount: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textTertiary,
  },
  fab: {
    position: 'absolute',
    bottom: spacing["5xl"] + spacing.base + spacing.xs,
    right: spacing.lg,
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
    backgroundColor: colors.whatsappGreen,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: spacing.xxs },
    shadowOpacity: 0.2,
    shadowRadius: spacing.xs,
  },
  fabText: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
});