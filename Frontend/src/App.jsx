import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import UserDashboard from "./pages/UserDashboard";
import RequestTeamMember from "./pages/RequestTeamMember";
import ProjectDetails from "./pages/ProjectDetails";
import ManagerDashboard from "./pages/ManagerDashboard";
import CreateTask from "./components/CreateTask";
import AssignTask from "./components/AssignTask";
import Task from "./pages/Task";
import Attendance from "./pages/Attendance";
import UserProfile from "./pages/UserProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/user-dashboard",
    element: <UserDashboard />,
  },
  {
    path: "/user-dashboard/profile",
    element: <UserProfile />,
  },
  {
    path: "/user-dashboard/request-team-member",
    element: <RequestTeamMember />,
  },
  {
    path: "/user-dashboard/project-details",
    element: <ProjectDetails />,
  },
  {
    path: "/manager-dashboard",
    element: <ManagerDashboard />,
  },
  {
    path: "/create-task",
    element: <CreateTask />,
  },
  {
    path: "/assign-task",
    element: <AssignTask />,
  },
  {
    path: "/task",
    element: <Task />,
  },
  {
    path: "/attendance",
    element: <Attendance />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
