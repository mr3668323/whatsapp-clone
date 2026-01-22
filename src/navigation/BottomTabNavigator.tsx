import type React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { View, Text } from "react-native"
import { HomeScreen } from "../modules/home/screens/HomeScreen"
import { UpdatesScreen } from "../modules/updates/screens/UpdatesScreen"
import { CallsScreen } from "../modules/calls/screens/CallsScreen"
import { CommunitiesScreen } from "../modules/communities/screens/CommunitiesScreen"
import { colors } from "../styles/colors"
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
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 8,
            }}
        >
            <Text style={{ fontSize: 24 }}>{iconMap[name] || "📱"}</Text>
            <Text
                style={{
                    fontSize: 11,
                    marginTop: 4,
                    color: focused ? colors.buttonPrimary : colors.textTertiary,
                    fontWeight: focused ? "600" : "400",
                    width: "100%",
                }}
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
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    paddingTop: 0,
                    paddingBottom: 0,
                    height: 65,
                },
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
