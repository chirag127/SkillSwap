import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput as RNTextInput,
    RefreshControl,
} from "react-native";
import {
    Card,
    Title,
    Paragraph,
    Chip,
    Button,
    ActivityIndicator,
    Searchbar,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

const CATEGORIES = [
    "All",
    "Education",
    "Home Improvement",
    "Technology",
    "Arts & Crafts",
    "Health & Wellness",
    "Cooking",
    "Gardening",
    "Professional Services",
    "Transportation",
    "Other",
];

const SkillsScreen = ({ navigation }) => {
    const { userToken } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [skills, setSkills] = useState([]);
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [error, setError] = useState(null);

    const fetchSkills = async () => {
        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            const response = await axios.get(`${API_URL}/api/skills`, config);
            setSkills(response.data.data);
            setFilteredSkills(response.data.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load skills");
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    useEffect(() => {
        filterSkills();
    }, [searchQuery, selectedCategory, skills]);

    const filterSkills = () => {
        let filtered = [...skills];

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (skill) =>
                    skill.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    skill.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== "All") {
            filtered = filtered.filter(
                (skill) => skill.category === selectedCategory
            );
        }

        setFilteredSkills(filtered);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSkills();
        setRefreshing(false);
    };

    const renderSkillItem = ({ item }) => (
        <Card
            style={styles.card}
            onPress={() =>
                navigation.navigate("SkillDetail", { skillId: item._id })
            }
        >
            <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph numberOfLines={2}>{item.description}</Paragraph>

                <View style={styles.skillDetails}>
                    <View style={styles.categoryContainer}>
                        <Chip style={styles.categoryChip}>{item.category}</Chip>
                    </View>

                    <View style={styles.rateContainer}>
                        <Text style={styles.rateLabel}>Rate:</Text>
                        <Text style={styles.rateValue}>
                            {item.hourlyRate} hrs/hr
                        </Text>
                    </View>
                </View>

                <View style={styles.userContainer}>
                    <Ionicons
                        name="person-circle-outline"
                        size={24}
                        color="#666"
                    />
                    <Text style={styles.userName}>{item.user.name}</Text>

                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>
                            {item.user.averageRating
                                ? item.user.averageRating.toFixed(1)
                                : "N/A"}
                        </Text>
                    </View>

                    <View style={styles.locationContainer}>
                        <Ionicons
                            name="location-outline"
                            size={16}
                            color="#666"
                        />
                        <Text style={styles.locationText}>
                            {item.user.location}
                        </Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(item)}
        >
            <Text
                style={[
                    styles.categoryButtonText,
                    selectedCategory === item &&
                        styles.selectedCategoryButtonText,
                ]}
            >
                {item}
            </Text>
        </TouchableOpacity>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Loading skills...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search skills..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>

            <View style={styles.categoriesContainer}>
                <FlatList
                    data={CATEGORIES}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Button
                        mode="contained"
                        onPress={fetchSkills}
                        style={styles.retryButton}
                    >
                        Retry
                    </Button>
                </View>
            ) : filteredSkills.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="search" size={50} color="#ccc" />
                    <Text style={styles.emptyText}>No skills found</Text>
                    <Text style={styles.emptySubtext}>
                        Try adjusting your search or category filter
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredSkills}
                    renderItem={renderSkillItem}
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

            <Button
                mode="contained"
                icon="plus"
                onPress={() => navigation.navigate("AddSkill")}
                style={styles.addButton}
            >
                Add Skill
            </Button>
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
    searchContainer: {
        padding: 10,
        backgroundColor: "white",
    },
    searchBar: {
        elevation: 0,
        backgroundColor: "#f0f0f0",
    },
    categoriesContainer: {
        backgroundColor: "white",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    categoryButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
    },
    selectedCategoryButton: {
        backgroundColor: "#6200ee",
    },
    categoryButtonText: {
        color: "#666",
    },
    selectedCategoryButtonText: {
        color: "white",
    },
    listContainer: {
        padding: 10,
    },
    card: {
        marginBottom: 10,
        elevation: 2,
    },
    skillDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },
    categoryContainer: {
        flex: 1,
    },
    categoryChip: {
        alignSelf: "flex-start",
    },
    rateContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rateLabel: {
        color: "#666",
        marginRight: 5,
    },
    rateValue: {
        fontWeight: "bold",
        color: "#6200ee",
    },
    userContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    userName: {
        marginLeft: 5,
        fontWeight: "500",
        flex: 1,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },
    ratingText: {
        marginLeft: 3,
        color: "#666",
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },
    locationText: {
        marginLeft: 3,
        color: "#666",
        fontSize: 12,
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
        textAlign: "center",
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        borderRadius: 30,
    },
});

export default SkillsScreen;
