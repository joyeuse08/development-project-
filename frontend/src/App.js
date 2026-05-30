import WeeklyLogSubmission from "./pages/WeeklyLogSubmission";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Issues from "./pages/Issues";
import InternshipPlacement from "./pages/InternshipPlacement";
import WeeklyLog from "./pages/WeeklyLog";
import SupervisorFeedback from "./pages/SupervisorFeedback";
import AcademicFeedback from "./pages/AcademicFeedback";
import WeightedScore from "./pages/WeightedScore";
import Notifications from "./pages/Notifications";
import { useAuth } from "./context/AuthContext";

import "./App.css";

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/submit_weekly_log" element={<WeeklyLogSubmission />} />
        <Route
          path="/weekly-logs"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <WeeklyLog />
            </PrivateRoute>
          }
        />
        <Route
          path="/academic-feedback"
          element={
            <PrivateRoute allowedRoles={["academic_supervisor", "student"]}>
              <AcademicFeedback />
            </PrivateRoute>
          }
        />
        <Route
          path="/supervisor-feedback"
          element={
            <PrivateRoute allowedRoles={["workplace_supervisor", "student"]}>
              <SupervisorFeedback />
            </PrivateRoute>
          }
        />
        <Route
          path="/internship-placement"
          element={
            <PrivateRoute allowedRoles={["student", "admin"]}>
              <InternshipPlacement />
            </PrivateRoute>
          }
        />
        <Route
          path="/weighted-score"
          element={
            <PrivateRoute allowedRoles={["admin", "academic_supervisor"]}>
              <WeightedScore />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
