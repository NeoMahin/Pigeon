import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, firestore, storage } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function RightSidebar() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username);
          setProfileImage(userData.profileImageUrl);
        } else {
          console.log("No such document!");
        }
      } else {
        setUser(null);
        setUsername("");
        setProfileImage(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    try {
      const imageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(imageRef, file);
      const downloadUrl = await getDownloadURL(imageRef);

      await updateDoc(doc(firestore, "users", user.uid), {
        profileImageUrl: downloadUrl,
      });

      setProfileImage(downloadUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <aside className="w-1/5 bg-gray-100 p-4 overflow-y-auto">
      {user ? (
        <p className="text-lg font-semibold mb-4">Welcome, {username || user.email}</p>
      ) : (
        <p className="text-lg font-semibold mb-4">Welcome, Guest</p>
      )}
      
      <div className="profile-image-container mb-8">
        <label htmlFor="imageUpload">
          <img
            src={profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full cursor-pointer"
          />
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </div>

      <ul className="space-y-8">
        <li>
          <button onClick={handleSignOut} className="p-2 bg-gray-300 rounded">
            Sign out
          </button>
        </li>
      </ul>
    </aside>
  );
}
