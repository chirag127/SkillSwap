import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { API_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password,
            });

            const { token, user } = response.data;

            setUserToken(token);
            setUserInfo(user);

            await SecureStore.setItemAsync("userToken", token);
            await SecureStore.setItemAsync("userInfo", JSON.stringify(user));

            setIsLoading(false);
            return { success: true };
        } catch (error) {
            setIsLoading(false);
            const message =
                error.response?.data?.message ||
                "An error occurred during login";
            setError(message);
            return { success: false, message };
        }
    };

    const register = async (userData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${API_URL}/api/auth/register`,
                userData
            );

            const { token, user } = response.data;

            setUserToken(token);
            setUserInfo(user);

            await SecureStore.setItemAsync("userToken", token);
            await SecureStore.setItemAsync("userInfo", JSON.stringify(user));

            setIsLoading(false);
            return { success: true };
        } catch (error) {
            setIsLoading(false);
            const message =
                error.response?.data?.message ||
                "An error occurred during registration";
            setError(message);
            return { success: false, message };
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        setUserInfo(null);

        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userInfo");

        setIsLoading(false);
    };

    const forgotPassword = async (email) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${API_URL}/api/auth/forgotpassword`,
                { email }
            );
            setIsLoading(false);
            return { success: true, message: response.data.message };
        } catch (error) {
            setIsLoading(false);
            const message =
                error.response?.data?.message || "An error occurred";
            setError(message);
            return { success: false, message };
        }
    };

    const resetPassword = async (verificationCode, email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.put(
                `${API_URL}/api/auth/resetpassword`,
                { verificationCode, email, password }
            );

            const { token, user } = response.data;

            setUserToken(token);
            setUserInfo(user);

            await SecureStore.setItemAsync("userToken", token);
            await SecureStore.setItemAsync("userInfo", JSON.stringify(user));

            setIsLoading(false);
            return { success: true };
        } catch (error) {
            setIsLoading(false);
            const message =
                error.response?.data?.message || "An error occurred";
            setError(message);
            return { success: false, message };
        }
    };

    const updateProfile = async (userData) => {
        setIsLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            };

            const response = await axios.put(
                `${API_URL}/api/users/profile`,
                userData,
                config
            );

            const updatedUser = response.data.data;
            setUserInfo(updatedUser);
            await SecureStore.setItemAsync(
                "userInfo",
                JSON.stringify(updatedUser)
            );

            setIsLoading(false);
            return { success: true, data: updatedUser };
        } catch (error) {
            setIsLoading(false);
            const message =
                error.response?.data?.message || "An error occurred";
            setError(message);
            return { success: false, message };
        }
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await SecureStore.getItemAsync("userToken");
            let userInfo = await SecureStore.getItemAsync("userInfo");

            if (userInfo) {
                userInfo = JSON.parse(userInfo);
            }

            if (userToken) {
                setUserToken(userToken);
                setUserInfo(userInfo);
            }

            setIsLoading(false);
        } catch (e) {
            console.log(`isLoggedIn error: ${e}`);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userToken,
                userInfo,
                error,
                login,
                register,
                logout,
                forgotPassword,
                resetPassword,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
