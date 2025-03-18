import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, Card, Title, Paragraph, Chip } from "react-native-paper";

const ExchangeDetailScreen = ({ navigation }) => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Exchange Detail</Text>
                <Text style={styles.subtitle}>
                    This screen would show details of an exchange
                </Text>

                <Button
                    mode="contained"
                    onPress={() => navigation.goBack()}
                    style={styles.button}
                >
                    Go Back
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    contentContainer: {
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 30,
        textAlign: "center",
    },
    button: {
        paddingHorizontal: 20,
    },
});

export default ExchangeDetailScreen;
