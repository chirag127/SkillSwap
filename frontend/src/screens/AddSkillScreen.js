import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button, HelperText, Chip } from "react-native-paper";
import { AuthContext } from "../context/AuthContext";

const AddSkillScreen = ({ navigation }) => {
    // This is a placeholder implementation
    // In a real app, this would be fully implemented

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [availability, setAvailability] = useState("");

    const handleSubmit = () => {
        Alert.alert(
            "Feature Coming Soon",
            "Add skill functionality will be available in the next update.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    label="Skill Title"
                    value={title}
                    onChangeText={setTitle}
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    style={styles.input}
                />

                <TextInput
                    label="Category"
                    value={category}
                    onChangeText={setCategory}
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    label="Hourly Rate (in time credits)"
                    value={hourlyRate}
                    onChangeText={setHourlyRate}
                    mode="outlined"
                    keyboardType="numeric"
                    style={styles.input}
                />

                <TextInput
                    label="Availability"
                    value={availability}
                    onChangeText={setAvailability}
                    mode="outlined"
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.button}
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
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
        paddingVertical: 8,
    },
});

export default AddSkillScreen;
