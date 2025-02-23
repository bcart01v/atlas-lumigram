import { Link, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function Page() {
    const router = useRouter();
    return (
        <View style= {{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Login</Text>
            <Link href="/register" replace>
                <Text>Create a New Account</Text>
            </Link>

            <Pressable
                onPress={() => {
                    router.replace('/(tabs)');
                }}
            >
                <Text>Sign In</Text>
                </Pressable>
        </View>
    );
}