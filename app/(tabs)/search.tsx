import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { collection, query, orderBy, startAt, endAt, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/components/AuthProvider';

export default function SearchScreen() {
  const router = useRouter();
  const auth = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.trim() === '') {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const q = query(
          collection(db, 'profiles'),
          orderBy('username_lowercase'),
          startAt(searchQuery.toLowerCase()),
          endAt(searchQuery.toLowerCase() + '\uf8ff')
        );
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery]);

  const renderItem = ({ item }: { item: { id: string; username: string; profileImage: string } }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => router.push(`/profile/${item.id}`)}>
      <Image
        source={
          item.profileImage && item.profileImage.trim().length > 0
            ? { uri: item.profileImage }
            : require('@/assets/images/logo.png')
        }
        style={styles.avatar}
      />
      <Text style={styles.username}>
        {item.username && item.username.trim().length > 0 ? item.username : 'Set Username'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <ActivityIndicator size="small" color="#00C896" />
      ) : (
        <FlashList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={60}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#00C896',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
  },
});