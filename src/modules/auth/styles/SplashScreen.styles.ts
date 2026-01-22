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
    marginBottom: spacing["4xl"],
  },
  
  // WhatsApp Logo Image Style
  whatsappLogoImage: {
    width: 100,
    height: 100,
    marginBottom: spacing.xl,
  },
  
  // WhatsApp Text Style - WhatsApp teal
  logoText: {
    fontSize: typography.fontSize["4xl"],
    fontWeight: typography.fontWeight.light,
    fontFamily: typography.fontFamily.regular,
    color: colors.whatsappTeal, // WhatsApp teal (#008069)
    letterSpacing: 0.5,
  },
  
  footer: {
    position: "absolute",
    bottom: spacing["3xl"] + spacing.lg, // 60px from bottom
    alignItems: "center",
  },
  
  // "from" text - light gray
  footerText: {
    fontSize: typography.fontSize.base,
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
    fontSize: typography.fontSize.lg, // Slightly smaller than text
    fontFamily: typography.fontFamily.medium,
    color: colors.whatsappTeal, // WhatsApp teal (#008069) - CORRECTED
    fontWeight: typography.fontWeight.medium,
    marginRight: spacing.sm, // Space between icon and text
  },
  
  // Meta Text - WhatsApp teal
  metaText: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold, // Bold
    color: colors.whatsappTeal, // WhatsApp teal (#008069) - CORRECTED
  },
  
  // If using meta logo image instead
  metaLogoImage: {
    width: 70,
    height: 22,
    tintColor: colors.whatsappTeal, // Make image teal if needed
  },
})