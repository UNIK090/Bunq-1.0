import { getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { userProfilesCollection, commentsCollection } from './firebase';
import { AdminUser } from '../types';

export class AdminService {
  static async getUsers(): Promise<AdminUser[]> {
    const snapshot = await getDocs(userProfilesCollection);
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as unknown as AdminUser));
  }

  static async banUser(userId: string): Promise<void> {
    const userRef = doc(userProfilesCollection, userId);
    await updateDoc(userRef, { banned: true });
  }

  static async unbanUser(userId: string): Promise<void> {
    const userRef = doc(userProfilesCollection, userId);
    await updateDoc(userRef, { banned: false });
  }

  static async deleteComment(commentId: string): Promise<void> {
    const commentRef = doc(commentsCollection, commentId);
    await deleteDoc(commentRef);
  }

  static async getComments(): Promise<Comment[]> {
    const snapshot = await getDocs(commentsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Comment));
  }

  // Add more methods as needed
}
