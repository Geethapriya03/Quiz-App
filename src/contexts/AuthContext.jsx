import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

// Import and initialize your Firebase app (make sure to replace with your Firebase config)
import firebaseApp from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signUp(email, password, userName) {
    const auth = getAuth(firebaseApp);

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: userName,
      });

      const user = auth.currentUser;
      setCurrentUser({ ...user });
    } catch (error) {
      throw error;
    }
  }

  async function signInWithGoogle() {
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      throw error;
    }
  }

  async function updateUserName(displayName) {
    const auth = getAuth(firebaseApp);

    try {
      await updateProfile(auth.currentUser, { displayName });
    } catch (error) {
      throw error;
    }
  }

  async function updateProfileImage(imageFile) {
    const auth = getAuth(firebaseApp);
    const storage = getStorage(firebaseApp);
    const fileRef = ref(storage, `${auth.currentUser.uid}/profile-image.jpg`);

    try {
      await uploadBytes(fileRef, imageFile);
      const photoURL = await getDownloadURL(fileRef);

      await updateProfile(auth.currentUser, { photoURL });
    } catch (error) {
      throw error;
    }
  }

  async function logIn(email, password) {
    const auth = getAuth(firebaseApp);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  async function logOut() {
    const auth = getAuth(firebaseApp);

    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }

  async function resetPassword(email) {
    const auth = getAuth(firebaseApp);

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  }

  const value = useMemo(
    () => ({
      currentUser,
      signUp,
      signInWithGoogle,
      updateUserName,
      updateProfileImage,
      logIn,
      logOut,
      resetPassword,
    }),
    [currentUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
