import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { useAuth } from "./AuthProvider";

export function LogoutComponent() {
    const router = useRouter();
    const auth = useAuth();

    async function lougout() {
        await auth.logout();
        router.replace('/login');
    }

    return <Pressable onPress={lougout}>
        <Ionicons name="log-out-outline" size={24} style={{ marginRight: 16, color: '#1ED2AF' }} />
    </Pressable>
}