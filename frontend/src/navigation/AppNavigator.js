import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";

// Main Screens
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SkillsScreen from "../screens/SkillsScreen";
import SkillDetailScreen from "../screens/SkillDetailScreen";
import AddSkillScreen from "../screens/AddSkillScreen";
import ExchangesScreen from "../screens/ExchangesScreen";
import ExchangeDetailScreen from "../screens/ExchangeDetailScreen";
import TimeBankScreen from "../screens/TimeBankScreen";
import EventsScreen from "../screens/EventsScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import AddEventScreen from "../screens/AddEventScreen";
import SettingsScreen from "../screens/SettingsScreen";

// Context
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
            />
            <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
            />
        </Stack.Navigator>
    );
};

// Home Stack
const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ title: "Dashboard" }}
            />
            <Stack.Screen
                name="SkillDetail"
                component={SkillDetailScreen}
                options={{ title: "Skill Details" }}
            />
            <Stack.Screen
                name="ExchangeDetail"
                component={ExchangeDetailScreen}
                options={{ title: "Exchange Details" }}
            />
            <Stack.Screen
                name="EventDetail"
                component={EventDetailScreen}
                options={{ title: "Event Details" }}
            />
        </Stack.Navigator>
    );
};

// Skills Stack
const SkillsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SkillsScreen"
                component={SkillsScreen}
                options={{ title: "Skill Marketplace" }}
            />
            <Stack.Screen
                name="SkillDetail"
                component={SkillDetailScreen}
                options={{ title: "Skill Details" }}
            />
            <Stack.Screen
                name="AddSkill"
                component={AddSkillScreen}
                options={{ title: "Add New Skill" }}
            />
        </Stack.Navigator>
    );
};

// Exchanges Stack
const ExchangesStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ExchangesScreen"
                component={ExchangesScreen}
                options={{ title: "My Exchanges" }}
            />
            <Stack.Screen
                name="ExchangeDetail"
                component={ExchangeDetailScreen}
                options={{ title: "Exchange Details" }}
            />
            <Stack.Screen
                name="TimeBankScreen"
                component={TimeBankScreen}
                options={{ title: "Time Bank" }}
            />
        </Stack.Navigator>
    );
};

// Events Stack
const EventsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="EventsScreen"
                component={EventsScreen}
                options={{ title: "Community Events" }}
            />
            <Stack.Screen
                name="EventDetail"
                component={EventDetailScreen}
                options={{ title: "Event Details" }}
            />
            <Stack.Screen
                name="AddEvent"
                component={AddEventScreen}
                options={{ title: "Create Event" }}
            />
        </Stack.Navigator>
    );
};

// Profile Stack
const ProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ title: "My Profile" }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: "Settings" }}
            />
        </Stack.Navigator>
    );
};

// App Tab Navigator
const AppTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Skills") {
                        iconName = focused ? "list" : "list-outline";
                    } else if (route.name === "Exchanges") {
                        iconName = focused
                            ? "swap-horizontal"
                            : "swap-horizontal-outline";
                    } else if (route.name === "Events") {
                        iconName = focused ? "calendar" : "calendar-outline";
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                    }

                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                tabBarActiveTintColor: "#6200ee",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Skills"
                component={SkillsStack}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Exchanges"
                component={ExchangesStack}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Events"
                component={EventsStack}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileStack}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    );
};

// Main Navigator
const AppNavigator = () => {
    const { userToken, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return null; // Or a loading screen
    }

    return (
        <NavigationContainer>
            {userToken !== null ? <AppTabs /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default AppNavigator;
