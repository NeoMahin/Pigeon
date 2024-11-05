/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, getFirestore } from "firebase/firestore";
import { debounce } from "lodash";
import { auth } from "../firebase/firebase";

export default function Sidebar({ onSelectUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [chatUsers, setChatUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async (searchTerm) => {
      try {
        const db = getFirestore();
        const usersRef = collection(db, "users");

        let q;
        if (searchTerm) {
          q = query(
            usersRef,
            where("name", ">=", searchTerm),
            where("name", "<", searchTerm + "\uf8ff")
          );
        } else {
          q = query(usersRef);
        }

        const querySnapshot = await getDocs(q);


        const currentUserUID = auth.currentUser ? auth.currentUser.uid : null;

        const usersData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.id !== currentUserUID);

        setChatUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const debouncedFetchUsers = debounce(fetchUsers, 300);
    debouncedFetchUsers(searchTerm);

    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [searchTerm]);

  return (
    <aside className="w-1/5 bg-gray-800 text-white p-4 overflow-y-auto">
      <div className="gap-4 flex items-center bg-white rounded">
        <div className="pl-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        <input
          type="search"
          placeholder="Search by username..."
          className="w-full py-2 outline-none text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2 className="text-lg font-semibold mb-4 pt-2">Chats</h2>
      <ul className="space-y-2">
        {chatUsers.length > 0 ? (
          chatUsers.map((user) => (
            <li
              key={user.id}
              className="p-2 bg-gray-700 rounded"
              onClick={() => onSelectUser(user)}
            >
              <h3 className="font-semibold">{user.username || "Unknown User"}</h3>
              <p className="text-xs text-gray-400">{user.lastMessage || "No message yet"}</p>
            </li>
          ))
        ) : (
          <li className="p-2 text-gray-400">No results found</li>
        )}
      </ul>
    </aside>
  );
}
