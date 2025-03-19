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

const ResetPasswordScreen = ({ navigation, route }) => {
    // Get verification code and email from route params
    const { verificationCode, email } = route.params || {};
    const [code, setCode] = useState(verificationCode || "");
    const [userEmail, setUserEmail] = useState(email || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [codeError, setCodeError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const { resetPassword, error, isLoading } = useContext(AuthContext);

    const validateCode = () => {
        if (!code) {
            setCodeError("Verification code is required");
            return false;
        } else if (code.length !== 6 || !/^\d+$/.test(code)) {
            setCodeError("Please enter a valid 6-digit code");
            return false;
        }
        setCodeError("");
        return true;
    };

    const validateEmail = () => {
        if (!userEmail) {
            setEmailError("Email is required");
            return false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
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

    const handleResetPassword = async () => {
        const isTokenValid = validateToken();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        if (isTokenValid && isPasswordValid && isConfirmPasswordValid) {
            const result = await resetPassword(token, password);
            if (result.success) {
                // User will be automatically logged in by the context
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
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                        Create a new password for your account
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    {!resetToken && (
                        <>
                            <TextInput
                                label="Reset Token"
                                value={token}
                                onChangeText={setToken}
                                mode="outlined"
                                style={styles.input}
                                error={!!tokenError}
                                onBlur={validateToken}
                            />
                            {tokenError ? (
                                <HelperText type="error">
                                    {tokenError}
                                </HelperText>
                            ) : null}
                        </>
                    )}

                    <TextInput
                        label="New Password"
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
                        label="Confirm New Password"
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

                    {error ? (
                        <HelperText type="error">{error}</HelperText>
                    ) : null}

                    <Button
                        mode="contained"
                        onPress={handleResetPassword}
                        style={styles.button}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Reset Password
                    </Button>

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
});

export default ResetPasswordScreen;
