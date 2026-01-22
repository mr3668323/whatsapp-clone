import type React from "react"
import { useState } from "react"
import { View, TextInput, Text, type TextInputProps } from "react-native"
import { appInputStyles } from "./AppInput.styles"
import { colors } from "../../styles/colors"

interface AppInputProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: any
}

export const AppInput: React.FC<AppInputProps> = ({ label, error, containerStyle, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={[appInputStyles.container, containerStyle]}>
      {label && <Text style={appInputStyles.label}>{label}</Text>}
      <TextInput
        {...props}
        style={[appInputStyles.input, isFocused && appInputStyles.inputFocused, error && appInputStyles.error]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={colors.textTertiary}
      />
      {error && <Text style={appInputStyles.errorText}>{error}</Text>}
    </View>
  )
}
