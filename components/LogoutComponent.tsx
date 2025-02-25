import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

export function LogoutComponent() {
    const router = useRouter();

    function lougout() {
        router.replace('/login');
    }

    return <Pressable onPress={lougout}>
        <Ionicons name="log-out-outline" size={24} style={{ marginRight: 16 }} color='teal' />
    </Pressable>
}