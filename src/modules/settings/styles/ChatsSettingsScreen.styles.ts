import { StyleSheet } from 'react-native';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const chatsSettingsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    paddingTop: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
  },
  backIcon: {
    width: spacing.lg * 1.2,
    height: spacing.lg * 1.2,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.semibold,
  },
  searchButton: {
    padding: spacing.xs,
    width: spacing.lg * 1.2,
    height: spacing.lg * 1.2,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 0,
  },
  section: {
    borderRadius: 0,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  settingRowIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0,
    minHeight: 56,
  },
  settingIcon: {
    marginTop: spacing.xs,
  },
  settingIconText: {
    fontSize: typography.fontSize['2xl'],
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.xs,
  },
  settingTitleNoSubtitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 0,
  },
  settingSubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },
  settingIconContainer: {
    width: spacing["3xl"] + spacing.xs,
    height: spacing["3xl"] + spacing.xs,
    borderRadius: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingIconImage: {
    width: spacing.iconSize,
    height: spacing.iconSize,
  },
  settingArrow: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.regular,
    marginLeft: spacing.sm,
  },
});
