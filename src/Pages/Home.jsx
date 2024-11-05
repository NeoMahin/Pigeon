import Center from "../Components/Center";
import RightSidebar from "../Components/RightSidebar";
import Sidebar from "../Components/Sidebar";
import { useState } from "react";


export default function Home() {
    const [selectedUser, setSelectedUser] = useState(null);
  return (
    <div className="flex h-screen">
        <Sidebar onSelectUser={setSelectedUser}/>
        <Center user={selectedUser}/>
        <RightSidebar />
    </div>
  )
}
