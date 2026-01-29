import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const updatesScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header Styles
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    position: 'relative',
    minHeight: 60,
  },
  headerTitleContainer: {
    flex: 1,
    paddingTop:spacing.lg
  },
  headerTitle: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  headerIconButton: {
    padding: spacing.xs,
  },
  searchIcon: {
    width: typography.fontSize.lg * 1.6,
    height: typography.fontSize.lg * 1.6,
    tintColor: colors.textPrimary,
  },
  moreIcon: {
    width: typography.fontSize.lg * 1.3,
    height: typography.fontSize.lg * 1.3,
    tintColor: colors.textPrimary,
  },
  
  // Search Styles
  searchInputContainer: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
    borderRadius: spacing.lg,
    paddingHorizontal: spacing.sm,
    height: spacing["3xl"] + spacing.xs,
  },
  searchBackButton: {
    padding: spacing.xs,
  },
  searchBackIcon: {
    width: typography.fontSize.lg * 1.2,
    height: typography.fontSize.lg * 1.2,
    tintColor: colors.textSecondary,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  clearButton: {
    padding: spacing.xs,
  },
  clearIcon: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    color: colors.textTertiary,
  },
  
  // Dropdown Menu Styles
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  dropdownMenu: {
    position: 'absolute',
    top: spacing.buttonHeight + spacing.sm,
    right: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: spacing.base,
    paddingVertical: spacing.sm,
    minWidth: 200,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: spacing.xs },
    shadowOpacity: 0.15,
    shadowRadius: spacing.md,
    elevation: 8,
    zIndex: 1000,
  },
  menuItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuItemText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
  },
  
  // Status Section
  statusSection: {
    backgroundColor: colors.white,
    paddingTop: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  statusList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  
  // Status Cards
  myStatusCard: {
    width: 80,
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  statusCard: {
    width: 80,
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  statusAvatarContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  myStatusAvatar: {
    width: spacing.buttonHeight + spacing.sm,
    height: spacing.buttonHeight + spacing.sm,
    borderRadius: (spacing.buttonHeight + spacing.sm) / 2,
    backgroundColor: colors.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: spacing.xxs,
    borderColor: colors.statusViewed,
  },
  myStatusAvatarText: {
    fontSize: typography.fontSize["3xl"],
    fontFamily: typography.fontFamily.regular,
  },
  addStatusIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: spacing.xl / 2,
    backgroundColor: colors.whatsappGreen,
    borderWidth: spacing.xxs,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStatusIconText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  statusImageContainer: {
    width: spacing.buttonHeight + spacing.sm,
    height: spacing.buttonHeight + spacing.sm,
    borderRadius: (spacing.buttonHeight + spacing.sm) / 2,
    marginBottom: spacing.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  statusImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.whatsappGreen,
    opacity: 0.3,
  },
  statusProfileAvatar: {
    position: 'absolute',
    top: spacing.xxs,
    left: spacing.xxs,
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: spacing.xxs,
  },
  unseenStatusAvatar: {
    borderColor: colors.statusBorder,
  },
  seenStatusAvatar: {
    borderColor: colors.statusViewed,
  },
  statusProfileAvatarText: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.regular,
  },
  statusName: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  
  // Channels Section
  channelsSection: {
    flex: 1,
    backgroundColor: colors.white,
  },
  channelsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  exploreButton: {
    backgroundColor: colors.unreadBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.base,
  },
  exploreButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.textSecondary,
  },
  
  // Channel Cards
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    position: 'relative',
  },
  channelAvatar: {
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
    backgroundColor: colors.whatsappGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  channelAvatarText: {
    fontSize: typography.fontSize["3xl"],
    fontFamily: typography.fontFamily.regular,
    color: colors.white,
  },
  channelInfo: {
    flex: 1,
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  channelName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semibold,
    color: colors.textPrimary,
    marginRight: spacing.xs,
  },
  verifiedBadge: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.whatsappBlue,
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing.xs,
  },
  mutedIcon: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.mute,
  },
  channelLastUpdate: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textTertiary,
    marginBottom: spacing.xxs,
  },
  channelMessagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkIcon: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    marginRight: spacing.xs,
    color: colors.textTertiary,
  },
  channelLastMessage: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    flex: 1,
  },
  unreadIndicator: {
    position: 'absolute',
    right: spacing.lg,
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: spacing.xs,
    backgroundColor: colors.unreadBadge,
  },
  
  // Floating Action Buttons
  fabContainer: {
    position: 'absolute',
    bottom: spacing.lg + spacing.sm,
    right: spacing.lg,
    alignItems: 'flex-end',
  },
  pencilFab: {
    width: spacing.avatarSize * 0.7,
    height: spacing.avatarSize * 0.7,
    borderRadius: (spacing.avatarSize * 0.7) / 2,
    backgroundColor: colors.white, // white circular background like WhatsApp
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: spacing.xxs },
    shadowOpacity: 0.1,
    shadowRadius: spacing.xs,
    elevation: 2,
  },
  pencilIconImage: {
    width: spacing.iconSize * 1.1,
    height: spacing.iconSize * 1.1,
    tintColor: colors.textSecondary, // dark grey / near-black
  },
  cameraFab: {
    width: spacing.avatarSize,
    height: spacing.avatarSize,
    borderRadius: spacing.avatarSize / 2,
    backgroundColor: colors.floatingButton,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: spacing.xs },
    shadowOpacity: 0.2,
    shadowRadius: spacing.sm,
    elevation: 4,
  },
  cameraIcon: {
    width: typography.fontSize.lg * 1.8,
    height: typography.fontSize.lg * 1.8,
    tintColor: colors.white,
  },
  
  // Search Results Styles
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  noResultsText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionNoResults: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  sectionNoResultsText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  
  // Settings Screen Styles
  settingsContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.md,
  },
  backIcon: {
    width: spacing.lg * 1.2,
    height: spacing.lg * 1.2,
    tintColor: colors.textPrimary,
  },
  settingsTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  settingsContent: {
    flex: 1,
    padding: spacing.lg,
  },
  settingsText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});