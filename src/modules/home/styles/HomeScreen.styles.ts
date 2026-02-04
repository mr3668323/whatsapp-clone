import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white, // White background like screenshot
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.whatsappGreen, // WhatsApp bright green
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  headerButton: {
    padding: spacing.xs,
  },
  searchContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchInputWrapper: {
    backgroundColor: colors.searchBackground,
    borderRadius: spacing.lg, // Rounded like WhatsApp
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.searchText,
    padding: 0,
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
  },
  chatItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chatItemSelected: {
    backgroundColor: colors.unreadBackground,
  },
  avatarContainer: {
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    position: 'relative',
  },
  regularAvatar: {
    backgroundColor: colors.whatsappGreen, // WhatsApp bright green for avatar
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  unknownUserAvatar: {
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: spacing.xxs,
    right: spacing.xxs,
    width: spacing.sm + spacing.xs,
    height: spacing.sm + spacing.xs,
    borderRadius: (spacing.sm + spacing.xs) / 2,
    backgroundColor: colors.online,
    borderWidth: spacing.xxs,
    borderColor: colors.white,
  },
  chatInfo: {
    flex: 1,
    minWidth: 0,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  chatName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semibold,
    color: colors.textPrimary,
  },
  chatTime: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textTertiary,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  voicePreviewIcon: {
    width: spacing.iconSize * 0.8,
    height: spacing.iconSize * 0.8,
    tintColor: colors.textSecondary,
  },
  messageText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    flex: 1,
  },
  tickSent: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily.regular,
  },
  tickDelivered: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily.regular,
  },
  tickSeen: {
    fontSize: typography.fontSize.xs,
    color: colors.whatsappBlue,
    fontFamily: typography.fontFamily.regular,
  },
  unreadBadge: {
    minWidth: spacing.xl,
    height: spacing.xl,
    borderRadius: spacing.xl / 2,
    backgroundColor: colors.unreadBadge,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    paddingHorizontal: spacing.xs,
  },
  unreadCount: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  encryptionNotice: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  encryptionText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  encryptionHighlight: {
    color: colors.whatsappGreen,
    fontFamily: typography.fontFamily.semibold,
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.lg + spacing.sm,
    right: spacing.lg,
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  metaAIFab: {
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: spacing.xs,
    },
    shadowOpacity: 0.1,
    shadowRadius: spacing.sm,
    elevation: 4,
  },
  chatFab: {
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
    backgroundColor: colors.floatingButton,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: spacing.xs,
    },
    shadowOpacity: 0.1,
    shadowRadius: spacing.sm,
    elevation: 4,
  },
  placeholderView: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Header camera icon (image) - size tuned to match WhatsApp header icon
  cameraIcon: {
    width: typography.fontSize.lg * 1.6,
    height: typography.fontSize.lg * 1.6,
    tintColor: colors.textPrimary, // Gray icon on white header
  },
  moreIcon: {
    width: typography.fontSize.lg * 1.3,
    height: typography.fontSize.lg * 1.3,
    tintColor: colors.textPrimary,
  },
  searchIcon: {
    width: typography.fontSize.lg * 1.2,
    height: typography.fontSize.lg * 1.2,
    tintColor: colors.textPrimary,
  },
  plusIcon: {
    fontSize: typography.fontSize["3xl"],
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
});