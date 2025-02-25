import { useRouter } from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode='contain'/>

            <Text style={styles.loginText}>Login</Text>

            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" secureTextEntry />

            <Pressable style={styles.signInButton} onPress={() => router.replace('/(tabs)')}>
                <Text style={styles.signInText}>Sign in</Text>
            </Pressable>


            <Pressable style={styles.registerButton} onPress={() => router.replace('/register')}>
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