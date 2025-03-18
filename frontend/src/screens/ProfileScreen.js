import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
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
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

const ProfileScreen = ({ navigation }) => {
    const { userToken, userInfo, updateProfile, logout } =
        useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [userSkills, setUserSkills] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            // Fetch user skills
            const skillsResponse = await axios.get(
                `${API_URL}/api/skills/user/${userInfo.id}`,
                config
            );
            setUserSkills(skillsResponse.data.data);

            // Fetch user reviews
            const reviewsResponse = await axios.get(
                `${API_URL}/api/reviews/user/${userInfo.id}`,
                config
            );
            setUserReviews(reviewsResponse.data.data);

            setLoading(false);
        } catch (err) {
            setError("Failed to load profile data");
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserData();
        setRefreshing(false);
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                // In a real app, you would upload the image to your server here
                // For this demo, we'll just update the profile with a placeholder
                const updateResult = await updateProfile({
                    profileImage: "updated-profile.jpg",
                });

                if (updateResult.success) {
                    // Profile updated successfully
                }
            }
        } catch (err) {
            console.error("Error picking image:", err);
        }
    };

    const handleEditProfile = () => {
        // Navigate to edit profile screen
        navigation.navigate("EditProfile");
    };

    const handleLogout = () => {
        logout();
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Loading profile...</Text>
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
            {/* Profile Header */}
            <View style={styles.profileHeader}>
                <TouchableOpacity
                    onPress={pickImage}
                    style={styles.profileImageContainer}
                >
                    <Image
                        source={require("../../assets/default-profile.jpg")}
                        style={styles.profileImage}
                    />
                    <View style={styles.editImageButton}>
                        <Ionicons name="camera" size={18} color="white" />
                    </View>
                </TouchableOpacity>

                <Text style={styles.userName}>{userInfo?.name}</Text>

                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={18} color="#FFD700" />
                    <Text style={styles.ratingText}>
                        {userInfo?.averageRating
                            ? userInfo.averageRating.toFixed(1)
                            : "No ratings yet"}
                    </Text>
                </View>

                <Text style={styles.location}>
                    <Ionicons name="location" size={16} color="#666" />{" "}
                    {userInfo?.location}
                </Text>

                <View style={styles.badgesContainer}>
                    {userInfo?.badges &&
                        userInfo.badges.map((badge, index) => (
                            <Chip
                                key={index}
                                style={styles.badge}
                                textStyle={styles.badgeText}
                            >
                                {badge}
                            </Chip>
                        ))}
                </View>

                <Button
                    mode="outlined"
                    icon="account-edit"
                    onPress={handleEditProfile}
                    style={styles.editButton}
                >
                    Edit Profile
                </Button>
            </View>

            {/* Time Bank Section */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Time Bank Balance</Title>
                    <View style={styles.timeBankContainer}>
                        <Text style={styles.timeBankValue}>
                            {userInfo?.timeBalance || 0}
                        </Text>
                        <Text style={styles.timeBankUnit}>hours</Text>
                    </View>
                    <Paragraph style={styles.timeBankDescription}>
                        Use your time credits to request services from other
                        members.
                    </Paragraph>
                </Card.Content>
            </Card>

            {/* My Skills Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>My Skills</Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("Skills", {
                                screen: "AddSkill",
                            })
                        }
                    >
                        <Text style={styles.addText}>+ Add New</Text>
                    </TouchableOpacity>
                </View>

                {userSkills.length > 0 ? (
                    userSkills.map((skill) => (
                        <Card
                            key={skill._id}
                            style={styles.skillCard}
                            onPress={() =>
                                navigation.navigate("Skills", {
                                    screen: "SkillDetail",
                                    params: { skillId: skill._id },
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
                            </Card.Content>
                        </Card>
                    ))
                ) : (
                    <Text style={styles.emptyText}>
                        You haven't added any skills yet
                    </Text>
                )}
            </View>

            {/* Reviews Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reviews</Text>

                {userReviews.length > 0 ? (
                    userReviews.map((review) => (
                        <Card key={review._id} style={styles.reviewCard}>
                            <Card.Content>
                                <View style={styles.reviewHeader}>
                                    <Image
                                        source={require("../../assets/default-profile.jpg")}
                                        style={styles.reviewerImage}
                                    />
                                    <View style={styles.reviewerInfo}>
                                        <Text style={styles.reviewerName}>
                                            {review.reviewer.name}
                                        </Text>
                                        <View style={styles.reviewRating}>
                                            {[...Array(5)].map((_, i) => (
                                                <Ionicons
                                                    key={i}
                                                    name={
                                                        i < review.rating
                                                            ? "star"
                                                            : "star-outline"
                                                    }
                                                    size={16}
                                                    color="#FFD700"
                                                />
                                            ))}
                                        </View>
                                    </View>
                                </View>
                                <Paragraph style={styles.reviewComment}>
                                    {review.comment}
                                </Paragraph>
                                <View style={styles.reviewBadges}>
                                    {review.badges &&
                                        review.badges.map((badge, index) => (
                                            <Chip
                                                key={index}
                                                style={styles.reviewBadge}
                                                textStyle={
                                                    styles.reviewBadgeText
                                                }
                                            >
                                                {badge}
                                            </Chip>
                                        ))}
                                </View>
                            </Card.Content>
                        </Card>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No reviews yet</Text>
                )}
            </View>

            {/* Logout Button */}
            <Button
                mode="outlined"
                icon="logout"
                onPress={handleLogout}
                style={styles.logoutButton}
                color="#FF5252"
            >
                Logout
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
    profileHeader: {
        backgroundColor: "white",
        padding: 20,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    profileImageContainer: {
        position: "relative",
        marginBottom: 15,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editImageButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#6200ee",
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "white",
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    ratingText: {
        marginLeft: 5,
        fontSize: 16,
        color: "#333",
    },
    location: {
        fontSize: 14,
        color: "#666",
        marginBottom: 15,
    },
    badgesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: 15,
    },
    badge: {
        margin: 3,
        backgroundColor: "#E8DEF8",
    },
    badgeText: {
        color: "#6200ee",
    },
    editButton: {
        marginTop: 10,
    },
    card: {
        margin: 15,
        elevation: 2,
    },
    timeBankContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        marginVertical: 10,
    },
    timeBankValue: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#6200ee",
    },
    timeBankUnit: {
        fontSize: 18,
        color: "#666",
        marginLeft: 5,
    },
    timeBankDescription: {
        color: "#666",
    },
    section: {
        padding: 15,
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
        marginBottom: 15,
    },
    addText: {
        color: "#6200ee",
        fontWeight: "500",
    },
    skillCard: {
        marginBottom: 10,
        elevation: 2,
    },
    emptyText: {
        textAlign: "center",
        color: "#666",
        fontStyle: "italic",
        marginVertical: 20,
    },
    reviewCard: {
        marginBottom: 10,
        elevation: 2,
    },
    reviewHeader: {
        flexDirection: "row",
        marginBottom: 10,
    },
    reviewerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    reviewerInfo: {
        flex: 1,
    },
    reviewerName: {
        fontWeight: "bold",
        marginBottom: 3,
    },
    reviewRating: {
        flexDirection: "row",
    },
    reviewComment: {
        marginBottom: 10,
    },
    reviewBadges: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    reviewBadge: {
        margin: 2,
        backgroundColor: "#E8DEF8",
    },
    reviewBadgeText: {
        color: "#6200ee",
        fontSize: 12,
    },
    logoutButton: {
        margin: 20,
        borderColor: "#FF5252",
    },
});

export default ProfileScreen;
