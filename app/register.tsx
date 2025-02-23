import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Page() {
    return (
        <View style= {{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Register</Text>
            <Link href="/login" replace>
                <Text>Log into Existing Account</Text>
            </Link>
        </View>
    );
}