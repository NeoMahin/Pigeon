/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, addDoc, getFirestore } from "firebase/firestore";
import { auth } from "../firebase/firebase";

export default function Center({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (user && auth.currentUser) {
      const db = getFirestore();
      const messagesRef = collection(db, "messages");
  
      const conversationId = [auth.currentUser.uid, user.id].sort().join("_");
  
      const q = query(
        messagesRef,
        where("conversationId", "==", conversationId),
        orderBy("timestamp", "asc")
      );
  
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      });
  
      return () => unsubscribe();
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user && auth.currentUser) {
      const db = getFirestore();
      const currentTime = new Date();
  
      const conversationId = [auth.currentUser.uid, user.id].sort().join("_");
  
      try {
        await addDoc(collection(db, "messages"), {
          text: newMessage,
          sender: auth.currentUser.uid,
          participants: [auth.currentUser.uid, user.id],
          conversationId: conversationId,
          timestamp: currentTime,
        });
  
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  

  return (
    <main className="flex flex-col flex-1 p-4 overflow-y-auto">
      <div className="mb-4 border-b pb-2">
        <h1 className="text-2xl font-bold mb-1">
          {user ? user.username : "Select a chat"}
        </h1>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`py-2 px-4 rounded-md${
              message.sender === auth.currentUser.uid ? " self-end border-b-2" : " self-start border-b-2"
            }`}
          >
            <div className="flex items-center gap-2 pb-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                className="w-6 h-6 rounded-full"
                alt=""
              />
              <span className="font-bold">
                {message.sender === auth.currentUser.uid ? "You" : user.username}
              </span>
            </div>
            <p className="text-sm break-words">{message.text}</p>
            <p className="text-xs text-gray-500 mt-1 pb-2">
              {message.timestamp?.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-md p-2 outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Send
        </button>
      </div>
    </main>
  );
}
