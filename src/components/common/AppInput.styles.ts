import { StyleSheet } from "react-native"
import { colors } from "../../styles/colors"
import { typography } from "../../styles/typography"
import { spacing } from "../../styles/spacing"

export const appInputStyles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundInput, // Use WhatsApp input background
  },
  inputFocused: {
    borderColor: colors.whatsappGreen, // WhatsApp bright green for focused state
    borderWidth: 2,
  },
  error: {
    borderColor: colors.callMissed, // Use callMissed red for errors
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.callMissed, // Use callMissed red for error text
    marginTop: spacing.xs,
  },
})