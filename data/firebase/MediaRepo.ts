import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/firebase";
import { getUserMembershipTeamIds } from "@/data/firebase/UserRepo";

export type TrainingVideo = {
  url: string;
  path: string;
  name: string;
};

async function uriToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  return await response.blob();
}

async function uploadFile(params: {
  uri: string;
  path: string;
  contentType?: string;
}) {
  const blob = await uriToBlob(params.uri);
  const storageRef = ref(storage, params.path);

  await uploadBytes(storageRef, blob, params.contentType
    ? { contentType: params.contentType }
    : undefined);

  const downloadURL = await getDownloadURL(storageRef);

  return {
    url: downloadURL,
    path: params.path,
  };
}

export async function uploadUserProfilePhoto(uid: string, uri: string) {
  const path = `users/${uid}/profile.jpg`;

  const { url } = await uploadFile({
    uri,
    path,
    contentType: "image/jpeg",
  });

  await updateDoc(doc(db, "users", uid), {
    photoURL: url,
    updatedAt: serverTimestamp(),
  });

  await syncPhotoToTeamMembers(uid, url);

  return url;
}

export async function removeUserProfilePhoto(uid: string) {
  await updateDoc(doc(db, "users", uid), {
    photoURL: null,
    updatedAt: serverTimestamp(),
  });

  await syncPhotoToTeamMembers(uid, null);
}

async function syncPhotoToTeamMembers(uid: string, photoURL: string | null) {
  const teamIds = await getUserMembershipTeamIds(uid);

  await Promise.all(
    teamIds.map((teamId) =>
      updateDoc(doc(db, "teams", teamId, "members", uid), {
        photoURL,
        updatedAt: serverTimestamp(),
      }),
    ),
  );
}

export async function uploadTrainingVideo(params: {
  teamId: string;
  trainingId: string;
  uri: string;
  fileName?: string;
  contentType?: string;
}): Promise<TrainingVideo> {
  const safeFileName = params.fileName?.trim() || "training-video";
  const path = `training-videos/${params.teamId}/${params.trainingId}/${Date.now()}-${safeFileName}`;

  const { url } = await uploadFile({
    uri: params.uri,
    path,
    contentType: params.contentType ?? "video/mp4",
  });

  const video: TrainingVideo = {
    url,
    path,
    name: safeFileName,
  };

  await updateDoc(doc(db, "teams", params.teamId, "trainings", params.trainingId), {
    video,
    updatedAt: serverTimestamp(),
  });

  return video;
}

export async function removeTrainingVideo(teamId: string, trainingId: string, videoPath?: string | null) {
  if (videoPath) {
    try {
      await deleteObject(ref(storage, videoPath));
    } catch (error) {
      console.log("Nepodarilo sa vymazať video zo storage:", error);
    }
  }

  await updateDoc(doc(db, "teams", teamId, "trainings", trainingId), {
    video: null,
    updatedAt: serverTimestamp(),
  });
}