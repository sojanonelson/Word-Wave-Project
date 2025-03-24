import React, { useEffect, useState } from "react";
import { MessageSquare, Settings, Menu, X,PanelsTopLeft, LibraryBig } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import socketService from "../services/socketService";
import { getUserResponse } from "../services/generalService";
import defaultImage from '../Data/profile.png'
import { getUserById } from "../services/userService";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [members, setMembers] = useState([]);
 const [user, setUser] = useState()
 const [userID, setUserID] = useState('')

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const userID = localStorage.getItem("userID");
      setUserID(userID)
      if (userID) {
        const userData = await getUserById(userID);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  fetchUser();

  const roomCode = localStorage.getItem("roomCode");
  if (roomCode && userID) {
    socketService.emit("join-room", {
      roomCode,
      password: "1234",
      userID,
    });
  }

  const handleMemberUpdate = (memberList) => {
    setMembers(memberList);
  };

  socketService.on("updateMembers", handleMemberUpdate);
  socketService.emit("ping", { message: "Hello server" }, (response) => {
    console.log("Server response:", response);
  });

  return () => {
    if (roomCode) {
      socketService.emit("leave-room", { roomCode, userID });
    }
    socketService.off("updateMembers", handleMemberUpdate);
  };
}, []);

// console.log(user)


  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`bg-violet-800 text-white ${isSidebarOpen ? "w-64" : "w-20"} transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 flex justify-between items-center">
          <Link 
          to='/'>
          <h1 className={isSidebarOpen ? "block text-xl font-bold pl-4" : "hidden"}>Word Wave</h1>
          </Link>
          
          <button 
            className={!isSidebarOpen ? "flex justify-center items-center pl-2" : "p-0"} 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={30} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-8 px-4 space-y-2">
        <Link to="/dashboard/" className="w-full p-3 bg-violet-600 rounded-lg flex items-center gap-2">
            <PanelsTopLeft size={20} /> {isSidebarOpen && <span>Overview</span>}
          </Link>
          <Link to="/dashboard/room" className="w-full p-3 bg-violet-600 rounded-lg flex items-center gap-2">
      
            <LibraryBig size={20} /> {isSidebarOpen && <span>Room</span>}
          </Link>
          <Link to="/dashboard/settings" className="w-full p-3 bg-violet-600 rounded-lg flex items-center gap-2">
            <Settings size={20} /> {isSidebarOpen && <span>Settings</span>}
          </Link>
         
        </nav>

        {user && (  <div className="mt-auto p-4 border-t border-violet-700">
          <div className={`flex items-center gap-3 ${isSidebarOpen ? "" : "justify-center"}`}>
            <img 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              src={user.image || defaultImage} 
              alt={user.name} 
              className="w-10 h-10 cursor-pointer rounded-full object-cover border-2 border-violet-400"
            />
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <h3 className="font-medium truncate">{user.name}</h3>
                <p className="text-sm text-violet-300 truncate">{user.email}</p>
              </div>
            )}
          </div>
        </div>)}
      
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet context={{ setIsSidebarOpen }} />
      </div>
    </div>
  );
};

export default Dashboard;