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
import {
    TextInput,
    Button,
    HelperText,
    ActivityIndicator,
} from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [resetSent, setResetSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationCodeError, setVerificationCodeError] = useState("");
    const [verifyingCode, setVerifyingCode] = useState(false);

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
            }
        }
    };

    const validateVerificationCode = () => {
        if (!verificationCode.trim()) {
            setVerificationCodeError("Verification code is required");
            return false;
        } else if (
            verificationCode.length !== 6 ||
            !/^\d+$/.test(verificationCode)
        ) {
            setVerificationCodeError("Please enter a valid 6-digit code");
            return false;
        }
        setVerificationCodeError("");
        return true;
    };

    const handleContinue = () => {
        if (!validateVerificationCode()) {
            return;
        }

        setVerifyingCode(true);

        // Navigate to reset password screen with verification code
        navigation.navigate("ResetPassword", { verificationCode, email });
        setVerifyingCode(false);
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
                                A verification code has been sent to your email.
                            </Text>
                            <Text style={styles.instructionsText}>
                                Please check your email inbox for the 6-digit
                                code and enter it below. If you don't see the
                                email, please check your spam folder.
                            </Text>

                            <TextInput
                                label="Verification Code"
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                                mode="outlined"
                                keyboardType="number-pad"
                                maxLength={6}
                                style={styles.input}
                                error={!!verificationCodeError}
                                onBlur={validateVerificationCode}
                            />
                            {verificationCodeError ? (
                                <HelperText type="error">
                                    {verificationCodeError}
                                </HelperText>
                            ) : null}

                            <Button
                                mode="contained"
                                onPress={handleContinue}
                                style={styles.button}
                                loading={verifyingCode}
                                disabled={verifyingCode}
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
    instructionsText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 20,
        lineHeight: 20,
    },
});

export default ForgotPasswordScreen;
