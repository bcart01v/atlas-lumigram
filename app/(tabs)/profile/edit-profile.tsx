import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
    const router = useRouter();

    const [profileImage, setProfileImage] = useState('https://placedog.net/150?id=10');
    const [username, setUsername] = useState('pink-flowers23131');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const saveProfile = () => {
        Alert.alert('Profile Updated!', 'Your changes have been saved.');
        router.back();
    };

    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter new username"
            />

            <TouchableOpacity onPress={saveProfile} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    imageContainer: {
        backgroundColor: '#EAEAEA',
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 20,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    input: {
        width: '100%',
        height: 60,
        borderWidth: 1,
        borderColor: '#00C896',
        borderRadius: 5,
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    saveButton: {
        width: '90%',
        padding: 25,
        backgroundColor: '#00C896',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 20,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});