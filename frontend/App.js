import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

// Define the theme
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#6200ee",
        accent: "#03dac4",
    },
};

export default function App() {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <AuthProvider>
                    <AppNavigator />
                    <StatusBar style="auto" />
                </AuthProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
