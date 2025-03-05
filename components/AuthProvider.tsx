import { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, User } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Define the type for the authentication context
type AuthContextType = {
    registerUser: (email: string, password: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
    login: (email: string, password: string) => Promise<UserCredential>;
    user?: User | null;
};

// Create the authentication context with an empty default value
const AuthContext = createContext<AuthContextType>({
    registerUser: async () => {
        throw new Error("registerUser function not implemented");
    },
    logout: async () => {
        throw new Error("logout function not implemented");
    },
    login: async () => {
        throw new Error("login function not implemented");
    }
});

// Hook to use authentication context
export const useAuth = () => useContext(AuthContext);

// Function to handle user registration
export function registerUser(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
}

// Function to handle user logout
function logout() {
    return auth.signOut();
}

// Function to handle user login
function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}

// AuthProvider component to provide the context to the app
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if(user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);
        return (
            <AuthContext.Provider value={{ user, registerUser, logout, login }}>
                {children}
            </AuthContext.Provider>
        );
    }
