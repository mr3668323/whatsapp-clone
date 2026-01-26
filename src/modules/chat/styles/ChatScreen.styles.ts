import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const chatScreenStyles = StyleSheet.create({
  /* -------------------- Container -------------------- */
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  /* -------------------- Header -------------------- */
  header: {
    backgroundColor: colors.white, // White background like WhatsApp
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },
  backIcon: {
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary, // Black text
    fontFamily: typography.fontFamily.regular,
  },
  avatarContainer: {
    marginRight: spacing.sm,
  },
  avatar: {
    width: 40, // Smaller avatar like WhatsApp header
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.whatsappTeal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    color: colors.textPrimary, // Black text
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
  },
  headerSubtitle: {
    color: colors.textSecondary, // Gray text
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    marginTop: spacing.xxs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerActionButton: {
    padding: spacing.xs,
  },
  headerActionIcon: {
    fontSize: typography.fontSize.lg,
  },
  menuButton: {
    padding: spacing.xs,
  },
  menuIcon: {
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary, // Black text
    fontFamily: typography.fontFamily.regular,
  },

  /* -------------------- Background Image -------------------- */
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  /* -------------------- Messages List -------------------- */
  messageList: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },

  /* -------------------- Date Separator -------------------- */
  dateSeparator: {
    alignSelf: 'center',
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.md,
    backgroundColor: colors.dateBackground,
  },
  dateSeparatorText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },

  /* -------------------- Message Row -------------------- */
  messageRow: {
    marginVertical: spacing.xs,
  },
  messageRowMe: {
    alignItems: 'flex-end',
  },
  messageRowOther: {
    alignItems: 'flex-start',
  },

  /* -------------------- Message Bubble -------------------- */
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.md,
    marginVertical: spacing.xxs,
  },
  myMessage: {
    backgroundColor: colors.bubbleSent, // WhatsApp green tint
    borderTopRightRadius: spacing.xs,
  },
  otherMessage: {
    backgroundColor: colors.bubbleReceived, // White
    borderTopLeftRadius: spacing.xs,
  },
  messageText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.regular,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
    marginBottom: spacing.xxs,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xxs,
    marginTop: spacing.xxs,
  },
  messageTime: {
    fontSize: typography.fontSize.xs,
    color: colors.bubbleTimestamp,
    fontFamily: typography.fontFamily.regular,
  },

  /* -------------------- Ticks -------------------- */
  tickText: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary, // gray ✔
    fontFamily: typography.fontFamily.regular,
  },
  tickDelivered: {
    color: colors.textTertiary, // gray ✔✔
  },
  tickSeen: {
    color: colors.whatsappBlue, // blue ✔✔
  },

  /* -------------------- Input Area -------------------- */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundInput,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  emojiButton: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },
  emojiIcon: {
    fontSize: typography.fontSize.lg,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: spacing.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    maxHeight: 100,
  },
  input: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.regular,
    paddingVertical: spacing.xs,
    minHeight: spacing.inputHeight - spacing.xs * 2,
  },
  attachButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  attachIcon: {
    fontSize: typography.fontSize.lg,
  },
  cameraButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  cameraIcon: {
    fontSize: typography.fontSize.lg,
  },
  micButton: {
    width: spacing.inputHeight,
    height: spacing.inputHeight,
    borderRadius: spacing.inputHeight / 2,
    backgroundColor: colors.whatsappGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  micIcon: {
    fontSize: typography.fontSize.lg,
  },
  sendButton: {
    width: spacing.inputHeight,
    height: spacing.inputHeight,
    borderRadius: spacing.inputHeight / 2,
    backgroundColor: colors.whatsappGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  sendIcon: {
    fontSize: typography.fontSize.lg,
    color: colors.white,
  },

  /* -------------------- Encryption Banner -------------------- */
  encryptionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4', // Lighter, less saturated yellow like WhatsApp
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderRadius: spacing.md, // Rounded from sides
    marginHorizontal: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  encryptionIcon: {
    fontSize: typography.fontSize.base,
  },
  encryptionText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xs,
  },

  /* -------------------- Meta AI Specific -------------------- */
  systemMessage: {
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  systemMessageText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.normal * typography.fontSize.xs,
  },
});
