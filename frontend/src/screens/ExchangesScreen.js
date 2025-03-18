import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import {
    Card,
    Title,
    Paragraph,
    Chip,
    ActivityIndicator,
    Button,
} from "react-native-paper";
import { AuthContext } from "../context/AuthContext";

const ExchangesScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [exchanges, setExchanges] = useState([]);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setLoading(false);
            setExchanges([]);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Loading exchanges...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.timeBankContainer}>
                <TouchableOpacity
                    style={styles.timeBankButton}
                    onPress={() => navigation.navigate("TimeBankScreen")}
                >
                    <Text style={styles.timeBankButtonText}>
                        View Time Bank
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No exchanges yet</Text>
                <Text style={styles.emptySubtext}>
                    Start by requesting a skill from the marketplace
                </Text>
                <Button
                    mode="contained"
                    onPress={() =>
                        navigation.navigate("Skills", {
                            screen: "SkillsScreen",
                        })
                    }
                    style={styles.browseButton}
                >
                    Browse Skills
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
    timeBankContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "white",
    },
    timeBankButton: {
        backgroundColor: "#E8DEF8",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    timeBankButtonText: {
        color: "#6200ee",
        fontWeight: "bold",
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
    browseButton: {
        paddingHorizontal: 20,
    },
});

export default ExchangesScreen;
