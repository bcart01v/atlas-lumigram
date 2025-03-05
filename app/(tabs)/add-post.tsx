import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import storage from '@/lib/storage';
import firestore from '@/lib/firestore';
import { useAuth } from '@/components/AuthProvider';

export default function AddPostScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const auth = useAuth();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

// This has lots of extra error catches, as I was trying to figured out why uploading to
// the database wasn't working, but it was my database config that was the issue..

    async function save() {
        console.log("Save function triggered");
        if (!image) return;
        
        const name = image.split("/").pop() as string;
        try {
          const { downloadURL, metadata } = await storage.upload(image, name);
          console.log("Upload successful, URL:", downloadURL);
          
          try {
            await firestore.addPost({
              caption,
              image: downloadURL,
              createdAt: new Date(),
              createdBy: auth.user?.uid || '',
            });
            console.log("Post successfully written to Firestore");
          } catch (firestoreError) {
            console.error("Firestore write error:", firestoreError);
          }
        } catch (storageError) {
          console.error("Upload failed:", storageError);
        }
      }

    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>Tap to select an image</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Add a caption"
                value={caption}
                onChangeText={setCaption}
            />

            <TouchableOpacity style={styles.saveButton} onPress={save}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setImage(null); setCaption(''); }}>
                <Text style={styles.resetButton}>Reset</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'lightgrey',
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    imageContainer: {
        width: '100%',
        height: 300,
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    placeholderText: {
        color: '#999',
        fontSize: 16,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#00C896',
        borderRadius: 5,
        padding: 10,
        marginTop: 30,
    },
    saveButton: {
        width: '90%',
        padding: 25,
        backgroundColor: '#00C896',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 20,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    resetButton: {
        marginTop: 40,
        fontSize: 16,
        color: '#000',
    },
});