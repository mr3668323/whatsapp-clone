import { StyleSheet } from "react-native"
import { colors } from "../../styles/colors"
import { typography } from "../../styles/typography"
import { spacing } from "../../styles/spacing"

export const appButtonStyles = StyleSheet.create({
  // Base container
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: spacing.buttonRadius, // 24px for WhatsApp exact
  },
  
  fullWidth: {
    width: "100%",
  },
  
  // WhatsApp PRIMARY Button (EXACT from screenshot)
  primary: {
    backgroundColor: colors.buttonPrimary, // #008069
    height: spacing.buttonHeight, // 48px exact
  },
  
  // WhatsApp SECONDARY Button (for other screens)
  secondary: {
    backgroundColor: colors.buttonSecondary, // #F0F2F5
    height: spacing.buttonHeight,
  },
  
  // WhatsApp OUTLINE Button
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.buttonPrimary, // #008069
    height: spacing.buttonHeight,
  },
  
  // Size variants
  small: {
    height: spacing["3xl"] + spacing.xs, // 40px
    paddingHorizontal: spacing.md,
  },
  
  medium: {
    height: spacing.buttonHeight, // 48px
    paddingHorizontal: spacing.xl, // 24px
  },
  
  large: {
    height: spacing.buttonHeight + spacing.sm, // 56px
    paddingHorizontal: spacing["2xl"], // 32px
  },
  
  // Text styles
  baseText: {
    fontWeight: typography.fontWeight.semibold, // 600
  },
  
  primaryText: {
    color: colors.buttonTextPrimary, // #FFFFFF
    fontSize: typography.fontSize.lg, // 16px
  },
  
  secondaryText: {
    color: colors.buttonTextSecondary, // #008069
    fontSize: typography.fontSize.lg,
  },
  
  outlineText: {
    color: colors.buttonPrimary, // #008069
    fontSize: typography.fontSize.lg,
  },
  
  // Text size variants
  smallText: {
    fontSize: typography.fontSize.sm, // 14px
  },
  
  mediumText: {
    fontSize: typography.fontSize.lg, // 16px
  },
  
  largeText: {
    fontSize: typography.fontSize.xl, // 18px
  },
  
  // Disabled state
  disabled: {
    opacity: 0.6,
  },
})