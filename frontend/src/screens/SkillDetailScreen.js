import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert } from "react-native";
import {
    Button,
    Card,
    Title,
    Paragraph,
    ActivityIndicator,
    Chip,
    Dialog,
    Portal,
    TextInput,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

const SkillDetailScreen = ({ route, navigation }) => {
    const { skillId } = route.params;
    const { userToken, userInfo } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [skill, setSkill] = useState(null);
    const [error, setError] = useState(null);

    // Exchange request state
    const [showRequestDialog, setShowRequestDialog] = useState(false);
    const [requestMessage, setRequestMessage] = useState("");
    const [proposedDate, setProposedDate] = useState("");
    const [duration, setDuration] = useState("1");
    const [requestLoading, setRequestLoading] = useState(false);

    const fetchSkillDetails = async () => {
        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            const response = await axios.get(
                `${API_URL}/api/skills/${skillId}`,
                config
            );
            setSkill(response.data.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load skill details");
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSkillDetails();
    }, [skillId]);

    const handleRequestExchange = async () => {
        setRequestLoading(true);
        try {
            // Validate inputs
            if (!requestMessage.trim()) {
                Alert.alert(
                    "Error",
                    "Please provide a message to the skill provider"
                );
                setRequestLoading(false);
                return;
            }

            if (!proposedDate.trim()) {
                Alert.alert("Error", "Please provide a proposed date");
                setRequestLoading(false);
                return;
            }

            // Validate duration
            if (
                !duration.trim() ||
                isNaN(duration) ||
                parseFloat(duration) < 0.5
            ) {
                Alert.alert("Error", "Duration must be at least 0.5 hours");
                setRequestLoading(false);
                return;
            }

            // Check if user has enough time credits
            const totalCost = parseFloat(duration) * skill.hourlyRate;
            if (userInfo.timeBalance < totalCost) {
                Alert.alert(
                    "Insufficient Time Credits",
                    `This exchange requires ${totalCost} time credits, but you only have ${userInfo.timeBalance}. Earn more credits by providing services to others.`
                );
                setRequestLoading(false);
                return;
            }

            // Format date for API
            let formattedDate;
            try {
                // Simple date validation and formatting
                const dateParts = proposedDate.split("/");
                if (dateParts.length !== 3)
                    throw new Error("Invalid date format");

                const month = parseInt(dateParts[0]);
                const day = parseInt(dateParts[1]);
                const year = parseInt(dateParts[2]);

                if (isNaN(month) || isNaN(day) || isNaN(year))
                    throw new Error("Invalid date");
                if (month < 1 || month > 12) throw new Error("Invalid month");
                if (day < 1 || day > 31) throw new Error("Invalid day");
                if (year < 2023) throw new Error("Date must be in the future");

                formattedDate = new Date(year, month - 1, day).toISOString();
            } catch (dateError) {
                Alert.alert(
                    "Error",
                    "Please enter a valid date in MM/DD/YYYY format"
                );
                setRequestLoading(false);
                return;
            }

            // Create exchange request
            const exchangeData = {
                skill: skillId,
                requestMessage: requestMessage,
                proposedDate: formattedDate,
                duration: parseFloat(duration),
                // The API will calculate timeCredits based on skill hourly rate and duration
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
            };

            try {
                const response = await axios.post(
                    `${API_URL}/api/exchanges`,
                    exchangeData,
                    config
                );

                setRequestLoading(false);
                setShowRequestDialog(false);

                Alert.alert(
                    "Success",
                    "Your exchange request has been sent! You can view it in the Exchanges tab.",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate("Exchanges"),
                        },
                    ]
                );
            } catch (apiError) {
                console.error(
                    "API Error:",
                    apiError.response?.data || apiError.message
                );
                const errorMessage =
                    apiError.response?.data?.message ||
                    "Failed to send exchange request. Please try again.";
                Alert.alert("Error", errorMessage);
                setRequestLoading(false);
            }
        } catch (err) {
            setRequestLoading(false);
            Alert.alert(
                "Error",
                "Failed to send exchange request. Please try again."
            );
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Loading skill details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Button mode="contained" onPress={fetchSkillDetails}>
                    Retry
                </Button>
            </View>
        );
    }

    if (!skill) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Skill not found</Text>
                <Button mode="contained" onPress={() => navigation.goBack()}>
                    Go Back
                </Button>
            </View>
        );
    }

    const isOwnSkill = skill.user._id === userInfo.id;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require("../../assets/default-skill.jpg")}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.title}>{skill.title}</Text>

                <View style={styles.categoryRow}>
                    <Chip style={styles.categoryChip}>{skill.category}</Chip>
                    <View style={styles.rateContainer}>
                        <Text style={styles.rateLabel}>Rate:</Text>
                        <Text style={styles.rateValue}>
                            {skill.hourlyRate} hrs/hr
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{skill.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Availability</Text>
                    <Text style={styles.availability}>
                        {skill.availability}
                    </Text>
                </View>

                <Card style={styles.providerCard}>
                    <Card.Content>
                        <Text style={styles.providerTitle}>Skill Provider</Text>

                        <View style={styles.providerInfo}>
                            <Image
                                source={require("../../assets/default-profile.jpg")}
                                style={styles.providerImage}
                            />

                            <View style={styles.providerDetails}>
                                <Text style={styles.providerName}>
                                    {skill.user.name}
                                </Text>

                                <View style={styles.ratingContainer}>
                                    <Ionicons
                                        name="star"
                                        size={16}
                                        color="#FFD700"
                                    />
                                    <Text style={styles.ratingText}>
                                        {skill.user.averageRating
                                            ? skill.user.averageRating.toFixed(
                                                  1
                                              )
                                            : "No ratings yet"}
                                    </Text>
                                </View>

                                <View style={styles.locationContainer}>
                                    <Ionicons
                                        name="location-outline"
                                        size={14}
                                        color="#666"
                                    />
                                    <Text style={styles.locationText}>
                                        {skill.user.location}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {skill.user.bio && (
                            <Text style={styles.providerBio}>
                                {skill.user.bio}
                            </Text>
                        )}
                    </Card.Content>
                </Card>

                {!isOwnSkill ? (
                    <Button
                        mode="contained"
                        icon="swap-horizontal"
                        onPress={() => setShowRequestDialog(true)}
                        style={styles.requestButton}
                    >
                        Request Exchange
                    </Button>
                ) : (
                    <View style={styles.actionButtonsContainer}>
                        <Button
                            mode="contained"
                            icon="pencil"
                            onPress={() =>
                                Alert.alert(
                                    "Coming Soon",
                                    "Edit functionality will be available in the next update."
                                )
                            }
                            style={[styles.actionButton, styles.editButton]}
                        >
                            Edit
                        </Button>
                        <Button
                            mode="outlined"
                            icon="delete"
                            onPress={() =>
                                Alert.alert(
                                    "Coming Soon",
                                    "Delete functionality will be available in the next update."
                                )
                            }
                            style={[styles.actionButton, styles.deleteButton]}
                            color="#FF5252"
                        >
                            Delete
                        </Button>
                    </View>
                )}
            </View>

            <Portal>
                <Dialog
                    visible={showRequestDialog}
                    onDismiss={() => setShowRequestDialog(false)}
                >
                    <Dialog.Title>Request Exchange</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Message to Provider"
                            value={requestMessage}
                            onChangeText={setRequestMessage}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={styles.dialogInput}
                        />
                        <TextInput
                            label="Proposed Date (MM/DD/YYYY)"
                            value={proposedDate}
                            onChangeText={setProposedDate}
                            mode="outlined"
                            style={styles.dialogInput}
                        />
                        <TextInput
                            label="Duration (hours)"
                            value={duration}
                            onChangeText={setDuration}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.dialogInput}
                        />
                        <Text style={styles.totalCost}>
                            Total Cost:{" "}
                            {parseFloat(duration || 0) * skill.hourlyRate} time
                            credits
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowRequestDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onPress={handleRequestExchange}
                            loading={requestLoading}
                            disabled={requestLoading}
                        >
                            Request
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
    imageContainer: {
        height: 200,
        width: "100%",
        backgroundColor: "#ddd",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    contentContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    categoryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    categoryChip: {
        backgroundColor: "#E8DEF8",
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
        fontSize: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        color: "#333",
        lineHeight: 24,
    },
    availability: {
        fontSize: 16,
        color: "#333",
    },
    providerCard: {
        marginBottom: 20,
    },
    providerTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#666",
        marginBottom: 10,
    },
    providerInfo: {
        flexDirection: "row",
        marginBottom: 10,
    },
    providerImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    providerDetails: {
        flex: 1,
        justifyContent: "center",
    },
    providerName: {
        fontSize: 18,
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
        color: "#666",
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    locationText: {
        marginLeft: 5,
        color: "#666",
    },
    providerBio: {
        fontSize: 14,
        color: "#666",
        marginTop: 10,
    },
    requestButton: {
        paddingVertical: 8,
    },
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    actionButton: {
        flex: 1,
        paddingVertical: 8,
    },
    editButton: {
        marginRight: 10,
    },
    deleteButton: {
        borderColor: "#FF5252",
    },
    dialogInput: {
        marginBottom: 15,
    },
    totalCost: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#6200ee",
        marginTop: 5,
    },
});

export default SkillDetailScreen;
