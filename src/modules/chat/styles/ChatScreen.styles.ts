import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const chatScreenStyles = StyleSheet.create({
  /* -------------------- Container -------------------- */
  container: {
    flex: 1,
    // Warm WhatsApp-style chat background (light cream)
    backgroundColor: colors.chatBackgroundLight,
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
    width: spacing.lg * 1.2,
    height: spacing.lg * 1.2,
    tintColor: colors.textPrimary,
  },
  avatarContainer: {
    marginRight: spacing.sm,
  },
  avatar: {
    width: 40, // Smaller avatar like WhatsApp header
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.whatsappGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  unknownUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    width: spacing.iconSize,
    height: spacing.iconSize,
    tintColor: colors.textPrimary,
  },
  menuButton: {
    padding: spacing.xs,
  },
  menuIcon: {
    width: typography.fontSize.lg * 1.3,
    height: typography.fontSize.lg * 1.3,
    tintColor: colors.textPrimary,
  },

  /* -------------------- Background Image -------------------- */
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  /* -------------------- Messages List -------------------- */
  messageList: {
    // Wider side padding so bubbles don’t touch screen edges (WhatsApp-like)
    paddingHorizontal: spacing.lg,
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
  tickSent: {
    color: colors.textTertiary, // gray ✔
  },
  tickDelivered: {
    color: colors.textTertiary, // gray ✔✔
  },
  tickSeen: {
    color: colors.whatsappBlue, // blue ✔✔
  },

  /* -------------------- Meta AI Typing Indicator -------------------- */
  typingDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.xs,
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
  },

  /* -------------------- Input Area -------------------- */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align pill and mic on same vertical center (WhatsApp-like)
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundInput,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stickerButton: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },
  stickerIcon: {
    width: spacing.iconSize,
    height: spacing.iconSize,
    tintColor: colors.textPrimary,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: spacing.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    maxHeight: 100,
    flexDirection: 'row', // Sticker, text, attach, camera on one row
    alignItems: 'center',
  },
  input: {
    flex: 1,
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
    width: spacing.iconSize,
    height: spacing.iconSize,
    tintColor: colors.textPrimary,
  },
  cameraButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  cameraIcon: {
    width: spacing.iconSize,
    height: spacing.iconSize,
    tintColor: colors.textPrimary,
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
    width: spacing.iconSize,
    height: spacing.iconSize,
    tintColor: colors.white,
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
    backgroundColor: colors.encryptionBanner,
    paddingHorizontal: spacing.lg, // ~16dp horizontal padding
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderRadius: spacing.lg, // pill-like radius
    alignSelf: 'center',
    marginHorizontal: spacing.lg, // inset from edges
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    maxWidth: '92%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  encryptionIcon: {
    fontSize: typography.fontSize.base,
    color: colors.iconGray,
  },
  encryptionText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.iconGray,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xs * 1.1,
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
