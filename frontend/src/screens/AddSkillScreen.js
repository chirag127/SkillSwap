import React, { useState, useContext } from "react";
import {
    View,
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
    Chip,
    ActivityIndicator,
    Text,
    Menu,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

const CATEGORIES = [
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

const AddSkillScreen = ({ navigation }) => {
    const { userToken } = useContext(AuthContext);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [availability, setAvailability] = useState("");
    const [image, setImage] = useState(null);

    // UI state
    const [loading, setLoading] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);

    // Validation state
    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [hourlyRateError, setHourlyRateError] = useState("");
    const [availabilityError, setAvailabilityError] = useState("");

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
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

        // Validate category
        if (!category) {
            setCategoryError("Please select a category");
            isValid = false;
        } else {
            setCategoryError("");
        }

        // Validate hourly rate
        if (!hourlyRate) {
            setHourlyRateError("Hourly rate is required");
            isValid = false;
        } else if (isNaN(hourlyRate) || parseFloat(hourlyRate) < 1) {
            setHourlyRateError("Hourly rate must be at least 1");
            isValid = false;
        } else {
            setHourlyRateError("");
        }

        // Validate availability
        if (!availability.trim()) {
            setAvailabilityError("Availability is required");
            isValid = false;
        } else {
            setAvailabilityError("");
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const skillData = {
                title,
                description,
                category,
                hourlyRate: parseFloat(hourlyRate),
                availability,
                // In a production app, you would upload the image and get a URL back
                // For now, we'll just use a placeholder
                images: image ? ["skill-image.jpg"] : ["default-skill.jpg"],
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-Type": "application/json",
                },
            };

            const response = await axios.post(
                `${API_URL}/api/skills`,
                skillData,
                config
            );

            setLoading(false);

            Alert.alert("Success", "Your skill has been added successfully!", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (err) {
            setLoading(false);
            console.error("Error adding skill:", err);

            const errorMessage =
                err.response?.data?.message ||
                "Failed to add skill. Please try again.";
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
                                    Add Skill Image
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
                    label="Skill Title"
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

                {/* Hourly Rate Input */}
                <TextInput
                    label="Hourly Rate (in time credits)"
                    value={hourlyRate}
                    onChangeText={setHourlyRate}
                    mode="outlined"
                    keyboardType="numeric"
                    style={styles.input}
                    error={!!hourlyRateError}
                />
                {hourlyRateError ? (
                    <HelperText type="error">{hourlyRateError}</HelperText>
                ) : null}

                {/* Availability Input */}
                <TextInput
                    label="Availability (e.g., Weekends, Evenings)"
                    value={availability}
                    onChangeText={setAvailability}
                    mode="outlined"
                    style={styles.input}
                    error={!!availabilityError}
                />
                {availabilityError ? (
                    <HelperText type="error">{availabilityError}</HelperText>
                ) : null}

                {/* Submit Button */}
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.button}
                    loading={loading}
                    disabled={loading}
                >
                    Add Skill
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
        width: 200,
        height: 150,
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

export default AddSkillScreen;
