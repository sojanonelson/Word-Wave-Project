import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Mic,
  Users,
  BookOpen,
  Settings,
  Volume2,
  Menu,
  X,
  Wand2,
} from 'lucide-react';
import RoomList from '../components/RoomList';
import TTS from '../Pages/TextToSpeech'; // Import TTS component
import STT from '../Pages/SpeechToText'; // Import STT component
import { Link, useNavigate } from 'react-router-dom';
import socketService from '../services/socketService';



const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeFeature, setActiveFeature] = useState(null); // Track active feature
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false); 
  const navigate = useNavigate();
  const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('123');
  const [roomCode, setRoomCode] = useState('867016');
  console.log("Modal",isCreateRoomModalOpen)

  const rooms = [
    { id: 1, name: "Mathematics Study Group", members: 8, active: true },
    { id: 2, name: "Physics Discussion", members: 5, active: true },
    { id: 3, name: "Literature Analysis", members: 3, active: false },
  ];

  useEffect(() => {
    // Connect to the socket server when component mounts
    socketService.connect();

    return () => {
        // Disconnect when the component unmounts
        socketService.disconnect();
    };
}, []);

  const handleCreateRoom = () => {
    setIsLoading(true);
    // Simulate a room creation process (e.g., make API call here)
    setTimeout(() => {
      setIsLoading(false);
      setIsCreateRoomModalOpen(false);
      alert('Room created successfully');
    }, 2000); // Simulate a loading time
  };

  const handleJoinRoom = async () => {
    setIsLoading(true);
    try{

    
      console.log("Response form join:");
    }catch(error){
      console.log(error)
    }
    setTimeout(() => {
      setIsLoading(false);
      setIsJoinRoomModalOpen(false);
   
    }, 2000); // Simulate a loading time
  };

  // Function to handle feature selection
  const handleFeatureClick = (feature) => {
    setActiveFeature(feature);
  };

  const openCreateRoomModal = () => {
    setIsJoinRoomModalOpen(false);
    setIsCreateRoomModalOpen(true);
  };

  const openJoinoomModal = () => {
    setIsCreateRoomModalOpen(false)
    setIsJoinRoomModalOpen(true);
  };

  // Function to close the modal
  const closeCreateRoomModal = () => {
    setIsCreateRoomModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`bg-violet-800 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
  <div className="p-4 flex justify-between items-center">
    <h1 className={`font-bold ${isSidebarOpen ? 'block' : 'hidden'}`}>Word Wave</h1>
    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-violet-700 rounded-lg">
      {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  </div>

  <nav className="mt-8">
    <div className="px-4 space-y-2">
      {/* Highlighted Join Rooms Button */}
      <button onClick={openJoinoomModal} className="flex items-center space-x-3 w-full p-3 bg-violet-600 hover:bg-violet-700 rounded-lg transition-all duration-300 shadow-md transform hover:scale-105">
        <MessageSquare size={20} />
        {isSidebarOpen && <span className="font-semibold text-white">Join Rooms</span>}
      </button>

      <button className="flex items-center space-x-3 w-full p-3 hover:bg-violet-700 rounded-lg">
        <MessageSquare size={20} />
        {isSidebarOpen && <span>Chat Rooms</span>}
      </button>
      <button className="flex items-center space-x-3 w-full p-3 hover:bg-violet-700 rounded-lg">
        <Users size={20} />
        {isSidebarOpen && <span>Members</span>}
      </button>
      <button className="flex items-center space-x-3 w-full p-3 hover:bg-violet-700 rounded-lg">
        <BookOpen size={20} />
        {isSidebarOpen && <span>Study Material</span>}
      </button>
      <button className="flex items-center space-x-3 w-full p-3 hover:bg-violet-700 rounded-lg">
        <Settings size={20} />
        {isSidebarOpen && <span>Settings</span>}
      </button>
    </div>
  </nav>
</div>


      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b p-4">
          <div className="flex items-center">
            <button onClick={()=>setActiveFeature(null)}>
            <h2 className="text-2xl font-semibold text-violet-800">Dashboard</h2></button>
           
            <div className="ml-3 px-3 py-1 bg-violet-100 rounded-full text-violet-600 text-sm font-medium">
              <Wand2 className="inline-block w-4 h-4 mr-1" />
              AI Tools Available
            </div>
          </div>
        </header>

        <main className="p-3">
          {/* AI Features Section */}
          {!activeFeature && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {/* Text to Speech Card */}
                <div
                  className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-6 border-2 border-violet-100 hover:border-violet-300 transition-all cursor-pointer"
                  onClick={() => handleFeatureClick('tts')}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-violet-100 rounded-lg">
                      <Volume2 size={24} className="text-violet-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-violet-800">Text to Speech</h4>
                      <p className="text-violet-600">Convert your text into natural speech</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Transform written content into clear, natural-sounding speech. Perfect for learning pronunciation and listening practice.
                  </p>
                  <button className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition-colors">
                    Start Converting
                  </button>
                </div>

                {/* Speech to Text Card */}
                <div
                  className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-6 border-2 border-violet-100 hover:border-violet-300 transition-all cursor-pointer"
                  onClick={() => handleFeatureClick('stt')}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-violet-100 rounded-lg">
                      <Mic size={24} className="text-violet-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-violet-800">Speech to Text</h4>
                      <p className="text-violet-600">Convert your speech into text</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Transform your voice into written text instantly. Great for taking notes, Great for transcribing discussions, and more.
                  </p>
                  <button className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition-colors">
                    Start Recording
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Render TTS or STT Component */}
          {activeFeature === 'tts' && <TTS onBack={() => setActiveFeature(null)} />}
          {activeFeature === 'stt' && <STT onBack={() => setActiveFeature(null)} />}

          {/* Room List (Optional) */}
          <RoomList rooms={rooms} onCreateRoomClick={openCreateRoomModal} />
          {isCreateRoomModalOpen && (
           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
           <div className="bg-white p-8 rounded-lg space-y-8 shadow-lg min-w-[30%] min-h-[40%]">
             <h3 className="text-2xl font-semibold text-violet-800 mb-4">Create Room</h3>
             <input
               type="text"
               placeholder="Room Name"
               className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
               value={roomName}
               onChange={(e) => setRoomName(e.target.value)}
             />
             <input
               type="password"
               placeholder="Room Password"
               className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
               value={roomPassword}
               onChange={(e) => setRoomPassword(e.target.value)}
             />
             <div className="flex justify-between items-center">
               <button
                 className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition-colors"
                 onClick={handleCreateRoom}
               >
                 {isLoading ? 'Creating Room...' : 'Create Room'}
               </button>
               <button
                 className="ml-4 text-violet-600"
                 onClick={() => setIsCreateRoomModalOpen(false)}
               >
                 Cancel
               </button>
             </div>
           </div>
         </div>
       )}
        {isJoinRoomModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold text-violet-800 mb-4">Join Room</h3>
            <input
              type="text"
              placeholder="Room Code"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <input
              type="password"
              placeholder="Room Password"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <button
                className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition-colors"
                onClick={handleJoinRoom}
              >
                {isLoading ? 'Joining Room...' : 'Join Room'}
              </button>
              <button
                className="ml-4 text-violet-600"
                onClick={() => setIsJoinRoomModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;