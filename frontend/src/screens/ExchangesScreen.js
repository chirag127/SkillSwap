import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Image,
} from "react-native";
import {
    Card,
    Title,
    Paragraph,
    Chip,
    ActivityIndicator,
    Button,
    Divider,
    Badge,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

const ExchangesScreen = ({ navigation }) => {
    const { userToken, userInfo } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [exchanges, setExchanges] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("all"); // 'all', 'pending', 'active', 'completed'

    const fetchExchanges = async () => {
        if (refreshing) return;

        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            const response = await axios.get(
                `${API_URL}/api/exchanges/user`,
                config
            );
            setExchanges(response.data.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load exchanges");
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchExchanges();

        // Set up a listener for when the screen comes into focus
        const unsubscribe = navigation.addListener("focus", () => {
            fetchExchanges();
        });

        // Clean up the listener when the component is unmounted
        return unsubscribe;
    }, [navigation]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Loading exchanges...</Text>
            </View>
        );
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchExchanges();
        setRefreshing(false);
    };

    const getFilteredExchanges = () => {
        if (activeTab === "all") {
            return exchanges;
        } else if (activeTab === "pending") {
            return exchanges.filter(
                (exchange) => exchange.status === "pending"
            );
        } else if (activeTab === "active") {
            return exchanges.filter(
                (exchange) => exchange.status === "accepted"
            );
        } else if (activeTab === "completed") {
            return exchanges.filter(
                (exchange) =>
                    exchange.status === "completed" ||
                    exchange.status === "cancelled" ||
                    exchange.status === "declined"
            );
        }
        return exchanges;
    };

    const renderExchangeItem = ({ item }) => {
        const isRequester = item.requester._id === userInfo.id;
        const otherUser = isRequester ? item.provider : item.requester;

        return (
            <Card
                style={styles.card}
                onPress={() =>
                    navigation.navigate("ExchangeDetail", {
                        exchangeId: item._id,
                    })
                }
            >
                <Card.Content>
                    <View style={styles.cardHeader}>
                        <Title style={styles.cardTitle}>
                            {item.skill.title}
                        </Title>
                        <Chip
                            style={[
                                styles.statusChip,
                                getStatusStyle(item.status),
                            ]}
                            textStyle={styles.statusText}
                        >
                            {item.status.toUpperCase()}
                        </Chip>
                    </View>

                    <View style={styles.userInfo}>
                        <Image
                            source={require("../../assets/default-profile.jpg")}
                            style={styles.userImage}
                        />
                        <View style={styles.userDetails}>
                            <Text style={styles.userName}>
                                {isRequester
                                    ? `Provider: ${otherUser.name}`
                                    : `Requester: ${otherUser.name}`}
                            </Text>
                            <Text style={styles.exchangeDate}>
                                {new Date(
                                    item.proposedDate
                                ).toLocaleDateString()}
                            </Text>
                        </View>
                        <View style={styles.creditsContainer}>
                            <Text style={styles.creditsLabel}>Credits:</Text>
                            <Text style={styles.creditsValue}>
                                {item.timeCredits}
                            </Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    // Helper function to get status style
    const getStatusStyle = (status) => {
        switch (status) {
            case "pending":
                return { backgroundColor: "#FFF9C4" }; // Light yellow
            case "accepted":
                return { backgroundColor: "#C8E6C9" }; // Light green
            case "completed":
                return { backgroundColor: "#BBDEFB" }; // Light blue
            case "cancelled":
            case "declined":
                return { backgroundColor: "#FFCDD2" }; // Light red
            default:
                return {};
        }
    };

    return (
        <View style={styles.container}>
            {/* Time Bank Button */}
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

            {/* Filter Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "all" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("all")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "all" && styles.activeTabText,
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "pending" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("pending")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "pending" && styles.activeTabText,
                        ]}
                    >
                        Pending
                    </Text>
                    {exchanges.filter((e) => e.status === "pending").length >
                        0 && (
                        <Badge style={styles.badge}>
                            {
                                exchanges.filter((e) => e.status === "pending")
                                    .length
                            }
                        </Badge>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "active" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("active")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "active" && styles.activeTabText,
                        ]}
                    >
                        Active
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "completed" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("completed")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "completed" && styles.activeTabText,
                        ]}
                    >
                        Completed
                    </Text>
                </TouchableOpacity>
            </View>

            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Button
                        mode="contained"
                        onPress={fetchExchanges}
                        style={styles.retryButton}
                    >
                        Retry
                    </Button>
                </View>
            ) : getFilteredExchanges().length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No exchanges found</Text>
                    <Text style={styles.emptySubtext}>
                        {activeTab !== "all"
                            ? `No ${activeTab} exchanges found. Try a different filter.`
                            : "Start by requesting a skill from the marketplace"}
                    </Text>
                    {activeTab === "all" && (
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
                    )}
                </View>
            ) : (
                <FlatList
                    data={getFilteredExchanges()}
                    renderItem={renderExchangeItem}
                    keyExtractor={(item) => item._id}
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
    tabsContainer: {
        flexDirection: "row",
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: "center",
        position: "relative",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: "#6200ee",
    },
    tabText: {
        color: "#666",
    },
    activeTabText: {
        color: "#6200ee",
        fontWeight: "bold",
    },
    badge: {
        position: "absolute",
        top: 5,
        right: 15,
        backgroundColor: "#FF5252",
    },
    listContainer: {
        padding: 10,
    },
    card: {
        marginBottom: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    cardTitle: {
        flex: 1,
        fontSize: 16,
    },
    statusChip: {
        height: 24,
    },
    statusText: {
        fontSize: 10,
        fontWeight: "bold",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontWeight: "bold",
        fontSize: 14,
    },
    exchangeDate: {
        fontSize: 12,
        color: "#666",
    },
    creditsContainer: {
        alignItems: "center",
    },
    creditsLabel: {
        fontSize: 12,
        color: "#666",
    },
    creditsValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#6200ee",
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
