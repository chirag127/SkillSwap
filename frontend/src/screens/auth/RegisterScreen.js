import React, { useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [location, setLocation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [locationError, setLocationError] = useState("");

    const { register, error, isLoading } = useContext(AuthContext);

    const validateName = () => {
        if (!name) {
            setNameError("Name is required");
            return false;
        } else if (name.length < 2) {
            setNameError("Name must be at least 2 characters");
            return false;
        }
        setNameError("");
        return true;
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError("Email is required");
            return false;
        } else if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email");
            return false;
        }
        setEmailError("");
        return true;
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError("Password is required");
            return false;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const validateConfirmPassword = () => {
        if (!confirmPassword) {
            setConfirmPasswordError("Please confirm your password");
            return false;
        } else if (confirmPassword !== password) {
            setConfirmPasswordError("Passwords do not match");
            return false;
        }
        setConfirmPasswordError("");
        return true;
    };

    const validateLocation = () => {
        if (!location) {
            setLocationError("Location is required");
            return false;
        }
        setLocationError("");
        return true;
    };

    const handleRegister = async () => {
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isLocationValid = validateLocation();

        if (
            isNameValid &&
            isEmailValid &&
            isPasswordValid &&
            isConfirmPasswordValid &&
            isLocationValid
        ) {
            const userData = {
                name,
                email,
                password,
                location,
            };

            const result = await register(userData);
            if (!result.success) {
                // Error is handled by the context
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>
                        Join the SkillSwap community
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <TextInput
                        label="Full Name"
                        value={name}
                        onChangeText={setName}
                        mode="outlined"
                        style={styles.input}
                        error={!!nameError}
                        onBlur={validateName}
                    />
                    {nameError ? (
                        <HelperText type="error">{nameError}</HelperText>
                    ) : null}

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                        error={!!emailError}
                        onBlur={validateEmail}
                    />
                    {emailError ? (
                        <HelperText type="error">{emailError}</HelperText>
                    ) : null}

                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry={!showPassword}
                        style={styles.input}
                        error={!!passwordError}
                        onBlur={validatePassword}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                    />
                    {passwordError ? (
                        <HelperText type="error">{passwordError}</HelperText>
                    ) : null}

                    <TextInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        mode="outlined"
                        secureTextEntry={!showConfirmPassword}
                        style={styles.input}
                        error={!!confirmPasswordError}
                        onBlur={validateConfirmPassword}
                        right={
                            <TextInput.Icon
                                icon={showConfirmPassword ? "eye-off" : "eye"}
                                onPress={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            />
                        }
                    />
                    {confirmPasswordError ? (
                        <HelperText type="error">
                            {confirmPasswordError}
                        </HelperText>
                    ) : null}

                    <TextInput
                        label="Neighborhood/Area"
                        value={location}
                        onChangeText={setLocation}
                        mode="outlined"
                        style={styles.input}
                        error={!!locationError}
                        onBlur={validateLocation}
                    />
                    {locationError ? (
                        <HelperText type="error">{locationError}</HelperText>
                    ) : null}

                    {error ? (
                        <HelperText type="error">{error}</HelperText>
                    ) : null}

                    <Button
                        mode="contained"
                        onPress={handleRegister}
                        style={styles.button}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Register
                    </Button>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>
                            Already have an account?{" "}
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Login")}
                        >
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    headerContainer: {
        alignItems: "center",
        marginVertical: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#6200ee",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginTop: 5,
    },
    formContainer: {
        width: "100%",
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
        paddingVertical: 8,
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 30,
    },
    loginText: {
        color: "#666",
    },
    loginLink: {
        color: "#6200ee",
        fontWeight: "bold",
    },
});

export default RegisterScreen;
