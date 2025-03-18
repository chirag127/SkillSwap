import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";

const AddEventScreen = ({ navigation }) => {
    // This is a placeholder implementation
    // In a real app, this would be fully implemented

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = () => {
        Alert.alert(
            "Feature Coming Soon",
            "Add event functionality will be available in the next update.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    label="Event Title"
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
                    label="Location"
                    value={location}
                    onChangeText={setLocation}
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    label="Date (MM/DD/YYYY)"
                    value={date}
                    onChangeText={setDate}
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    label="Time"
                    value={time}
                    onChangeText={setTime}
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    label="Category"
                    value={category}
                    onChangeText={setCategory}
                    mode="outlined"
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.button}
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
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
        paddingVertical: 8,
    },
});

export default AddEventScreen;
