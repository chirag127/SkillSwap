import React, { useState, useContext, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import {
    TextInput,
    Button,
    HelperText,
    ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

const EditProfileScreen = ({ navigation }) => {
    const { userToken, userInfo, updateProfile } = useContext(AuthContext);

    // Form state
    const [name, setName] = useState(userInfo?.name || "");
    const [email, setEmail] = useState(userInfo?.email || "");
    const [phone, setPhone] = useState(userInfo?.phone || "");
    const [bio, setBio] = useState(userInfo?.bio || "");
    const [location, setLocation] = useState(userInfo?.location || "");
    const [image, setImage] = useState(null);

    // UI state
    const [loading, setLoading] = useState(false);

    // Validation state
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");

    useEffect(() => {
        // Initialize form with user data
        if (userInfo) {
            setName(userInfo.name || "");
            setEmail(userInfo.email || "");
            setPhone(userInfo.phone || "");
            setBio(userInfo.bio || "");
            setLocation(userInfo.location || "");
        }
    }, [userInfo]);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
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

        // Validate name
        if (!name.trim()) {
            setNameError("Name is required");
            isValid = false;
        } else if (name.length < 2) {
            setNameError("Name must be at least 2 characters");
            isValid = false;
        } else {
            setNameError("");
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setEmailError("Email is required");
            isValid = false;
        } else if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email");
            isValid = false;
        } else {
            setEmailError("");
        }

        // Validate phone (optional)
        if (phone && !/^[0-9+\-\s()]{10,15}$/.test(phone)) {
            setPhoneError("Please enter a valid phone number");
            isValid = false;
        } else {
            setPhoneError("");
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const userData = {
                name,
                email,
                phone,
                bio,
                location,
                // In a production app, you would upload the image and get a URL back
                profileImage: image
                    ? "updated-profile.jpg"
                    : userInfo.profileImage,
            };

            const result = await updateProfile(userData);

            if (result.success) {
                setLoading(false);
                Alert.alert(
                    "Success",
                    "Your profile has been updated successfully!",
                    [{ text: "OK", onPress: () => navigation.goBack() }]
                );
            } else {
                setLoading(false);
                Alert.alert("Error", result.message);
            }
        } catch (err) {
            setLoading(false);
            console.error("Error updating profile:", err);
            Alert.alert("Error", "Failed to update profile. Please try again.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                {/* Profile Image */}
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
                            <Image
                                source={require("../../assets/default-profile.jpg")}
                                style={styles.image}
                            />
                        )}
                        <View style={styles.editImageButton}>
                            <Ionicons name="camera" size={18} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.changePhotoText}>
                        Tap to change photo
                    </Text>
                </View>

                {/* Name Input */}
                <TextInput
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={styles.input}
                    error={!!nameError}
                />
                {nameError ? (
                    <HelperText type="error">{nameError}</HelperText>
                ) : null}

                {/* Email Input */}
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    error={!!emailError}
                />
                {emailError ? (
                    <HelperText type="error">{emailError}</HelperText>
                ) : null}

                {/* Phone Input */}
                <TextInput
                    label="Phone (optional)"
                    value={phone}
                    onChangeText={setPhone}
                    mode="outlined"
                    keyboardType="phone-pad"
                    style={styles.input}
                    error={!!phoneError}
                />
                {phoneError ? (
                    <HelperText type="error">{phoneError}</HelperText>
                ) : null}

                {/* Location Input */}
                <TextInput
                    label="Location"
                    value={location}
                    onChangeText={setLocation}
                    mode="outlined"
                    style={styles.input}
                />

                {/* Bio Input */}
                <TextInput
                    label="Bio (optional)"
                    value={bio}
                    onChangeText={setBio}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    style={styles.input}
                />

                {/* Submit Button */}
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.button}
                    loading={loading}
                    disabled={loading}
                >
                    Save Changes
                </Button>

                {/* Cancel Button */}
                <Button
                    mode="outlined"
                    onPress={() => navigation.goBack()}
                    style={styles.cancelButton}
                >
                    Cancel
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
        width: 120,
        height: 120,
        borderRadius: 60,
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
    editImageButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#6200ee",
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "white",
    },
    changePhotoText: {
        marginTop: 10,
        color: "#6200ee",
        fontSize: 14,
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
        paddingVertical: 8,
    },
    cancelButton: {
        marginTop: 10,
        paddingVertical: 8,
    },
});

export default EditProfileScreen;
