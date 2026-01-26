import type React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { View, Text } from "react-native"
import { HomeScreen } from "../modules/home/screens/HomeScreen"
import { UpdatesScreen } from "../modules/updates/screens/UpdatesScreen"
import { CallsScreen } from "../modules/calls/screens/CallsScreen"
import { CommunitiesScreen } from "../modules/communities/screens/CommunitiesScreen"
import { colors } from "../styles/colors"
import { bottomTabNavigatorStyles } from "./styles/BottomTabNavigator.styles"
import type { BottomTabParamList } from "../types/navigation"

const Tab = createBottomTabNavigator<BottomTabParamList>()

interface TabIconProps {
    name: string
    focused: boolean
}

const TabIcon: React.FC<TabIconProps> = ({ name, focused }) => {
    const iconMap: { [key: string]: string } = {
        Updates: "📱",
        Calls: "☎️",
        Communities: "👥",
        Chats: "💬",
    }

    return (
        <View style={bottomTabNavigatorStyles.tabIconContainer}>
            <Text style={bottomTabNavigatorStyles.tabIconEmoji}>{iconMap[name] || "📱"}</Text>
            <Text
                style={[
                    bottomTabNavigatorStyles.tabLabel,
                    focused ? bottomTabNavigatorStyles.tabLabelFocused : bottomTabNavigatorStyles.tabLabelUnfocused,
                    {
                        color: focused ? colors.buttonPrimary : colors.textTertiary,
                    },
                ]}
            >
                {name}
            </Text>
        </View>
    )
}

export const BottomTabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            initialRouteName="Chats"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: bottomTabNavigatorStyles.tabBarStyle,
                tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
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
