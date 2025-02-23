import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
    const { id } = useLocalSearchParams();
    return (
        <View style= {{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>User Profile for : Dildo McFaggins</Text>
        </View>
    );
}