import { StyleSheet } from 'react-native';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const themePickerModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    borderRadius: spacing.sm,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // Will be overridden by theme
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    textAlign: 'center',
  },
  optionsContainer: {
    paddingVertical: spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  optionLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    flex: 1,
  },
  radioContainer: {
    marginLeft: spacing.md,
  },
  radioSelected: {
    width: spacing.base,
    height: spacing.base,
    borderRadius: spacing.base / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: spacing.sm / 2,
  },
  radioUnselected: {
    width: spacing.base,
    height: spacing.base,
    borderRadius: spacing.base / 2,
    borderWidth: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semibold,
  },
});
