import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { useAuth } from '@/components/AuthProvider';

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = useAuth();

    async function login() {
        if (!email || !password) {
            alert('Please fill out all fields.');
            return;
        }

        setLoading(true);

        try {
            await auth.login(email, password);
            router.replace('/(tabs)');
        } catch (error: any) {
            alert("Incorrect Email or Password: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode='contain'/>

            <Text style={styles.loginText}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Pressable
                style={styles.signInButton}
                onPress={login}
                disabled={loading}
            >
                <Text style={styles.signInText}>
                    {loading ? 'Signing In...' : 'Sign in'}
                </Text>
            </Pressable>

            <Pressable
                style={styles.registerButton}
                onPress={() => router.replace('/register')}
            >
                <Text style={styles.registerText}>Create a new account</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#03053D',
        paddingHorizontal: 20,
    },
    logo: { 
        width: '100%',
        height: 120,
        marginBottom: 30
    },
    loginText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#00C896',
        borderRadius: 5,
        paddingHorizontal: 15,
        backgroundColor: '#03053D',
        color: '#fff',
        marginBottom: 15,
    },
    signInButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#00C896',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 20,
    },
    signInText: {
        color: '#03053D',
        fontWeight: 'bold',
        fontSize: 16,
    },
    registerButton: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    registerText: {
        color: '#fff',
        fontSize: 16,
    },
});