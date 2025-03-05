import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

type Post = {
    caption: string;
    image: string;
    createdAt: Date;
    createdBy: string;
};

type Favorites = {
    userID: string;
    postID: string;
    image: string;
    caption: string;
    createdAt: Date;
};

const posts = collection(db, 'posts');

async function addPost(post: Post) {
    await addDoc(posts, post);
}

const favorites = collection(db, 'favorites');

async function addFavorite(favorite: Favorites) {
    await addDoc(favorites, favorite);
}

export default {
    addPost,
    addFavorite,
};