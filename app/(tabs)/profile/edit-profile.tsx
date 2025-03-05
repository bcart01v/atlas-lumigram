import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/components/AuthProvider';
import storage from '@/lib/storage';

export default function EditProfileScreen() {
  const router = useRouter();
  const auth = useAuth();

  const [profileImage, setProfileImage] = useState('https://placedog.net/150?id=10');
  const [username, setUsername] = useState('pink-flowers23131');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

    useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.user) {
        setLoading(false);
        return;
      }
      try {
        const profileRef = doc(db, 'profiles', auth.user.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setUsername(data.username || '');
          setProfileImage(data.profileImage || 'https://placedog.net/150?id=10');
        } else {

          setUsername('');
          setProfileImage('https://placedog.net/150?id=10');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [auth.user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    if (!auth.user) return;
    setSaving(true);
    try {
      let imageURL = profileImage;
      if (profileImage.startsWith('file://')) {
        const name = profileImage.split('/').pop() || 'profile_image';
        const { downloadURL } = await storage.upload(profileImage, name);
        imageURL = downloadURL;
      }
      const profileRef = doc(db, 'profiles', auth.user.uid);
      await setDoc(profileRef, { username, profileImage: imageURL }, { merge: true });
      Alert.alert("Profile Updated!", "Your changes have been saved.");
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00C896" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter new username"
      />

      <TouchableOpacity onPress={saveProfile} style={styles.saveButton} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? "Saving..." : "Save Profile"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  imageContainer: {
    backgroundColor: '#EAEAEA',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  input: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: '#00C896',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
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
});