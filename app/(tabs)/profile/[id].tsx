import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { FlashList } from '@shopify/flash-list';
import { db } from '@/firebaseConfig';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const userId = Array.isArray(id) ? id[0] : id;

  const [profile, setProfile] = useState<{ username: string; profileImage: string } | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileRef = doc(db, 'profiles', userId);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as { username: string; profileImage: string });
        } else {
          setProfile({ username: 'Set Username', profileImage: '' });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    async function fetchUserPosts() {
      try {
        const postsQuery = query(
          collection(db, 'posts'),
          where('createdBy', '==', userId),
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
    }

    fetchProfile();
    fetchUserPosts();
  }, [userId]);

  const profileImageSource =
    profile && profile.profileImage && profile.profileImage.trim().length > 0
      ? { uri: profile.profileImage }
      : require('@/assets/images/logo.png');

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={profileImageSource} style={styles.profileImage} />
        <Text style={styles.username}>
          {profile && profile.username && profile.username.trim().length > 0
            ? profile.username
            : "Set Username"}
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#00C896" />
      ) : (
        <FlashList
          data={posts}
          renderItem={({ item }) => (
            <Image source={{ uri: item.image }} style={styles.postImage} />
          )}
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