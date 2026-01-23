import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const chatScreenStyles = StyleSheet.create({
  /* -------------------- Container -------------------- */
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* -------------------- Header -------------------- */
  header: {
    backgroundColor: colors.headerBackground,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.headerText,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
  },

  /* -------------------- Messages List -------------------- */
  messageList: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },

  /* -------------------- Message Bubble -------------------- */
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    marginVertical: spacing.xs,
  },

  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.bubbleSent,
    borderTopRightRadius: spacing.xs,
  },

  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.bubbleReceived,
    borderTopLeftRadius: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  messageText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.regular,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },

  /* -------------------- Input Area -------------------- */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundInput,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  input: {
    flex: 1,
    height: spacing.inputHeight,
    backgroundColor: colors.white,
    borderRadius: spacing.buttonRadius,
    paddingHorizontal: spacing.base,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.regular,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sendButton: {
    marginLeft: spacing.sm,
    height: spacing.inputHeight,
    width: spacing.inputHeight,
    borderRadius: spacing.inputHeight / 2,
    backgroundColor: colors.whatsappGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendText: {
    color: colors.buttonTextPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.medium,
  },
  /* -------------------- Ticks -------------------- */
tickContainer: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  
  tickText: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary, // gray ✔
    fontFamily: typography.fontFamily.regular,
  },
  
  tickSeen: {
    color: colors.whatsappBlue, // blue ✔✔
  },
  
});
