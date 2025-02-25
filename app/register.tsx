import { useRouter } from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
             <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode='contain' />

            <Text style={styles.registerText}>Register</Text>

            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" secureTextEntry />

            <Pressable style={styles.createAccountButton} onPress={() => router.replace('/(tabs)')}>
                <Text style={styles.createAccountText}>Create Account</Text>
            </Pressable>

            <Pressable style={styles.loginButton} onPress={() => router.replace('/login')}>
                <Text style={styles.loginText}>Login to existing account</Text>
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
    school: {
        color: '#00C896',
    },
    registerText: {
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
    createAccountButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#00C896',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 10,
    },
    createAccountText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loginButton: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
        borderWidth: 0,
    },
});