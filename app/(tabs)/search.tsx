import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Page() {
    return (
        <View style= {{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Search</Text>
            <Link href="/profile/1">
                <Text>Teriek Cohen</Text>
            </Link>
            <Link href="/profile/2">
                <Text>Brandon Marshal</Text>
            </Link>
            <Link href="/profile/3">
                <Text>Jay Cutler</Text>
            </Link>
        </View>
    );
}