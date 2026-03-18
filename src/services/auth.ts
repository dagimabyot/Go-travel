import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User } from '../types';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  login: (email: string, pass: string) => 
    signInWithEmailAndPassword(auth, email, pass),
  
  signup: async (name: string, email: string, pass: string, phone: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;
    
    const newUser: User = {
      uid: firebaseUser.uid,
      email: email,
      fullName: name,
      phoneNumber: phone,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
    await sendEmailVerification(firebaseUser);
    return newUser;
  },

  logout: () => signOut(auth),

  resetPassword: (email: string) => sendPasswordResetEmail(auth, email),

  sendVerification: () => {
    if (auth.currentUser) {
      return sendEmailVerification(auth.currentUser);
    }
    return Promise.reject('No user logged in');
  },

  signInWithGoogle: async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) {
      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        fullName: firebaseUser.displayName || '',
        role: 'user',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      return newUser;
    }
    return userDoc.data() as User;
  },

  onAuthChange: (callback: (user: FirebaseUser | null) => void) => 
    onAuthStateChanged(auth, callback),

  getUserProfile: async (uid: string) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? (userDoc.data() as User) : null;
  }
};
