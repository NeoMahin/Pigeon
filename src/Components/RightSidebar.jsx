import { NavLink } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function RightSidebar() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        } else {
          console.log("No such document!");
        }
      } else {
        setUser(null);
        setUsername("");
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

  return (
    <aside className="w-1/5 bg-gray-100 p-4 overflow-y-auto">
      {user ? (
        <p className="text-lg font-semibold mb-4">Welcome, {username || user.email}</p>
      ) : (
        <p className="text-lg font-semibold mb-4">Welcome, Guest</p>
      )}
      <ul className="space-y-8">
        <li>
          <NavLink className="p-2 bg-gray-300 rounded" to="/profile">Profile</NavLink>
        </li>
        <li>
          <NavLink className="p-2 bg-gray-300 rounded" to="/settings">Settings</NavLink>
        </li>
        <li>
          <NavLink onClick={handleSignOut} className="p-2 bg-gray-300 rounded">Sign out</NavLink>
        </li>
      </ul>
    </aside>
  );
}
