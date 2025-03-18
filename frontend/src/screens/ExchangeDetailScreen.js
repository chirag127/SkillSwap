import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Image } from "react-native";
import {
    Button,
    Card,
    Title,
    Paragraph,
    Chip,
    ActivityIndicator,
    Dialog,
    Portal,
    TextInput,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

const ExchangeDetailScreen = ({ route, navigation }) => {
    const { exchangeId } = route.params;
    const { userToken, userInfo } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [exchange, setExchange] = useState(null);
    const [error, setError] = useState(null);

    // Response dialog state
    const [showResponseDialog, setShowResponseDialog] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [responseLoading, setResponseLoading] = useState(false);

    const fetchExchangeDetails = async () => {
        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            const response = await axios.get(
                `${API_URL}/api/exchanges/${exchangeId}`,
                config
            );
            setExchange(response.data.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load exchange details");
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchExchangeDetails();
    }, [exchangeId]);

    const handleStatusUpdate = async (newStatus) => {
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
            };

            const data = {
                status: newStatus,
            };

            // If accepting/declining with a message
            if (
                responseMessage &&
                (newStatus === "accepted" || newStatus === "declined")
            ) {
                data.responseMessage = responseMessage;
            }

            const response = await axios.put(
                `${API_URL}/api/exchanges/${exchangeId}`,
                data,
                config
            );

            setExchange(response.data.data);
            setShowResponseDialog(false);
            setResponseMessage("");
            setLoading(false);

            let successMessage = "";
            switch (newStatus) {
                case "accepted":
                    successMessage = "Exchange request accepted successfully!";
                    break;
                case "declined":
                    successMessage = "Exchange request declined.";
                    break;
                case "completed":
                    successMessage =
                        "Exchange marked as completed. Time credits have been transferred.";
                    break;
                case "cancelled":
                    successMessage = "Exchange cancelled successfully.";
                    break;
                default:
                    successMessage = "Exchange status updated successfully.";
            }

            Alert.alert("Success", successMessage);
        } catch (err) {
            setLoading(false);
            console.error("Error updating exchange status:", err);
            Alert.alert(
                "Error",
                "Failed to update exchange status. Please try again."
            );
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>
                    Loading exchange details...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Button mode="contained" onPress={fetchExchangeDetails}>
                    Retry
                </Button>
            </View>
        );
    }

    if (!exchange) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Exchange not found</Text>
                <Button mode="contained" onPress={() => navigation.goBack()}>
                    Go Back
                </Button>
            </View>
        );
    }

    const isRequester = exchange.requester._id === userInfo.id;
    const isProvider = exchange.provider._id === userInfo.id;
    const otherUser = isRequester ? exchange.provider : exchange.requester;

    // Determine which actions are available based on exchange status and user role
    const canAccept = isProvider && exchange.status === "pending";
    const canDecline = isProvider && exchange.status === "pending";
    const canCancel =
        (isRequester && exchange.status === "pending") ||
        ((isRequester || isProvider) && exchange.status === "accepted");
    const canComplete = isProvider && exchange.status === "accepted";

    return (
        <ScrollView style={styles.container}>
            <View style={styles.contentContainer}>
                {/* Status Badge */}
                <View style={styles.statusContainer}>
                    <Chip
                        style={[
                            styles.statusChip,
                            getStatusStyle(exchange.status),
                        ]}
                        textStyle={styles.statusText}
                    >
                        {exchange.status.toUpperCase()}
                    </Chip>
                </View>

                {/* Skill Details */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.cardTitle}>
                            {exchange.skill.title}
                        </Title>
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
                                <View style={styles.ratingContainer}>
                                    <Ionicons
                                        name="star"
                                        size={16}
                                        color="#FFD700"
                                    />
                                    <Text style={styles.ratingText}>
                                        {otherUser.averageRating
                                            ? otherUser.averageRating.toFixed(1)
                                            : "No ratings yet"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                {/* Exchange Details */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>
                            Exchange Details
                        </Title>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Date:</Text>
                            <Text style={styles.detailValue}>
                                {new Date(
                                    exchange.proposedDate
                                ).toLocaleDateString()}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Duration:</Text>
                            <Text style={styles.detailValue}>
                                {exchange.duration} hours
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>
                                Time Credits:
                            </Text>
                            <Text style={styles.detailValue}>
                                {exchange.timeCredits} credits
                            </Text>
                        </View>

                        {exchange.completedAt && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>
                                    Completed On:
                                </Text>
                                <Text style={styles.detailValue}>
                                    {new Date(
                                        exchange.completedAt
                                    ).toLocaleDateString()}
                                </Text>
                            </View>
                        )}
                    </Card.Content>
                </Card>

                {/* Messages */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>Messages</Title>

                        <View style={styles.messageContainer}>
                            <Text style={styles.messageLabel}>
                                Request Message:
                            </Text>
                            <Text style={styles.messageText}>
                                {exchange.requestMessage}
                            </Text>
                        </View>

                        {exchange.responseMessage && (
                            <View style={styles.messageContainer}>
                                <Text style={styles.messageLabel}>
                                    Response Message:
                                </Text>
                                <Text style={styles.messageText}>
                                    {exchange.responseMessage}
                                </Text>
                            </View>
                        )}
                    </Card.Content>
                </Card>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    {canAccept && (
                        <Button
                            mode="contained"
                            icon="check"
                            onPress={() => setShowResponseDialog(true)}
                            style={[styles.actionButton, styles.acceptButton]}
                        >
                            Accept
                        </Button>
                    )}

                    {canDecline && (
                        <Button
                            mode="outlined"
                            icon="close"
                            onPress={() => setShowResponseDialog(true)}
                            style={[styles.actionButton, styles.declineButton]}
                            color="#FF5252"
                        >
                            Decline
                        </Button>
                    )}

                    {canCancel && (
                        <Button
                            mode="outlined"
                            icon="cancel"
                            onPress={() => {
                                Alert.alert(
                                    "Cancel Exchange",
                                    "Are you sure you want to cancel this exchange?",
                                    [
                                        { text: "No", style: "cancel" },
                                        {
                                            text: "Yes",
                                            onPress: () =>
                                                handleStatusUpdate("cancelled"),
                                        },
                                    ]
                                );
                            }}
                            style={styles.actionButton}
                            color="#FF9800"
                        >
                            Cancel
                        </Button>
                    )}

                    {canComplete && (
                        <Button
                            mode="contained"
                            icon="check-circle"
                            onPress={() => {
                                Alert.alert(
                                    "Complete Exchange",
                                    "Are you sure you want to mark this exchange as completed? This will transfer time credits to your account.",
                                    [
                                        { text: "No", style: "cancel" },
                                        {
                                            text: "Yes",
                                            onPress: () =>
                                                handleStatusUpdate("completed"),
                                        },
                                    ]
                                );
                            }}
                            style={[styles.actionButton, styles.completeButton]}
                        >
                            Mark Completed
                        </Button>
                    )}
                </View>
            </View>

            {/* Response Dialog */}
            <Portal>
                <Dialog
                    visible={showResponseDialog}
                    onDismiss={() => setShowResponseDialog(false)}
                >
                    <Dialog.Title>
                        {canAccept
                            ? "Accept Exchange Request"
                            : "Decline Exchange Request"}
                    </Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Message (optional)"
                            value={responseMessage}
                            onChangeText={setResponseMessage}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={styles.dialogInput}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowResponseDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onPress={() =>
                                handleStatusUpdate(
                                    canAccept ? "accepted" : "declined"
                                )
                            }
                            loading={responseLoading}
                            disabled={responseLoading}
                        >
                            {canAccept ? "Accept" : "Decline"}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ScrollView>
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
