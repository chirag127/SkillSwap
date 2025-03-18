import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert } from "react-native";
import {
    Button,
    Card,
    Title,
    Paragraph,
    Chip,
    ActivityIndicator,
    Divider,
    Avatar,
    List,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

const EventDetailScreen = ({ route, navigation }) => {
    const { eventId } = route.params;
    const { userToken, userInfo } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const [attendanceLoading, setAttendanceLoading] = useState(false);

    const fetchEventDetails = async () => {
        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            const response = await axios.get(
                `${API_URL}/api/events/${eventId}`,
                config
            );
            setEvent(response.data.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load event details");
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchEventDetails();
    }, [eventId]);

    const handleAttendEvent = async () => {
        try {
            setAttendanceLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            await axios.post(
                `${API_URL}/api/events/${eventId}/attend`,
                {},
                config
            );

            // Refresh event details to update attendees list
            await fetchEventDetails();
            setAttendanceLoading(false);

            Alert.alert("Success", "You are now attending this event!");
        } catch (err) {
            setAttendanceLoading(false);
            console.error("Error attending event:", err);
            Alert.alert("Error", "Failed to attend event. Please try again.");
        }
    };

    const handleCancelAttendance = async () => {
        try {
            setAttendanceLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            await axios.delete(
                `${API_URL}/api/events/${eventId}/cancel`,
                config
            );

            // Refresh event details to update attendees list
            await fetchEventDetails();
            setAttendanceLoading(false);

            Alert.alert("Success", "You have cancelled your attendance.");
        } catch (err) {
            setAttendanceLoading(false);
            console.error("Error cancelling attendance:", err);
            Alert.alert(
                "Error",
                "Failed to cancel attendance. Please try again."
            );
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Loading event details...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Button mode="contained" onPress={fetchEventDetails}>
                    Retry
                </Button>
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Event not found</Text>
                <Button mode="contained" onPress={() => navigation.goBack()}>
                    Go Back
                </Button>
            </View>
        );
    }

    const eventDate = new Date(event.date);
    const isUserAttending = event.attendees.some(
        (attendee) => attendee._id === userInfo.id
    );
    const isUserOrganizer = event.organizer._id === userInfo.id;

    return (
        <ScrollView style={styles.container}>
            {/* Event Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={require("../../assets/default-event.jpg")}
                    style={styles.eventImage}
                    resizeMode="cover"
                />
                <View style={styles.categoryBadge}>
                    <Chip style={styles.categoryChip}>{event.category}</Chip>
                </View>
            </View>

            <View style={styles.contentContainer}>
                {/* Event Title and Date */}
                <Text style={styles.title}>{event.title}</Text>

                <View style={styles.dateTimeContainer}>
                    <View style={styles.dateContainer}>
                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="#6200ee"
                        />
                        <Text style={styles.dateText}>
                            {eventDate.toLocaleDateString(undefined, {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </Text>
                    </View>

                    <View style={styles.timeContainer}>
                        <Ionicons
                            name="time-outline"
                            size={20}
                            color="#6200ee"
                        />
                        <Text style={styles.timeText}>{event.time}</Text>
                    </View>
                </View>

                {/* Location */}
                <View style={styles.locationContainer}>
                    <Ionicons
                        name="location-outline"
                        size={20}
                        color="#6200ee"
                    />
                    <Text style={styles.locationText}>{event.location}</Text>
                </View>

                <Divider style={styles.divider} />

                {/* Description */}
                <Text style={styles.sectionTitle}>About This Event</Text>
                <Text style={styles.description}>{event.description}</Text>

                <Divider style={styles.divider} />

                {/* Organizer */}
                <Text style={styles.sectionTitle}>Organizer</Text>
                <View style={styles.organizerContainer}>
                    <Image
                        source={require("../../assets/default-profile.jpg")}
                        style={styles.organizerImage}
                    />
                    <View style={styles.organizerInfo}>
                        <Text style={styles.organizerName}>
                            {event.organizer.name}
                        </Text>
                        <Text style={styles.organizerEmail}>
                            {event.organizer.email}
                        </Text>
                    </View>
                </View>

                <Divider style={styles.divider} />

                {/* Attendees */}
                <View style={styles.attendeesHeader}>
                    <Text style={styles.sectionTitle}>Attendees</Text>
                    <Chip mode="outlined">
                        {event.attendees.length} attending
                    </Chip>
                </View>

                {event.attendees.length > 0 ? (
                    <View style={styles.attendeesList}>
                        {event.attendees.slice(0, 5).map((attendee) => (
                            <View
                                key={attendee._id}
                                style={styles.attendeeItem}
                            >
                                <Image
                                    source={require("../../assets/default-profile.jpg")}
                                    style={styles.attendeeImage}
                                />
                                <Text style={styles.attendeeName}>
                                    {attendee.name}
                                </Text>
                            </View>
                        ))}

                        {event.attendees.length > 5 && (
                            <Text style={styles.moreAttendeesText}>
                                +{event.attendees.length - 5} more
                            </Text>
                        )}
                    </View>
                ) : (
                    <Text style={styles.noAttendeesText}>
                        No one is attending yet. Be the first!
                    </Text>
                )}

                {/* Attendance Buttons */}
                {!isUserOrganizer && (
                    <View style={styles.actionButtonsContainer}>
                        {isUserAttending ? (
                            <Button
                                mode="outlined"
                                icon="close"
                                onPress={handleCancelAttendance}
                                style={styles.cancelButton}
                                loading={attendanceLoading}
                                disabled={attendanceLoading}
                                color="#FF5252"
                            >
                                Cancel Attendance
                            </Button>
                        ) : (
                            <Button
                                mode="contained"
                                icon="check"
                                onPress={handleAttendEvent}
                                style={styles.attendButton}
                                loading={attendanceLoading}
                                disabled={attendanceLoading}
                            >
                                Attend Event
                            </Button>
                        )}
                    </View>
                )}
            </View>
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
        padding: 20,
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
        position: "relative",
    },
    eventImage: {
        width: "100%",
        height: "100%",
    },
    categoryBadge: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    categoryChip: {
        backgroundColor: "#E8DEF8",
    },
    contentContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
    },
    dateTimeContainer: {
        marginBottom: 10,
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    dateText: {
        marginLeft: 10,
        fontSize: 16,
        color: "#333",
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    timeText: {
        marginLeft: 10,
        fontSize: 16,
        color: "#333",
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    locationText: {
        marginLeft: 10,
        fontSize: 16,
        color: "#333",
    },
    divider: {
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: "#666",
    },
    organizerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    organizerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    organizerInfo: {
        flex: 1,
    },
    organizerName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    organizerEmail: {
        fontSize: 14,
        color: "#666",
    },
    attendeesHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    attendeesList: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 20,
    },
    attendeeItem: {
        alignItems: "center",
        marginRight: 15,
        marginBottom: 10,
        width: 60,
    },
    attendeeImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginBottom: 5,
    },
    attendeeName: {
        fontSize: 12,
        textAlign: "center",
    },
    moreAttendeesText: {
        fontSize: 14,
        color: "#6200ee",
        alignSelf: "center",
        marginLeft: 10,
    },
    noAttendeesText: {
        fontSize: 14,
        color: "#666",
        fontStyle: "italic",
        marginBottom: 20,
    },
    actionButtonsContainer: {
        marginTop: 10,
        marginBottom: 30,
    },
    attendButton: {
        paddingVertical: 8,
    },
    cancelButton: {
        paddingVertical: 8,
        borderColor: "#FF5252",
    },
});

export default EventDetailScreen;
