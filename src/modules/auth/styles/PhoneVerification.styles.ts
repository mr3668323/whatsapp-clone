import { StyleSheet, Platform } from "react-native";
import { colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";
import { typography } from "../../../styles/typography";

export const phoneVerificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.white,
  },
  backButton: {
  },
  backIcon: {
    fontSize: typography.fontSize["3xl"] + spacing.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.whatsappTeal,
    fontWeight: typography.fontWeight.bold,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  menuButton: {
    padding: spacing.xs,
  },
  menuIcon: {
    fontSize: typography.fontSize["2xl"] + spacing.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.iconGray,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  scrollSpacer: {
    height: spacing["5xl"] + spacing.base, // 80px equivalent
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginHorizontal: spacing.lg,
    marginTop: spacing["2xl"],
    marginBottom: spacing.base,
  },
  subtitleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: spacing.lg,
    marginBottom: spacing["2xl"],
    alignItems: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.description,
    flexShrink: 1,
  },
  linkText: {
    color: colors.textLink,
    fontSize: typography.fontSize.base,
    textDecorationLine: 'underline',
    lineHeight: typography.lineHeight.description,
  },
  validationText: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  phoneInputTouchable: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  buttonContainer: {
    marginHorizontal: spacing.lg,
    marginTop: 'auto',
    marginBottom: spacing.lg,
    paddingBottom: spacing.sm,
  },
  nextButton: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: spacing.buttonRadius,
    justifyContent: 'center',
    alignItems: 'center',
    height: spacing.buttonHeight,
    paddingVertical: spacing.base,
  },
  nextButtonDisabled: {
    backgroundColor: colors.buttonDisabled,
  },
  nextButtonText: {
    fontSize: typography.fontSize.lg,
    color: colors.buttonTextPrimary,
    fontWeight: typography.fontWeight.semibold,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});