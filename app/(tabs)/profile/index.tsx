import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/components/AuthProvider';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen() {
  const router = useRouter();
  const auth = useAuth();
  const [profile, setProfile] = useState<{ username: string; profileImage: string } | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!auth.user) return;
    try {
      const profileRef = doc(db, 'profiles', auth.user.uid);
      const docSnap = await getDoc(profileRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as { username: string; profileImage: string });
      } else {
        setProfile({ username: '', profileImage: '' });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchUserPosts = async () => {
    if (!auth.user) return;
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        where('createdBy', '==', auth.user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

    useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [auth.user])
  );

  useEffect(() => {
    fetchUserPosts();
  }, [auth.user]);

  const profileImageSource =
    profile?.profileImage && profile.profileImage.trim().length > 0
      ? { uri: profile.profileImage }
      : require('@/assets/images/logo.png');


  const displayUsername =
    profile?.username && profile.username.trim().length > 0
      ? profile.username
      : "Set Username";

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile/edit-profile')}>
          <Image
            source={profileImageSource}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.username}>{displayUsername}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#00C896" />
      ) : (
        <FlashList
          data={posts}
          renderItem={({ item }) => <Image source={{ uri: item.image }} style={styles.postImage} />}
          keyExtractor={(item) => item.id}
          numColumns={3}
          estimatedItemSize={150}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    paddingVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
  },
});