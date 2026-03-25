import * as FileSystem from "expo-file-system";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/firebase";

export async function uploadUserProfilePhoto(uid: string, uri: string) {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, `users/${uid}/profile.jpg`);

  await uploadBytes(storageRef, blob, {
    contentType: "image/jpeg",
  });

  const downloadURL = await getDownloadURL(storageRef);

  await updateDoc(doc(db, "users", uid), {
    photoURL: downloadURL,
    updatedAt: serverTimestamp(),
  });

  return downloadURL;
}

export async function removeUserProfilePhoto(uid: string) {
  await updateDoc(doc(db, "users", uid), {
    photoURL: null,
    updatedAt: serverTimestamp(),
  });
}