import type React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { View, Text, Image } from "react-native"
import { HomeScreen } from "../modules/home/screens/HomeScreen"
import { UpdatesScreen } from "../modules/updates/screens/UpdatesScreen"
import { CallsScreen } from "../modules/calls/screens/CallsScreen"
import { CommunitiesScreen } from "../modules/communities/screens/CommunitiesScreen"
import { useTheme } from "../contexts/ThemeContext"
import { bottomTabNavigatorStyles } from "./styles/BottomTabNavigator.styles"
import type { BottomTabParamList } from "../types/navigation"

const Tab = createBottomTabNavigator<BottomTabParamList>()

interface TabIconProps {
    name: string
    focused: boolean
    theme: any
}

const TabIcon: React.FC<TabIconProps> = ({ name, focused, theme }) => {
    return (
        <View style={bottomTabNavigatorStyles.tabIconContainer}>
            <View
                style={[
                    bottomTabNavigatorStyles.tabIconWrapper,
                    {
                        backgroundColor: focused ? theme.whatsappGreen : 'transparent',
                    },
                ]}
            >
                <Image
                    source={
                        name === "Chats"
                            ? require("../assets/icons/whatsapp-chat.png")
                            : name === "Updates"
                            ? require("../assets/icons/whatsapp-updates.png")
                            : name === "Communities"
                            ? require("../assets/icons/whatsapp-communities.png")
                            : require("../assets/icons/whatsapp-calls.png")
                    }
                    style={[bottomTabNavigatorStyles.tabIconEmoji, { tintColor: focused ? theme.white : theme.iconGray }]}
                    resizeMode="contain"
                />
            </View>
            <Text
                style={[
                    bottomTabNavigatorStyles.tabLabel,
                    focused ? bottomTabNavigatorStyles.tabLabelFocused : bottomTabNavigatorStyles.tabLabelUnfocused,
                    {
                        color: focused ? theme.textPrimary : theme.textTertiary,
                    },
                ]}
            >
                {name}
            </Text>
        </View>
    )
}

export const BottomTabNavigator: React.FC = () => {
    const { theme } = useTheme();
    
    return (
        <Tab.Navigator
            initialRouteName="Chats"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: [bottomTabNavigatorStyles.tabBarStyle, { backgroundColor: theme.background, borderTopColor: theme.border }],
                tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} theme={theme} />,
                tabBarLabel: () => null,
            })}
        >
            <Tab.Screen name="Chats" component={HomeScreen} />
            <Tab.Screen name="Updates" component={UpdatesScreen} />
            <Tab.Screen name="Communities" component={CommunitiesScreen} />
            <Tab.Screen name="Calls" component={CallsScreen} />
        </Tab.Navigator>
    )
}
