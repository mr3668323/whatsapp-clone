import { StyleSheet } from "react-native"
import { colors } from "../../../styles/colors"
import { typography } from "../../../styles/typography"
import { spacing } from "../../../styles/spacing"

export const splashScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // WHITE background
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    // Slightly less bottom margin so logo sits closer to true center,
    // matching the official WhatsApp splash balance
    marginBottom: spacing["3xl"],
  },
  
  // WhatsApp Logo Image Style
  whatsappLogoImage: {
    // Slightly smaller than before to match the official logo proportion
    width: 84,
    height: 84,
    // Very subtle spacing below logo before the footer block
    marginBottom: spacing.lg,
  },
  
  // WhatsApp Text Style - WhatsApp teal
  logoText: {
    fontSize: typography.fontSize["4xl"],
    fontWeight: typography.fontWeight.light,
    fontFamily: typography.fontFamily.regular,
    color: colors.whatsappGreen, // WhatsApp bright green
    letterSpacing: 0.5,
  },
  
  footer: {
    position: "absolute",
    // Bring the footer slightly closer to the bottom like the real app
    bottom: spacing["2xl"] + spacing.md,
    alignItems: "center",
  },
  
  // "from" text - light gray
  footerText: {
    // Keep "from" smaller and lighter than Meta text
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textTertiary, // Light gray (#8696A0)
    marginBottom: spacing.xxs,
    fontWeight: typography.fontWeight.normal,
  },
  
  // Meta Container - icon then text
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  // Meta Icon (∞ symbol) - WhatsApp teal
  metaIcon: {
    // Make icon clearly visible and slightly larger
    fontSize: typography.fontSize["2xl"],
    fontFamily: typography.fontFamily.medium,
    color: colors.whatsappGreen, // WhatsApp bright green - CORRECTED
    fontWeight: typography.fontWeight.medium,
    marginRight: spacing.sm, // Space between icon and text
  },
  
  // Meta Text - WhatsApp teal
  metaText: {
    // Slightly larger and bold to match official Meta wordmark weight
    fontSize: typography.fontSize["2xl"],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold, // Bold
    color: colors.whatsappGreen, // WhatsApp bright green - CORRECTED
  },
  
  // If using meta logo image instead
  metaLogoImage: {
    width: 70,
    height: 22,
    tintColor: colors.whatsappGreen, // WhatsApp bright green
  },
})