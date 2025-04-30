import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import TextToSpeechPage from "../Pages/TextToSpeech";
import SpeechToTextPage from "../Pages/SpeechToText";
import NotFoundPage from "../Pages/NotFoundPage";
import Register from "../Pages/Register";
import StudyRoomInterface from "../Pages/Room";
import Dashboard from "../Pages/Dashboard";
import Chat from "../Pages/chat";
import Settings from "../Pages/Settings";
import RoomCase from "../Pages/RoomCase";
import Overview from "../Pages/Overview";
import Admin from "../Pages/Admin";

const ProtectedRoute = ({ children }) => {
  const userKey = localStorage.getItem("user");
  return userKey ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Overview />} />
          <Route
            path="room"
            element={
              <ProtectedRoute>
                <StudyRoomInterface />
              </ProtectedRoute>
            }
          />
          <Route
            path="room/:roomCode"
            element={
              <ProtectedRoute>
                <StudyRoomInterface />
              </ProtectedRoute>
            }
          />
          <Route
            path="roomcase"
            element={
              <ProtectedRoute>
                <RoomCase />
              </ProtectedRoute>
            }
          />
          <Route
            path="chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="tts"
            element={
              <ProtectedRoute>
                <TextToSpeechPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="stt"
            element={
              <ProtectedRoute>
                <SpeechToTextPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
