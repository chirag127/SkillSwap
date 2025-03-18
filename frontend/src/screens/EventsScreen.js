import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl,
} from "react-native";
import {
    Button,
    Card,
    Title,
    Paragraph,
    ActivityIndicator,
    Chip,
    FAB,
    Searchbar,
    Divider,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

const EventsScreen = ({ navigation }) => {
    const { userToken, userInfo } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const CATEGORIES = [
        "All",
        "Workshop",
        "Meetup",
        "Skill Share",
        "Community Service",
        "Social",
        "Other",
    ];

    const fetchEvents = async () => {
        if (refreshing) return;

        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            // Add upcoming=true to only show future events
            const response = await axios.get(
                `${API_URL}/api/events?upcoming=true`,
                config
            );
            setEvents(response.data.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load events");
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchEvents();

        // Set up a listener for when the screen comes into focus
        const unsubscribe = navigation.addListener("focus", () => {
            fetchEvents();
        });

        // Clean up the listener when the component is unmounted
        return unsubscribe;
    }, [navigation]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Loading events...</Text>
            </View>
        );
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchEvents();
        setRefreshing(false);
    };

    const getFilteredEvents = () => {
        let filtered = [...events];

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (event) =>
                    event.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    event.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (activeCategory !== "All") {
            filtered = filtered.filter(
                (event) => event.category === activeCategory
            );
        }

        return filtered;
    };

    const renderEventItem = ({ item }) => {
        const eventDate = new Date(item.date);
        const today = new Date();
        const isToday = eventDate.toDateString() === today.toDateString();
        const isTomorrow =
            new Date(today.setDate(today.getDate() + 1)).toDateString() ===
            eventDate.toDateString();

        let dateLabel = eventDate.toLocaleDateString();
        if (isToday) dateLabel = "Today";
        if (isTomorrow) dateLabel = "Tomorrow";

        return (
            <Card
                style={styles.card}
                onPress={() =>
                    navigation.navigate("EventDetail", { eventId: item._id })
                }
            >
                <Card.Content>
                    <Title style={styles.cardTitle}>{item.title}</Title>

                    <View style={styles.eventDetails}>
                        <View style={styles.eventInfo}>
                            <View style={styles.eventDetail}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={16}
                                    color="#666"
                                />
                                <Text style={styles.eventDetailText}>
                                    {dateLabel}
                                </Text>
                            </View>

                            <View style={styles.eventDetail}>
                                <Ionicons
                                    name="time-outline"
                                    size={16}
                                    color="#666"
                                />
                                <Text style={styles.eventDetailText}>
                                    {item.time}
                                </Text>
                            </View>

                            <View style={styles.eventDetail}>
                                <Ionicons
                                    name="location-outline"
                                    size={16}
                                    color="#666"
                                />
                                <Text style={styles.eventDetailText}>
                                    {item.location}
                                </Text>
                            </View>
                        </View>

                        <Chip style={styles.categoryChip}>{item.category}</Chip>
                    </View>

                    <Paragraph numberOfLines={2} style={styles.description}>
                        {item.description}
                    </Paragraph>

                    <View style={styles.attendeesContainer}>
                        <Text style={styles.attendeesText}>
                            {item.attendees.length}{" "}
                            {item.attendees.length === 1 ? "person" : "people"}{" "}
                            attending
                        </Text>

                        {/* Check if user is attending */}
                        {item.attendees.some(
                            (attendee) => attendee._id === userInfo.id
                        ) ? (
                            <Chip
                                style={styles.attendingChip}
                                textStyle={styles.attendingChipText}
                                icon="check"
                            >
                                Attending
                            </Chip>
                        ) : null}
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <Searchbar
                placeholder="Search events"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />

            {/* Category Filter */}
            <FlatList
                data={CATEGORIES}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                style={styles.categoriesContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.categoryButton,
                            activeCategory === item &&
                                styles.activeCategoryButton,
                        ]}
                        onPress={() => setActiveCategory(item)}
                    >
                        <Text
                            style={[
                                styles.categoryButtonText,
                                activeCategory === item &&
                                    styles.activeCategoryButtonText,
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Button
                        mode="contained"
                        onPress={fetchEvents}
                        style={styles.retryButton}
                    >
                        Retry
                    </Button>
                </View>
            ) : getFilteredEvents().length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        No community events found
                    </Text>
                    <Text style={styles.emptySubtext}>
                        {searchQuery || activeCategory !== "All"
                            ? "Try adjusting your search or category filter"
                            : "Be the first to create a community event!"}
                    </Text>
                    {!searchQuery && activeCategory === "All" && (
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate("AddEvent")}
                            style={styles.createButton}
                        >
                            Create Event
                        </Button>
                    )}
                </View>
            ) : (
                <FlatList
                    data={getFilteredEvents()}
                    renderItem={renderEventItem}
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

            {/* FAB for creating new event */}
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate("AddEvent")}
            />
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
    searchBar: {
        margin: 10,
        elevation: 2,
    },
    categoriesContainer: {
        backgroundColor: "white",
        paddingVertical: 10,
        marginBottom: 5,
    },
    categoryButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
    },
    activeCategoryButton: {
        backgroundColor: "#6200ee",
    },
    categoryButtonText: {
        color: "#666",
    },
    activeCategoryButtonText: {
        color: "white",
    },
    listContainer: {
        padding: 10,
    },
    card: {
        marginBottom: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    eventDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    eventInfo: {
        flex: 1,
    },
    eventDetail: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    eventDetailText: {
        marginLeft: 5,
        color: "#666",
        fontSize: 14,
    },
    categoryChip: {
        backgroundColor: "#E8DEF8",
    },
    description: {
        color: "#666",
        marginBottom: 10,
    },
    attendeesContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5,
    },
    attendeesText: {
        fontSize: 12,
        color: "#666",
    },
    attendingChip: {
        backgroundColor: "#C8E6C9",
        height: 24,
    },
    attendingChipText: {
        fontSize: 10,
        color: "#4CAF50",
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
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#6200ee",
    },
});

export default EventsScreen;
