import { View, Text, Image, Alert, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { GestureHandlerRootView, TapGestureHandler, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import { useState } from 'react';
import { favoritesFeed } from '../../placeholder';

export default function HomeScreen() {
  const [visibleCaptions, setVisibleCaptions] = useState<{ [key: string]: boolean }>({});

  const handleLongPress = (id: string, state: number) => {
    if (state === State.ACTIVE) {
        console.log(`Long Press Detected on Image ID: ${id}`);

        setVisibleCaptions((prev) => {
            const updatedCaptions = { ...prev, [id]: !prev[id] };
            console.log(`Updated State:`, updatedCaptions);
            return { ...updatedCaptions };
        });
    }
};

    const handleDoubleTap = () => {
        Alert.alert('Double Tap Detected', 'This will favorite the image in the next project.');
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
                        
                        {/* Show caption when long pressed */}
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
                data={favoritesFeed}
                renderItem={renderItem}
                estimatedItemSize={300}
                keyExtractor={(item) => item.id}
                extraData={visibleCaptions}
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