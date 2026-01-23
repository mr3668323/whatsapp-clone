import { StyleSheet } from "react-native"
import { colors } from "../../../styles/colors"
import { spacing } from "../../../styles/spacing"
import { typography } from "../../../styles/typography"

export const chatItemStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLightOpacity,
    backgroundColor: "transparent",
  },
  containerActive: {
    backgroundColor: colors.statusBackgroundOpacity,
  },
  avatar: {
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
    marginRight: spacing.base,
    backgroundColor: colors.whatsappTeal,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.textLight,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: spacing.sm + spacing.xs,
    height: spacing.sm + spacing.xs,
    borderRadius: (spacing.sm + spacing.xs) / 2,
    backgroundColor: colors.online,
    borderWidth: spacing.xxs,
    borderColor: colors.background,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  time: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textTertiary,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  message: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.normal,
  },
  messageActive: {
    fontFamily: typography.fontFamily.semibold,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  unreadBadge: {
    backgroundColor: colors.unreadBadge,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    marginLeft: spacing.base,
  },
  unreadBadgeText: {
    color: colors.textLight,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
  },
})
