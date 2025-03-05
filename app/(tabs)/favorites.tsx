import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { 
  GestureHandlerRootView, 
  TapGestureHandler, 
  LongPressGestureHandler, 
  State 
} from 'react-native-gesture-handler';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs 
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '../../components/AuthProvider';

export default function FavoritesScreen() {
  const auth = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [visibleCaptions, setVisibleCaptions] = useState<{ [key: string]: boolean }>({});
  const PAGE_SIZE = 10;

  const fetchFavorites = async () => {
    if (!auth.user) return;
    try {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', auth.user.uid),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE)
      );
      const querySnapshot = await getDocs(q);
      const favoritesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavorites(favoritesData);
      if (querySnapshot.docs.length > 0) {
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else {
        setLastDoc(null);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  const fetchMoreFavorites = async () => {
    if (!lastDoc || !auth.user) return;
    try {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', auth.user.uid),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
      const querySnapshot = await getDocs(q);
      const moreFavorites = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavorites(prev => [...prev, ...moreFavorites]);
      if (querySnapshot.docs.length > 0) {
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else {
        setLastDoc(null);
      }
    } catch (error) {
      console.error("Error fetching more favorites:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [auth.user]);

  const handleLongPress = (id: string, state: number) => {
    if (state === State.ACTIVE) {
      setVisibleCaptions(prev => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  const handleDoubleTap = () => {
    Alert.alert('Double Tap Detected', 'Double tap is not active on favorites.');
  };

  const renderItem = ({ item }: { item: { id: string; image: string; caption: string } }) => (
    <GestureHandlerRootView>
      <LongPressGestureHandler
        onHandlerStateChange={({ nativeEvent }) => handleLongPress(item.id, nativeEvent.state)}
        minDurationMs={500}
      >
        <TapGestureHandler numberOfTaps={2} onActivated={handleDoubleTap}>
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
        data={favorites}
        renderItem={renderItem}
        estimatedItemSize={300}
        keyExtractor={(item) => item.id}
        extraData={visibleCaptions}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={fetchMoreFavorites}
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