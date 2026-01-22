import React, { useState } from 'react';
import { View, Text, ScrollView, Linking, StatusBar, Image, TouchableOpacity, BackHandler, Alert, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { privacyPolicyStyles } from '../styles/PrivacyPolicy.styles';
import { AppButton } from "../../../components/common/AppButton";
import { colors } from '../../../styles/colors';

type PrivacyPolicyScreenProps = NativeStackScreenProps<RootStackParamList, 'PrivacyPolicy'>;

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
    const [showMenu, setShowMenu] = useState(false);

    const handleAgreeAndContinue = () => {
        navigation.navigate('PhoneVerification');
    };

    const handlePrivacyPolicy = () => {
        Linking.openURL('https://www.whatsapp.com/legal/privacy-policy');
    };

    const handleTermsOfService = () => {
        Linking.openURL('https://www.whatsapp.com/legal/terms-of-service');
    };

    const handleBack = () => {
        Alert.alert(
            'Exit WhatsApp?',
            'Are you sure you want to exit?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: true }
        );
    };

    const handleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleHelp = () => {
        setShowMenu(false);
        Linking.openURL('https://faq.whatsapp.com/');
    };

    const closeMenu = () => {
        setShowMenu(false);
    };

    return (
        <View style={privacyPolicyStyles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={privacyPolicyStyles.header}>
                <TouchableOpacity onPress={handleBack} style={privacyPolicyStyles.backButton}>
                    <Text style={privacyPolicyStyles.backButtonIcon}>←</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleMenu} style={privacyPolicyStyles.menuButton}>
                    <View style={privacyPolicyStyles.menuIconContainer}>
                        <View style={privacyPolicyStyles.menuDot} />
                        <View style={privacyPolicyStyles.menuDot} />
                        <View style={privacyPolicyStyles.menuDot} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Dropdown Menu Modal */}
            <Modal
                visible={showMenu}
                transparent={true}
                animationType="fade"
                onRequestClose={closeMenu}
            >
                <TouchableOpacity 
                    style={privacyPolicyStyles.menuOverlay}
                    activeOpacity={1}
                    onPress={closeMenu}
                >
                    <View style={privacyPolicyStyles.menuContainer}>
                        <View style={privacyPolicyStyles.menuTriangle} />
                        <TouchableOpacity 
                            style={privacyPolicyStyles.menuItem}
                            onPress={handleHelp}
                        >
                            <Text style={privacyPolicyStyles.menuItemText}>Help</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <ScrollView
                style={privacyPolicyStyles.scrollView}
                contentContainerStyle={privacyPolicyStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={privacyPolicyStyles.logoContainer}>
                    <Image
                        source={require("../../../assets/images/whatsapp-logo.png")}
                        style={privacyPolicyStyles.whatsappLogo}
                        resizeMode="contain"
                    />
                </View>

                <Text style={privacyPolicyStyles.title}>Add an account</Text>

                <Text style={privacyPolicyStyles.description}>
                    Read our{' '}
                    <Text style={privacyPolicyStyles.linkText} onPress={handlePrivacyPolicy}>
                        Privacy Policy
                    </Text>
                    . Tap "Agree and continue" to accept the{' '}
                    <Text style={privacyPolicyStyles.linkText} onPress={handleTermsOfService}>
                        Terms of Service
                    </Text>.
                </Text>

                <View style={privacyPolicyStyles.buttonContainer}>
                    <AppButton
                        label="Agree and continue"
                        variant="primary"
                        size="medium"
                        fullWidth
                        onPress={handleAgreeAndContinue}
                    />
                </View>
            </ScrollView>
        </View>
    );
};