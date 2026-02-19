import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
export const userRepo = {
  async getActiveTeamId(userId: string): Promise<string | null> {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      console.log("UserRepo:", data.activeTeamId);
      return data.activeTeamId;
    }
    return null;
  },
  async setActiveTeamId(userId: string, teamId: string | null) {
    console.log("Setting active team ID for user", userId, "to", teamId);
  await updateDoc(doc(db, "users", userId), { activeTeamId: teamId });
}
  
}