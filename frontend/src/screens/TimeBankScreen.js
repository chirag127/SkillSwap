import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import {
    Card,
    Title,
    Paragraph,
    ActivityIndicator,
    Button,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

const TimeBankScreen = ({ navigation }) => {
    const { userToken, userInfo } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            // In a real app, you would have a dedicated endpoint for time bank transactions
            // For this demo, we'll use the exchanges endpoint and filter for completed exchanges
            const response = await axios.get(
                `${API_URL}/api/exchanges/user`,
                config
            );

            const completedExchanges = response.data.data.filter(
                (exchange) => exchange.status === "completed"
            );

            // Transform exchanges into transactions
            const transformedTransactions = completedExchanges.map(
                (exchange) => {
                    const isProvider = exchange.provider._id === userInfo.id;
                    return {
                        id: exchange._id,
                        date: new Date(exchange.completedAt),
                        description: exchange.skill.title,
                        amount: isProvider
                            ? exchange.timeCredits
                            : -exchange.timeCredits,
                        withUser: isProvider
                            ? exchange.requester.name
                            : exchange.provider.name,
                        type: isProvider ? "earned" : "spent",
                    };
                }
            );

            // Sort by date (newest first)
            transformedTransactions.sort((a, b) => b.date - a.date);

            setTransactions(transformedTransactions);
            setLoading(false);
        } catch (err) {
            setError("Failed to load time bank transactions");
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTransactions();
        setRefreshing(false);
    };

    const renderTransactionItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.transactionHeader}>
                    <View>
                        <Title>{item.description}</Title>
                        <Paragraph>with {item.withUser}</Paragraph>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text
                            style={[
                                styles.amount,
                                {
                                    color:
                                        item.amount > 0 ? "#4CAF50" : "#FF5252",
                                },
                            ]}
                        >
                            {item.amount > 0 ? "+" : ""}
                            {item.amount} hrs
                        </Text>
                    </View>
                </View>
                <View style={styles.transactionFooter}>
                    <Text style={styles.date}>
                        {item.date.toLocaleDateString()} at{" "}
                        {item.date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                    <View style={styles.typeContainer}>
                        <Text
                            style={[
                                styles.type,
                                {
                                    color:
                                        item.amount > 0 ? "#4CAF50" : "#FF5252",
                                },
                            ]}
                        >
                            {item.type}
                        </Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text style={styles.balanceValue}>
                    {userInfo?.timeBalance || 0} hours
                </Text>
                <Text style={styles.balanceDescription}>
                    Use your time credits to request services from other members
                </Text>
            </View>

            <View style={styles.transactionsContainer}>
                <Text style={styles.sectionTitle}>Transaction History</Text>

                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <Button
                            mode="contained"
                            onPress={fetchTransactions}
                            style={styles.retryButton}
                        >
                            Retry
                        </Button>
                    </View>
                ) : transactions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="time-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>
                            No transactions yet
                        </Text>
                        <Text style={styles.emptySubtext}>
                            Complete exchanges to start building your time bank
                            history
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
                ) : (
                    <FlatList
                        data={transactions}
                        renderItem={renderTransactionItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    />
                )}
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
    balanceContainer: {
        backgroundColor: "#6200ee",
        padding: 20,
        alignItems: "center",
    },
    balanceLabel: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 16,
        marginBottom: 5,
    },
    balanceValue: {
        color: "white",
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 10,
    },
    balanceDescription: {
        color: "rgba(255, 255, 255, 0.8)",
        textAlign: "center",
    },
    transactionsContainer: {
        flex: 1,
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        marginBottom: 10,
        elevation: 2,
    },
    transactionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    amountContainer: {
        alignItems: "flex-end",
    },
    amount: {
        fontSize: 18,
        fontWeight: "bold",
    },
    transactionFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    date: {
        color: "#666",
        fontSize: 12,
    },
    typeContainer: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
    type: {
        fontSize: 12,
        fontWeight: "500",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "#FF5252",
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
    },
    retryButton: {
        paddingHorizontal: 20,
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

export default TimeBankScreen;
