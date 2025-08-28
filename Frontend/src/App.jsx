import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ManagerDashboard from "./pages/ManagerDashboard";
import CreateTask from "./components/CreateTask";
import AssignTask from "./components/AssignTask";
import Task from "./pages/Task";
import Attendance from "./pages/Attendance";

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
  const [count, setCount] = useState(0);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
