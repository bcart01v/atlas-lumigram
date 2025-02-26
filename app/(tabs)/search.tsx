import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { userSearch } from '../../placeholder';

export default function SearchScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = searchQuery.trim()
        ? userSearch.filter(user =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    return (
        <View style={styles.container}>

            <TextInput
                style={styles.input}
                placeholder="Search users..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <FlashList
                data={filteredUsers}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.userItem}
                        onPress={() => router.replace(`/profile/${item.id}`)}
                    >
                        <Image source={{ uri: item.avatar }} style={styles.avatar} />
                        <Text style={styles.username}>{item.username}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                estimatedItemSize={60}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#00C896',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontSize: 16,
    },
});