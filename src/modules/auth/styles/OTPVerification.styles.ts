import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { typography } from "../../../styles/typography";
import { spacing } from "../../../styles/spacing";

export const otpVerificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing["3xl"],
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  timeText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  batteryText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing["3xl"],
  },
  title: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  phoneContainer: {
    alignItems: 'center',
    marginBottom: spacing["2xl"],
  },
  phoneLabel: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeight.description,
  },
  phoneNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  editText: {
    fontSize: typography.fontSize.base,
    color: colors.textLink,
    textDecorationLine: 'underline',
    lineHeight: typography.lineHeight.description,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing["2xl"],
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  otpInput: {
    flex: 1,
    height: spacing.buttonHeight + spacing.sm,
    minWidth: 0,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    textAlign: 'center',
    fontSize: typography.fontSize["2xl"],
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    fontWeight: typography.fontWeight.normal,
    padding: 0,
  },
  otpInputFilled: {
    borderColor: colors.whatsappTeal,
    backgroundColor: colors.backgroundLight,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  timerText: {
    fontSize: typography.fontSize.base,
    color: colors.textTertiary,
    lineHeight: typography.lineHeight.description,
  },
  resendText: {
    fontSize: typography.fontSize.base,
    color: colors.textLink,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.description,
  },
  noteText: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing["2xl"],
    lineHeight: typography.lineHeight.description,
  },
  verifyButton: {
    paddingVertical: spacing.base,
    backgroundColor: colors.buttonPrimary,
    borderRadius: spacing.buttonRadius,
    justifyContent: 'center',
    alignItems: 'center',
    height: spacing.buttonHeight,
    marginBottom: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verifyButtonDisabled: {
    backgroundColor: colors.buttonDisabled,
  },
  verifyButtonText: {
    fontSize: typography.fontSize.lg, // 16px
    color: colors.buttonTextPrimary,
    fontWeight: typography.fontWeight.semibold, // 600
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: typography.fontSize.lg, 
    paddingTop: 0,
    paddingBottom: 0,
  },
});