import { Text, View, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { userSearch } from '../../../placeholder';

export default function UserProfileScreen() {
    const { id } = useLocalSearchParams();
    const user = userSearch.find(user => user.id === id);


    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>User not found!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: user.avatar }} style={styles.profileImage} />

            <Text style={styles.username}>{user.username}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
});