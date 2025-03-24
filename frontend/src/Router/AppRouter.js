import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import TextToSpeechPage from "../Pages/TextToSpeech";
import SpeechToTextPage from "../Pages/SpeechToText";
import ProtectedRoute from "../utils/ProtectiveRoute";
import NotFoundPage from "../Pages/NotFoundPage";
import Register from "../Pages/Register";
import StudyRoomInterface from "../Pages/Room";
import Dashboard from "../Pages/Dashboard";
import socketService from "../services/socketService";
import Chat from "../Pages/chat";
import Settings from "../Pages/Settings";
import RoomCase from "../Pages/RoomCase";
import Overview from "../Pages/Overview";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="" element={<Overview />} />
          <Route path="room" element={<StudyRoomInterface />} />
          <Route path="room/:roomCode" element={<StudyRoomInterface />} />
          <Route path="roomcase" element={<RoomCase />} />

          <Route path="chat" element={<Chat />} />
          <Route path="tts" element={<TextToSpeechPage />} />
      <Route path="stt" element={<SpeechToTextPage />} />
          <Route path="settings" element={<Settings />} />
          {/* <Route path="profile" element={<ProfilePage />} />  */}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
