import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const settingsScreenStyles = StyleSheet.create({
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
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingTop: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
  },
  backIcon: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.regular,
    color: colors.whatsappTeal,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  searchButton: {
    padding: spacing.xs,
  },
  searchIcon: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    color: colors.iconGray,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  contentContainer: {
    paddingBottom: spacing.xl * 2,
  },
  metaSection: {
    backgroundColor: colors.white,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  metaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  metaLogo: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    color: colors.whatsappBlue,
    marginRight: spacing.sm,
  },
  metaTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  metaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  metaCardContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  metaCardTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  metaCardDescription: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: spacing.base,
  },
  alsoFromMetaSection: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  alsoFromMetaTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  metaAppsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  chevronIcon: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.regular,
    color: colors.textTertiary,
  },
});