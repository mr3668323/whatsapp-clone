import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { typography } from "../../../styles/typography";
import { spacing } from "../../../styles/spacing";

export const privacyPolicyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base + spacing.xs,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  backButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    minWidth: 30,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButtonIcon: {
    fontSize: typography.fontSize["3xl"],
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.normal,
    marginLeft: -spacing.xs,
  },
  
  // Menu Button
  menuButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  menuIconContainer: {
    width: 24,
    height: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuDot: {
    width: 4,
    height: 3,
    borderRadius: 1,
    backgroundColor: colors.textPrimary,
  },
  
  // Dropdown Menu
  menuOverlay: {
    flex: 1,
    backgroundColor: colors.overlayMedium,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: spacing["5xl"] + spacing.base,
    paddingRight: spacing.base,
  },
  menuContainer: {
    backgroundColor: colors.background,
    borderRadius: spacing.sm,
    paddingVertical: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: spacing.xxs },
    shadowOpacity: 0.2,
    shadowRadius: spacing.sm,
    elevation: 5,
    minWidth: 120,
  },
  menuTriangle: {
    position: 'absolute',
    top: -8,
    right: 12,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.background,
  },
  menuItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuItemText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing["3xl"],
    alignItems: 'center',
  },
  
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing["3xl"] + spacing.xs,
    marginBottom: spacing["2xl"],
  },
  whatsappLogo: {
    width: 100,
    height: 100,
    borderRadius: spacing.buttonHeight + spacing.sm,
    backgroundColor: colors.whatsappGreen,
  },
  
  title: {
    marginTop: spacing.xl,
    fontSize: typography.fontSize["3xl"],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    textAlign: 'center',
    lineHeight: typography.lineHeight.description + spacing.xs,
  },
  
  description: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.description,
    marginBottom: spacing["4xl"],
    paddingHorizontal: spacing.lg,
  },
  
  linkText: {
    color: colors.whatsappBlue,
    fontWeight: typography.fontWeight.semibold,
  },
  
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    paddingTop: spacing.xl,
  },
});