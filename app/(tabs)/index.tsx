import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { 
  GestureHandlerRootView, 
  TapGestureHandler, 
  LongPressGestureHandler, 
  State 
} from 'react-native-gesture-handler';
import { useAuth } from '../../components/AuthProvider';
import { 
    collection, 
    query, 
    orderBy, 
    limit, 
    startAfter, 
    getDocs,
    addDoc
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export default function HomeScreen() {
  const auth = useAuth();

  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [visibleCaptions, setVisibleCaptions] = useState<{ [key: string]: boolean }>({});
  const PAGE_SIZE = 10;

  const fetchPosts = async () => {
    try {
      const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE)
      );
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
      if (querySnapshot.docs.length > 0) {
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else {
        setLastDoc(null);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const fetchMorePosts = async () => {
    if (!lastDoc) return;
    try {
      const postQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
      const querySnapshot = await getDocs(postQuery);
      const morePosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(prev => [...prev, ...morePosts]);
      if (querySnapshot.docs.length > 0) {
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else {
        setLastDoc(null);
      }
    } catch (error) {
      console.error('Error fetching more posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLongPress = (id: string, state: number) => {
    if (state === State.ACTIVE) {
      setVisibleCaptions(prev => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  // Updated firestore rules to make this happen
  const handleDoubleTap = async (post: { id: string; image: string; caption: string }) => {
    if (!auth.user) {
      Alert.alert("Not authenticated", "Please log in to add favorites.");
      return;
    }
    try {
      await addDoc(collection(db, 'favorites'), {
        userId: auth.user.uid,
        postId: post.id,
        image: post.image,
        caption: post.caption,
        createdAt: new Date(),
      });
      Alert.alert("Favorite added", "Post added to your favorites!");
    } catch (error) {
      console.error("Error adding favorite:", error);
      Alert.alert("Error", "Could not add favorite. Please try again later.");
    }
  };

  // Render each post item with gesture handlers
  const renderItem = ({ item }: { item: { id: string; image: string; caption: string } }) => (
    <GestureHandlerRootView>
      <LongPressGestureHandler
        onHandlerStateChange={({ nativeEvent }) => handleLongPress(item.id, nativeEvent.state)}
        minDurationMs={500}
      >
        <TapGestureHandler
          numberOfTaps={2}
          onActivated={() => handleDoubleTap(item)}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            {visibleCaptions[item.id] && (
              <View style={styles.captionContainer}>
                <Text style={styles.caption}>{item.caption}</Text>
              </View>
            )}
          </View>
        </TapGestureHandler>
      </LongPressGestureHandler>
    </GestureHandlerRootView>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlashList
        data={posts}
        renderItem={renderItem}
        estimatedItemSize={300}
        keyExtractor={(item) => item.id}
        extraData={visibleCaptions}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={fetchMorePosts}
        onEndReachedThreshold={0.1}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    marginVertical: 10,
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  captionContainer: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 5,
    borderRadius: 5,
    zIndex: 1000,
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});