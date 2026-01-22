import type React from "react"
import { useEffect } from "react"
import { View, Text, StatusBar, Image } from "react-native"
import { splashScreenStyles } from "../styles/SplashScreen.styles"
import type { RootStackParamList } from "../../../types/navigation"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"

type SplashScreenProps = NativeStackScreenProps<RootStackParamList, "Splash">

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    // SplashScreen always shows first, then AppNavigator decides navigation.
    // We simply wait a bit, then move to PrivacyPolicy (Auth flow start).
    const timer = setTimeout(() => {
      console.log('SplashScreen: Navigating to PrivacyPolicy (registration flow)');
      navigation.replace("PrivacyPolicy");
    }, 1500); // Show splash for at least 1.5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [navigation])

  return (
    <View style={splashScreenStyles.container}>
      {/* Native Status Bar */}
      <StatusBar 
        barStyle="dark-content" // Black text on white background
      />

      {/* Main Content */}
      <View style={splashScreenStyles.content}>
        {/* WhatsApp Logo and Text */}
        <View style={splashScreenStyles.logoContainer}>
          {/* WhatsApp Logo Image from assets */}
          <Image
            source={require("../../../assets/images/whatsapp-logo.png")}
            style={splashScreenStyles.whatsappLogoImage}
            resizeMode="contain"
          />
          
        </View>

        {/* Footer - EXACT as screenshot: icon ∞ then "Meta" in TEAL */}
        <View style={splashScreenStyles.footer}>
          <Text style={splashScreenStyles.footerText}>from</Text>
          
          {/* Meta with icon first, then text - BOTH in WhatsApp teal */}
          <View style={splashScreenStyles.metaContainer}>
            <Text style={splashScreenStyles.metaIcon}>∞</Text>
            <Text style={splashScreenStyles.metaText}>Meta</Text>
          </View>
        </View>
      </View>
    </View>
  )
}