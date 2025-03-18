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

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [resetSent, setResetSent] = useState(false);
    const [resetToken, setResetToken] = useState("");

    const { forgotPassword, error, isLoading } = useContext(AuthContext);

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

    const handleForgotPassword = async () => {
        const isEmailValid = validateEmail();

        if (isEmailValid) {
            const result = await forgotPassword(email);
            if (result.success) {
                setResetSent(true);
                // In a real app, the token would be sent via email
                // For this demo, we'll get it from the response
                setResetToken(result.data.resetToken);
            }
        }
    };

    const handleContinue = () => {
        navigation.navigate("ResetPassword", { resetToken });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>
                        {resetSent
                            ? "Check your email for a reset code"
                            : "Enter your email to reset your password"}
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    {!resetSent ? (
                        <>
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
                                <HelperText type="error">
                                    {emailError}
                                </HelperText>
                            ) : null}

                            {error ? (
                                <HelperText type="error">{error}</HelperText>
                            ) : null}

                            <Button
                                mode="contained"
                                onPress={handleForgotPassword}
                                style={styles.button}
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                Send Reset Link
                            </Button>
                        </>
                    ) : (
                        <>
                            <Text style={styles.successMessage}>
                                A password reset link has been sent to your
                                email.
                            </Text>

                            {/* This is just for the demo - in a real app, the user would get the token via email */}
                            <Text style={styles.tokenInfo}>
                                For this demo, your reset token is:
                            </Text>
                            <Text style={styles.tokenValue}>{resetToken}</Text>

                            <Button
                                mode="contained"
                                onPress={handleContinue}
                                style={styles.button}
                            >
                                Continue to Reset Password
                            </Button>
                        </>
                    )}

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                        style={styles.backToLogin}
                    >
                        <Text style={styles.backToLoginText}>
                            Back to Login
                        </Text>
                    </TouchableOpacity>
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
        justifyContent: "center",
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 30,
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
        textAlign: "center",
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
    backToLogin: {
        alignSelf: "center",
        marginTop: 20,
    },
    backToLoginText: {
        color: "#6200ee",
    },
    successMessage: {
        fontSize: 16,
        color: "#4CAF50",
        textAlign: "center",
        marginBottom: 20,
    },
    tokenInfo: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginTop: 10,
    },
    tokenValue: {
        fontSize: 14,
        color: "#6200ee",
        textAlign: "center",
        fontWeight: "bold",
        marginTop: 5,
        marginBottom: 20,
    },
});

export default ForgotPasswordScreen;
