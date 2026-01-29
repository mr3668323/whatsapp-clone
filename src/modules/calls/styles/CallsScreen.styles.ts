import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const callsScreenStyles = StyleSheet.create({
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
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  headerButton: {
    padding: spacing.xs,
  },
  searchIcon: {
    width: typography.fontSize.lg * 1.6,
    height: typography.fontSize.lg * 1.6,
    tintColor: colors.textPrimary,
  },
  menuIcon: {
    width: typography.fontSize.lg * 1.3,
    height: typography.fontSize.lg * 1.3,
    tintColor: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderBottomWidth: spacing.sm,
    borderBottomColor: colors.backgroundLight,
  },
  quickActionButton: {
    alignItems: 'center',
    width: spacing.avatarSize + spacing.lg,
  },
  quickActionIconContainer: {
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
    backgroundColor: colors.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickActionIcon: {
    width: spacing.iconSize * 1.4,
    height: spacing.iconSize * 1.4,
    tintColor: colors.textPrimary,
  },
  quickActionLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundLight,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.textSecondary,
  },
  encryptionInfo: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderTopWidth: spacing.sm,
    borderTopColor: colors.backgroundLight,
  },
  lockIcon: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    color: colors.iconGray,
    marginBottom: spacing.sm,
  },
  encryptionText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: spacing.lg + spacing.xs,
  },
  encryptionHighlight: {
    color: colors.whatsappGreen,
    fontFamily: typography.fontFamily.semibold,
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
  fabIconImage: {
    width: spacing.iconSize * 0.8,
    height: spacing.iconSize * 0.8,
    tintColor: colors.white,
  },
});