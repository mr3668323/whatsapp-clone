import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const newChatScreenStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
  backButtonText: {
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    flex: 1,
  },

  // Search bar
  searchContainer: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchInputContainer: {
    borderRadius: spacing.buttonRadius,
    backgroundColor: colors.backgroundInput,
    paddingHorizontal: spacing.base,
    height: spacing.inputHeight,
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },

  // Static options
  staticOptionsContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  staticOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  staticOptionIcon: {
    width: spacing.iconSize + spacing.base, // 24 + 16 = 40
    height: spacing.iconSize + spacing.base, // 24 + 16 = 40
    borderRadius: spacing.buttonRadius, // 24 (half of 48, but using buttonRadius for consistency)
    backgroundColor: colors.whatsappGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  staticOptionIconText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  staticOptionText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },

  // Section title
  sectionTitleContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.semibold,
  },

  // Permission denied message
  permissionDeniedContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  permissionDeniedText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },

  // Manual number row
  manualNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  manualNumberIcon: {
    width: spacing.iconSize + spacing.base, // 24 + 16 = 40
    height: spacing.iconSize + spacing.base, // 24 + 16 = 40
    borderRadius: spacing.buttonRadius, // 24 (half of 48, but using buttonRadius for consistency)
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  manualNumberIconText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.base,
  },
  manualNumberContent: {
    flex: 1,
  },
  manualNumberTitle: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  manualNumberSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },

  // Contact item
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  contactAvatar: {
    width: spacing.iconSize + spacing.base, // 24 + 16 = 40
    height: spacing.iconSize + spacing.base, // 24 + 16 = 40
    borderRadius: spacing.buttonRadius, // 24 (half of 48, but using buttonRadius for consistency)
    backgroundColor: colors.whatsappGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  contactAvatarText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  contactSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },

  // Loading states
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  emptyStateContainer: {
    padding: spacing.base,
    alignItems: 'center',
  },
  emptyStateText: {
    color: colors.textSecondary,
  },

  // List container
  listContentContainer: {
    paddingBottom: spacing.lg,
  },
  listContentContainerEmpty: {
    paddingBottom: spacing.lg,
    flexGrow: 1,
  },
});
