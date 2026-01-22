// WhatsApp EXACT Typography - Titoo Copy
export const typography = {
  fontSize: {
    xxs: 11,          // Extra extra small
    xs: 12,           // Extra small (status time)
    sm: 14,           // Small (subtext)
    base: 15,         // Base (time, battery) - CORRECTED from screenshot
    lg: 16,           // Large (description, button) - CORRECTED
    xl: 18,           // Extra large
    "2xl": 24,        // 2x large
    "3xl": 28,        // 3x large (title) - CORRECTED
    "4xl": 32,        // 4x large
  },
  
  fontWeight: {
    light: "300" as const,      // Light
    normal: "400" as const,     // Normal/Regular
    medium: "500" as const,     // Medium
    semibold: "600" as const,   // Semibold (button, links) - CORRECTED
    bold: "700" as const,       // Bold (title, time) - CORRECTED
  },
  
  lineHeight: {
    tight: 1.2,        // Tight line height
    normal: 1.4,       // Normal line height
    relaxed: 1.6,      // Relaxed line height
    description: 24,   // EXACT description line height (16 * 1.5 = 24) - CORRECTED
  },
  
  // WhatsApp specific fonts (custom Roboto fonts)
  fontFamily: {
    regular: "Roboto-Regular",          // Roboto Regular
    medium: "Roboto-Medium",           // Roboto Medium
    semibold: "Roboto-SemiBold",         // Roboto SemiBold
    bold: "Roboto-Bold",             // Roboto Bold
  },
}