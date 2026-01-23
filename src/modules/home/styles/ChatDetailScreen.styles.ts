import { StyleSheet, Platform } from "react-native"
import { colors } from "../../../styles/colors"
import { spacing } from "../../../styles/spacing"
import { typography } from "../../../styles/typography"

export const chatDetailScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.whatsappTeal, // WhatsApp teal header
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.lg + spacing.sm,
  },
  backButton: {
    paddingRight: spacing.md,
    paddingVertical: spacing.xs,
  },
  backButtonText: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.semibold,
    color: colors.textLight,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semibold,
    color: colors.textLight,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textLightOpacity,
    marginTop: spacing.xxs,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerIcon: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  headerIconText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    color: colors.textLight,
  },
  iconButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  messagesContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing["5xl"] + spacing.base + spacing.xs,
  },
  messageRow: {
    marginVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageRowOwn: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  messageRowOther: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.lg + spacing.xs,
  },
  ownMessage: {
    backgroundColor: colors.bubbleSent, // WhatsApp green for sent messages
    borderTopRightRadius: spacing.xs,
  },
  otherMessage: {
    backgroundColor: colors.bubbleReceived, // White for received messages
    borderTopLeftRadius: spacing.xs,
  },
  messageText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: spacing.lg + spacing.xs,
  },
  messageTextOwn: {
    color: colors.textPrimary,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  messageTimeInline: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.bubbleTimestamp,
  },
  checkmarkIcon: {
    fontSize: spacing.sm + spacing.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.whatsappBlue,
  },
  messageTime: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.bubbleTimestamp,
    marginTop: spacing.xs,
    marginHorizontal: spacing.sm,
  },
  dateContainer: {
    alignSelf: "center",
    marginVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: spacing.md,
    backgroundColor: colors.dateBackground,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  systemContainer: {
    alignSelf: "center",
    marginVertical: spacing.md,
    maxWidth: "85%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.unreadBackground,
  },
  systemIcon: {
    fontSize: spacing.base,
    fontFamily: typography.fontFamily.regular,
    marginRight: spacing.sm,
  },
  systemText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: spacing.base,
  },
  cardWrapper: {
    marginVertical: spacing.sm,
    alignSelf: "flex-start",
  },
  cardBubble: {
    width: 300,
    borderRadius: spacing.base,
    backgroundColor: colors.background,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardMedia: {
    height: 180,
    backgroundColor: colors.backgroundGray,
    alignItems: "center",
    justifyContent: "center",
  },
  cardPlayButton: {
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
    backgroundColor: colors.overlayBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  cardPlayButtonText: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.regular,
    color: colors.textLight,
  },
  cardTitle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.textPrimary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === "ios" ? spacing.lg : spacing.md,
  },
  emojiButton: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },
  emojiIcon: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.regular,
    color: colors.iconGray,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  input: {
    minHeight: spacing["3xl"] + spacing.xs,
    maxHeight: spacing["5xl"] + spacing.base + spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.lg,
    backgroundColor: colors.backgroundInput,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    textAlignVertical: "center",
  },
  attachButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  attachIcon: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    color: colors.iconGray,
  },
  cameraButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  cameraIcon: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    color: colors.iconGray,
  },
  micButton: {
    width: spacing["3xl"] + spacing.xs,
    height: spacing["3xl"] + spacing.xs,
    borderRadius: spacing.lg,
    backgroundColor: colors.whatsappTeal,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.xs,
  },
  micIcon: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    color: colors.textLight,
  },
  sendButton: {
    width: spacing["3xl"] + spacing.xs,
    height: spacing["3xl"] + spacing.xs,
    borderRadius: spacing.lg,
    backgroundColor: colors.whatsappTeal,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.xs,
  },
  sendIcon: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.textLight,
  },
  readOnlyContainer: {
    paddingVertical: spacing.md,
    alignItems: "center",
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  readOnlyText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textTertiary,
  },
});