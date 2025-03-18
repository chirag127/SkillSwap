import React, { useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { login, error, isLoading } = useContext(AuthContext);

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

    const handleLogin = async () => {
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (isEmailValid && isPasswordValid) {
            const result = await login(email, password);
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
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../../../assets/logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>SkillSwap</Text>
                    <Text style={styles.subtitle}>
                        Neighborhood Barter Network
                    </Text>
                </View>

                <View style={styles.formContainer}>
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

                    {error ? (
                        <HelperText type="error">{error}</HelperText>
                    ) : null}

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={styles.button}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Login
                    </Button>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("ForgotPassword")}
                        style={styles.forgotPassword}
                    >
                        <Text style={styles.forgotPasswordText}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>
                            Don't have an account?{" "}
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Register")}
                        >
                            <Text style={styles.registerLink}>Register</Text>
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
        justifyContent: "center",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
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
    forgotPassword: {
        alignSelf: "center",
        marginTop: 15,
    },
    forgotPasswordText: {
        color: "#6200ee",
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    registerText: {
        color: "#666",
    },
    registerLink: {
        color: "#6200ee",
        fontWeight: "bold",
    },
});

export default LoginScreen;
