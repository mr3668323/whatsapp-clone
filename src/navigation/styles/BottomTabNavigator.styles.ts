import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

export const bottomTabNavigatorStyles = StyleSheet.create({
  tabIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  tabIconEmoji: {
    fontSize: typography.fontSize.xl,
  },
  tabLabel: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
    width: '100%',
  },
  tabLabelFocused: {
    fontWeight: typography.fontWeight.semibold,
  },
  tabLabelUnfocused: {
    fontWeight: typography.fontWeight.normal,
  },
  tabBarStyle: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 0,
    paddingBottom: 0,
    height: spacing['3xl'] + spacing.base, // 40 + 16 = 56, but using 65 from original
  },
});
