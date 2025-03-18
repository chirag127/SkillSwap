import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { List, Switch, Button, Divider } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";

const SettingsScreen = ({ navigation }) => {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
    };

    const showComingSoonAlert = () => {
        Alert.alert(
            "Coming Soon",
            "This feature will be available in a future update."
        );
    };

    return (
        <ScrollView style={styles.container}>
            <List.Section>
                <List.Subheader>Account</List.Subheader>
                <List.Item
                    title="Edit Profile"
                    left={(props) => (
                        <List.Icon {...props} icon="account-edit" />
                    )}
                    onPress={showComingSoonAlert}
                />
                <List.Item
                    title="Change Password"
                    left={(props) => <List.Icon {...props} icon="lock-reset" />}
                    onPress={showComingSoonAlert}
                />
                <List.Item
                    title="Privacy Settings"
                    left={(props) => (
                        <List.Icon {...props} icon="shield-account" />
                    )}
                    onPress={showComingSoonAlert}
                />
            </List.Section>

            <Divider />

            <List.Section>
                <List.Subheader>Notifications</List.Subheader>
                <List.Item
                    title="Push Notifications"
                    left={(props) => <List.Icon {...props} icon="bell" />}
                    right={(props) => (
                        <Switch
                            {...props}
                            value={true}
                            onValueChange={showComingSoonAlert}
                        />
                    )}
                />
                <List.Item
                    title="Email Notifications"
                    left={(props) => <List.Icon {...props} icon="email" />}
                    right={(props) => (
                        <Switch
                            {...props}
                            value={true}
                            onValueChange={showComingSoonAlert}
                        />
                    )}
                />
            </List.Section>

            <Divider />

            <List.Section>
                <List.Subheader>About</List.Subheader>
                <List.Item
                    title="Terms of Service"
                    left={(props) => (
                        <List.Icon {...props} icon="file-document" />
                    )}
                    onPress={showComingSoonAlert}
                />
                <List.Item
                    title="Privacy Policy"
                    left={(props) => <List.Icon {...props} icon="shield" />}
                    onPress={showComingSoonAlert}
                />
                <List.Item
                    title="Help & Support"
                    left={(props) => (
                        <List.Icon {...props} icon="help-circle" />
                    )}
                    onPress={showComingSoonAlert}
                />
                <List.Item
                    title="About SkillSwap"
                    left={(props) => (
                        <List.Icon {...props} icon="information" />
                    )}
                    onPress={showComingSoonAlert}
                />
            </List.Section>

            <View style={styles.logoutContainer}>
                <Button
                    mode="outlined"
                    icon="logout"
                    onPress={handleLogout}
                    style={styles.logoutButton}
                    color="#FF5252"
                >
                    Logout
                </Button>
            </View>

            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>SkillSwap v1.0.0</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    logoutContainer: {
        padding: 20,
    },
    logoutButton: {
        borderColor: "#FF5252",
    },
    versionContainer: {
        alignItems: "center",
        padding: 20,
    },
    versionText: {
        color: "#999",
    },
});

export default SettingsScreen;
