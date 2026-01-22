import { StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { typography } from "../../../styles/typography";
import { spacing } from "../../../styles/spacing";

export const phoneInputStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg, // 20px
    paddingVertical: spacing.lg, // 20px
    backgroundColor: colors.background, // #FFFFFF
    position: 'relative',
    borderBottomWidth: 2, // ADDED: Green underline thickness
    borderBottomColor: colors.whatsappTeal, // ADDED: Green underline color (#008069)
    marginHorizontal: spacing.lg, // ADDED: Match other margins
    marginTop: spacing.sm, // ADDED: Spacing from country picker
  },
  codeContainer: {
    paddingVertical: spacing.md, // 12px
    paddingHorizontal: spacing.sm, // 8px
  },
  codeText: {
    fontSize: typography.fontSize.xl, // 18px
    color: colors.textPrimary, // #000000
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border, // #E9EDEF
    marginHorizontal: spacing.md, // 12px
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.xl, // 18px
    color: colors.textPrimary, // #000000
    paddingVertical: spacing.md, // 12px
  },
  lengthText: {
    position: 'absolute',
    right: spacing.lg, // 20px
    bottom: spacing.xs, // 4px
    fontSize: typography.fontSize.xs, // 12px
    color: colors.textTertiary, // #8696A0
  },
});