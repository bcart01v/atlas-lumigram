import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { profileFeed } from '../../../placeholder';

export default function ProfileScreen() {
    const router = useRouter();
    const [profileImage, setProfileImage] = useState('https://placedog.net/150?id=10');
    const username = 'pink-flowers23131';

    return (
        <View style={styles.container}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/profile/edit-profile')}>
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                </TouchableOpacity>
                <Text style={styles.username}>{username}</Text>
            </View>

            <FlashList
                data={profileFeed}
                renderItem={({ item }) => (
                    <Image source={{ uri: item.image }} style={styles.postImage} />
                )}
                keyExtractor={(item) => item.id}
                numColumns={3}
                estimatedItemSize={150}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    profileHeader: {
        alignItems: 'center',
        backgroundColor: '#EAEAEA',
        paddingVertical: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    username: {
        fontSize: 16,
        marginTop: 20,
        marginBottom: 20,
    },
    postImage: {
        width: '100%',
        aspectRatio: 1,
    },
});