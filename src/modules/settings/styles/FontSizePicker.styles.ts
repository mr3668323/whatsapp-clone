import { StyleSheet } from 'react-native';
import { spacing } from '../../../styles/spacing';
import { typography } from '../../../styles/typography';

export const fontSizePickerStyles = StyleSheet.create({
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.base,
    borderWidth: 1,
    minWidth: 100,
  },
  pickerText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    marginRight: spacing.xs,
  },
  chevron: {
    fontSize: typography.fontSize.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: spacing.base,
    borderWidth: 1,
    minWidth: 200,
    maxWidth: 300,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
  },
  checkmark: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
  },
});
