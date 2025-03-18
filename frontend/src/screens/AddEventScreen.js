import React, { useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
    Image,
} from "react-native";
import {
    TextInput,
    Button,
    HelperText,
    Menu,
    Chip,
    ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

const CATEGORIES = [
    "Workshop",
    "Meetup",
    "Skill Share",
    "Community Service",
    "Social",
    "Other",
];

const AddEventScreen = ({ navigation }) => {
    const { userToken } = useContext(AuthContext);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);

    // UI state
    const [loading, setLoading] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);

    // Validation state
    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [locationError, setLocationError] = useState("");
    const [dateError, setDateError] = useState("");
    const [timeError, setTimeError] = useState("");
    const [categoryError, setCategoryError] = useState("");

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (err) {
            console.error("Error picking image:", err);
            Alert.alert("Error", "Failed to pick image. Please try again.");
        }
    };

    const validateForm = () => {
        let isValid = true;

        // Validate title
        if (!title.trim()) {
            setTitleError("Title is required");
            isValid = false;
        } else if (title.length > 100) {
            setTitleError("Title cannot be more than 100 characters");
            isValid = false;
        } else {
            setTitleError("");
        }

        // Validate description
        if (!description.trim()) {
            setDescriptionError("Description is required");
            isValid = false;
        } else if (description.length > 1000) {
            setDescriptionError(
                "Description cannot be more than 1000 characters"
            );
            isValid = false;
        } else {
            setDescriptionError("");
        }

        // Validate location
        if (!location.trim()) {
            setLocationError("Location is required");
            isValid = false;
        } else {
            setLocationError("");
        }

        // Validate date
        if (!date.trim()) {
            setDateError("Date is required");
            isValid = false;
        } else {
            // Simple date validation (MM/DD/YYYY)
            const dateRegex =
                /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(20)\d\d$/;
            if (!dateRegex.test(date)) {
                setDateError("Please enter a valid date in MM/DD/YYYY format");
                isValid = false;
            } else {
                setDateError("");
            }
        }

        // Validate time
        if (!time.trim()) {
            setTimeError("Time is required");
            isValid = false;
        } else {
            setTimeError("");
        }

        // Validate category
        if (!category) {
            setCategoryError("Please select a category");
            isValid = false;
        } else {
            setCategoryError("");
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Format date for API
            const dateParts = date.split("/");
            const formattedDate = new Date(
                parseInt(dateParts[2]), // year
                parseInt(dateParts[0]) - 1, // month (0-indexed)
                parseInt(dateParts[1]) // day
            ).toISOString();

            const eventData = {
                title,
                description,
                location,
                date: formattedDate,
                time,
                category,
                // In a production app, you would upload the image and get a URL back
                // For now, we'll just use a placeholder
                image: image ? "event-image.jpg" : "default-event.jpg",
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
            };

            const response = await axios.post(
                `${API_URL}/api/events`,
                eventData,
                config
            );

            setLoading(false);

            Alert.alert(
                "Success",
                "Your event has been created successfully!",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        } catch (err) {
            setLoading(false);
            console.error("Error creating event:", err);

            const errorMessage =
                err.response?.data?.message ||
                "Failed to create event. Please try again.";
            Alert.alert("Error", errorMessage);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                {/* Image Upload Section */}
                <View style={styles.imageSection}>
                    <TouchableOpacity
                        onPress={pickImage}
                        style={styles.imageContainer}
                    >
                        {image ? (
                            <Image
                                source={{ uri: image }}
                                style={styles.image}
                            />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Ionicons
                                    name="image-outline"
                                    size={50}
                                    color="#ccc"
                                />
                                <Text style={styles.placeholderText}>
                                    Add Event Image
                                </Text>
                            </View>
                        )}
                        <View style={styles.addImageButton}>
                            <Ionicons
                                name="add-circle"
                                size={30}
                                color="#6200ee"
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Title Input */}
                <TextInput
                    label="Event Title"
                    value={title}
                    onChangeText={setTitle}
                    mode="outlined"
                    style={styles.input}
                    error={!!titleError}
                />
                {titleError ? (
                    <HelperText type="error">{titleError}</HelperText>
                ) : null}

                {/* Description Input */}
                <TextInput
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    style={styles.input}
                    error={!!descriptionError}
                />
                {descriptionError ? (
                    <HelperText type="error">{descriptionError}</HelperText>
                ) : null}

                {/* Location Input */}
                <TextInput
                    label="Location"
                    value={location}
                    onChangeText={setLocation}
                    mode="outlined"
                    style={styles.input}
                    error={!!locationError}
                />
                {locationError ? (
                    <HelperText type="error">{locationError}</HelperText>
                ) : null}

                {/* Date Input */}
                <TextInput
                    label="Date (MM/DD/YYYY)"
                    value={date}
                    onChangeText={setDate}
                    mode="outlined"
                    style={styles.input}
                    error={!!dateError}
                    keyboardType="numeric"
                />
                {dateError ? (
                    <HelperText type="error">{dateError}</HelperText>
                ) : null}

                {/* Time Input */}
                <TextInput
                    label="Time (e.g., 7:00 PM)"
                    value={time}
                    onChangeText={setTime}
                    mode="outlined"
                    style={styles.input}
                    error={!!timeError}
                />
                {timeError ? (
                    <HelperText type="error">{timeError}</HelperText>
                ) : null}

                {/* Category Dropdown */}
                <Menu
                    visible={showCategoryMenu}
                    onDismiss={() => setShowCategoryMenu(false)}
                    anchor={
                        <TouchableOpacity
                            onPress={() => setShowCategoryMenu(true)}
                        >
                            <TextInput
                                label="Category"
                                value={category}
                                mode="outlined"
                                style={styles.input}
                                editable={false}
                                right={<TextInput.Icon icon="menu-down" />}
                                error={!!categoryError}
                            />
                        </TouchableOpacity>
                    }
                >
                    {CATEGORIES.map((cat) => (
                        <Menu.Item
                            key={cat}
                            onPress={() => {
                                setCategory(cat);
                                setShowCategoryMenu(false);
                            }}
                            title={cat}
                        />
                    ))}
                </Menu>
                {categoryError ? (
                    <HelperText type="error">{categoryError}</HelperText>
                ) : null}

                {/* Submit Button */}
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.button}
                    loading={loading}
                    disabled={loading}
                >
                    Create Event
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    formContainer: {
        padding: 20,
    },
    imageSection: {
        alignItems: "center",
        marginBottom: 20,
    },
    imageContainer: {
        width: 300,
        height: 170,
        borderRadius: 10,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    placeholderContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        marginTop: 10,
        color: "#999",
        fontSize: 14,
    },
    addImageButton: {
        position: "absolute",
        bottom: 5,
        right: 5,
        backgroundColor: "white",
        borderRadius: 15,
        elevation: 2,
    },
    input: {
        marginBottom: 5,
    },
    button: {
        marginTop: 20,
        paddingVertical: 8,
    },
});

export default AddEventScreen;
