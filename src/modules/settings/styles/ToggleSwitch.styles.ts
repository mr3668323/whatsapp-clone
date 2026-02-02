import { StyleSheet } from 'react-native';
import { spacing } from '../../../styles/spacing';

export const toggleSwitchStyles = StyleSheet.create({
  track: {
    width: spacing['3xl'] + spacing.xs, // 48px equivalent
    height: spacing.xl + spacing.xs, // 28px equivalent
    borderRadius: (spacing.xl + spacing.xs) / 2,
    padding: spacing.xxs,
    justifyContent: 'center',
  },
  thumb: {
    width: spacing.xl - spacing.xxs, // 20px equivalent
    height: spacing.xl - spacing.xxs,
    borderRadius: (spacing.xl - spacing.xxs) / 2,
  },
  thumbTranslate: 20, // 20px translate
});
