import type React from "react"
import { TouchableOpacity, Text, type ViewStyle, type TextStyle } from "react-native"
import { appButtonStyles } from "./AppButton.styles"

interface AppButtonProps {
  label: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  fullWidth?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

export const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return appButtonStyles.primary
      case "secondary":
        return appButtonStyles.secondary
      case "outline":
        return appButtonStyles.outline
      default:
        return appButtonStyles.primary
    }
  }

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return appButtonStyles.small
      case "large":
        return appButtonStyles.large
      default:
        return appButtonStyles.medium
    }
  }

  const getTextSize = () => {
    switch (size) {
      case "small":
        return appButtonStyles.smallText
      case "large":
        return appButtonStyles.largeText
      default:
        return appButtonStyles.mediumText
    }
  }

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return appButtonStyles.primaryText
      case "secondary":
        return appButtonStyles.secondaryText
      case "outline":
        return appButtonStyles.outlineText
      default:
        return appButtonStyles.primaryText
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        appButtonStyles.container,
        getVariantStyle(),
        getSizeStyle(),
        fullWidth && appButtonStyles.fullWidth,
        disabled && appButtonStyles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      <Text style={[appButtonStyles.baseText, getTextColor(), getTextSize(), textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}