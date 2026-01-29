import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { typography } from "../../../styles/typography";
import { spacing } from "../../../styles/spacing";

export const privacyPolicyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white, // Pure white background
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base + spacing.xs,
    paddingBottom: spacing.md,
    backgroundColor: colors.white, // Pure white header
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
  backIcon: {
    width: typography.fontSize.lg * 1.2,
    height: typography.fontSize.lg * 1.2,
    tintColor: colors.textPrimary,
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
  menuIcon: {
    width: typography.fontSize.lg * 1.3,
    height: typography.fontSize.lg * 1.3,
    tintColor: colors.textPrimary,
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
    paddingTop: spacing["2xl"] + spacing.md, // Logo closer to top (reduced from 4xl)
    paddingBottom: spacing.buttonHeight + spacing.xl + spacing.md, // Space for fixed button
    alignItems: 'center',
  },
  
  logoContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: spacing["3xl"] + spacing.xl, // Larger gap between logo and title (matching WhatsApp exactly)
  },
  whatsappLogo: {
    width: 70, // WhatsApp exact size
    height: 70,
  },
  
  title: {
    marginTop: 0,
    fontSize: typography.fontSize["2xl"], // 24px - WhatsApp exact
    fontFamily: typography.fontFamily.semibold, // Medium/semi-bold, not bold
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary, // Pure black
    marginBottom: spacing.md, // Tight spacing before description
    textAlign: 'center',
    lineHeight: typography.fontSize["2xl"] * 1.2, // Comfortable line height
  },
  
  description: {
    fontSize: typography.fontSize.base, // 15px - smaller than title
    color: colors.textSecondary, // WhatsApp grey
    textAlign: 'center',
    lineHeight: typography.fontSize.base * 1.5, // Increased line height for comfortable reading
    marginBottom: 0, // No bottom margin (button is separate)
    paddingHorizontal: spacing.lg,
  },
  
  linkText: {
    color: colors.whatsappBlue, // WhatsApp blue
    fontWeight: typography.fontWeight.normal, // No extra weight (default link styling)
  },
  
  // Bottom-Fixed Button Container (Absolute Positioning Strategy)
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl + spacing.md, // Space above system navigation bar
    backgroundColor: colors.white, // White background to cover scroll content
    borderTopWidth: 0.5,
    borderTopColor: colors.border, // Subtle top border
  },
});