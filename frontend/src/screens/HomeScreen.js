import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import {
    Card,
    Title,
    Paragraph,
    Button,
    ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

const HomeScreen = ({ navigation }) => {
    const { userToken, userInfo } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [recentSkills, setRecentSkills] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [activeExchanges, setActiveExchanges] = useState([]);
    const [error, setError] = useState(null);

    const fetchHomeData = async () => {
        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            // Fetch recent skills
            const skillsResponse = await axios.get(
                `${API_URL}/api/skills?limit=5`,
                config
            );
            setRecentSkills(skillsResponse.data.data);

            // Fetch upcoming events
            const eventsResponse = await axios.get(
                `${API_URL}/api/events?upcoming=true&limit=3`,
                config
            );
            setUpcomingEvents(eventsResponse.data.data);

            // Fetch active exchanges
            const exchangesResponse = await axios.get(
                `${API_URL}/api/exchanges/user`,
                config
            );
            const active = exchangesResponse.data.data
                .filter(
                    (exchange) =>
                        exchange.status === "pending" ||
                        exchange.status === "accepted"
                )
                .slice(0, 3);
            setActiveExchanges(active);

            setLoading(false);
        } catch (err) {
            setError("Failed to load dashboard data");
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchHomeData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchHomeData();
        setRefreshing(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Loading dashboard...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>
                    Welcome back, {userInfo?.name}!
                </Text>
                <View style={styles.timeBankCard}>
                    <Text style={styles.timeBankLabel}>
                        Your Time Bank Balance
                    </Text>
                    <Text style={styles.timeBankValue}>
                        {userInfo?.timeBalance || 0} hours
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("Exchanges", {
                                screen: "TimeBankScreen",
                            })
                        }
                        style={styles.viewTimeBank}
                    >
                        <Text style={styles.viewTimeBankText}>
                            View Time Bank
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={16}
                            color="#6200ee"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Active Exchanges Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Active Exchanges</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Exchanges")}
                    >
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                {activeExchanges.length > 0 ? (
                    activeExchanges.map((exchange) => (
                        <Card
                            key={exchange._id}
                            style={styles.card}
                            onPress={() =>
                                navigation.navigate("ExchangeDetail", {
                                    exchangeId: exchange._id,
                                })
                            }
                        >
                            <Card.Content>
                                <Title>{exchange.skill.title}</Title>
                                <Paragraph>
                                    {exchange.requester._id === userInfo.id
                                        ? `Requested from: ${exchange.provider.name}`
                                        : `Requested by: ${exchange.requester.name}`}
                                </Paragraph>
                                <Paragraph>Status: {exchange.status}</Paragraph>
                                <Paragraph>
                                    Date:{" "}
                                    {new Date(
                                        exchange.proposedDate
                                    ).toLocaleDateString()}
                                </Paragraph>
                            </Card.Content>
                        </Card>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No active exchanges</Text>
                )}
            </View>

            {/* Recent Skills Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Skills</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Skills")}
                    >
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                {recentSkills.length > 0 ? (
                    recentSkills.map((skill) => (
                        <Card
                            key={skill._id}
                            style={styles.card}
                            onPress={() =>
                                navigation.navigate("SkillDetail", {
                                    skillId: skill._id,
                                })
                            }
                        >
                            <Card.Content>
                                <Title>{skill.title}</Title>
                                <Paragraph>
                                    Category: {skill.category}
                                </Paragraph>
                                <Paragraph>
                                    Rate: {skill.hourlyRate} hours/hour
                                </Paragraph>
                                <Paragraph>By: {skill.user.name}</Paragraph>
                            </Card.Content>
                        </Card>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No skills available</Text>
                )}
            </View>

            {/* Upcoming Events Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Upcoming Events</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Events")}
                    >
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                        <Card
                            key={event._id}
                            style={styles.card}
                            onPress={() =>
                                navigation.navigate("EventDetail", {
                                    eventId: event._id,
                                })
                            }
                        >
                            <Card.Content>
                                <Title>{event.title}</Title>
                                <Paragraph>
                                    Date:{" "}
                                    {new Date(event.date).toLocaleDateString()}
                                </Paragraph>
                                <Paragraph>Time: {event.time}</Paragraph>
                                <Paragraph>
                                    Location: {event.location}
                                </Paragraph>
                            </Card.Content>
                        </Card>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No upcoming events</Text>
                )}
            </View>

            {/* Add Skill Button */}
            <Button
                mode="contained"
                icon="plus"
                onPress={() =>
                    navigation.navigate("Skills", { screen: "AddSkill" })
                }
                style={styles.addButton}
            >
                Add Your Skill
            </Button>
        </ScrollView>
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
    welcomeSection: {
        padding: 20,
        backgroundColor: "#6200ee",
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
        marginBottom: 15,
    },
    timeBankCard: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    timeBankLabel: {
        fontSize: 14,
        color: "#666",
    },
    timeBankValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#6200ee",
        marginVertical: 5,
    },
    viewTimeBank: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    viewTimeBankText: {
        color: "#6200ee",
        fontWeight: "500",
        marginRight: 5,
    },
    section: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    seeAllText: {
        color: "#6200ee",
        fontWeight: "500",
    },
    card: {
        marginBottom: 15,
        elevation: 2,
    },
    emptyText: {
        textAlign: "center",
        color: "#666",
        fontStyle: "italic",
        marginVertical: 20,
    },
    addButton: {
        margin: 20,
        paddingVertical: 8,
    },
});

export default HomeScreen;
