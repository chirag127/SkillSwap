import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
    Button,
    Card,
    Title,
    Paragraph,
    ActivityIndicator,
} from "react-native-paper";

const EventsScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setLoading(false);
            setEvents([]);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Loading events...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No community events yet</Text>
                <Text style={styles.emptySubtext}>
                    Be the first to create a community event!
                </Text>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate("AddEvent")}
                    style={styles.createButton}
                >
                    Create Event
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: "#666",
        marginTop: 10,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#999",
        marginTop: 5,
        marginBottom: 20,
        textAlign: "center",
    },
    createButton: {
        paddingHorizontal: 20,
    },
});

export default EventsScreen;
