import React, { useState, useEffect, useId } from "react";
import { User, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { checkAuth } from "../lib";
import axios from "axios";

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "In progress":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState(false);
  const [checkOut, setCheckOut] = useState(false);

  const verifyAuth = async () => {
    const authStatus = await checkAuth();
    if (authStatus.role === "Manager") {
      navigate("/manager-dashboard");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // en-GB gives dd/mm/yyyy
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  const checkCheckInStatus = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/attendance/check-in-status`,
        {
          withCredentials: true, // ✅ Important for cookies
        }
      );

      if (data.checkedIn) {
        alert("✅ User is already checked-in!");
        setCheckIn(true);
      } else {
        alert("ℹ️ User has not checked-in yet!");
        setCheckIn(false);
      }
    } catch (error) {
      console.error("Error checking status:", error);
      alert("❌ Failed to check status");
    }
  };

  const checkCheckOutStatus = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/attendance/check-out-status`,
        {
          withCredentials: true, // ✅ Important for cookies
        }
      );

      if (data.checkedOut) {
        alert("✅ User is already checked-out!");
        setCheckOut(true);
      } else {
        alert("ℹ️ User has not checked-out yet!");
        setCheckOut(false);
      }
    } catch (error) {
      console.error("Error checking status:", error);
      alert("❌ Failed to check status");
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/task/my-tasks`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setTasks(Array.isArray(data.tasks) ? data.tasks : []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    fetchTasks();
    checkCheckInStatus()
    checkCheckOutStatus()
  }, []);

  useEffect(() => {
    console.log("Tasks updated:", tasks);
  }, [tasks]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "In progress":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleProjectDetails = (id) => {
    navigate(`/user-dashboard/project-details/${id}`);
  };

  const handleCheckIn = async () => {
    try {
      // setLoading(true);
      // setMessage("");

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/attendance/checkin`, {}, {
        withCredentials: true, // ✅ Send cookies automatically
      });

      console.log("data:", data);


      if (data.success) {
        // setMessage("✅ " + data.message);
        alert("Checked in successfully");
        setCheckIn(true);
      } else {
        // setMessage("⚠️ " + data.message);
        alert("⚠️ " + data.message);
        setCheckIn(false);
      }
    } catch (error) {
      // setMessage("❌ " + (error.response?.data?.message || "Something went wrong"));
      alert("❌ " + (error.response?.data?.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Check-Out
  const handleCheckOut = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/attendance/checkout`, {}, // No body needed if just checking out
        {
          withCredentials: true, // ✅ Send cookies automatically
        })

      console.log("data:", data);

      if (data.success) {
        alert("Checked out successfully");
        setCheckOut(true);
        setCheckIn(false);
      } else {
        alert("⚠️ " + data.message);
        // If checkout failed, keep checkIn as true and checkOut as false
        setCheckIn(true);
        setCheckOut(false);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleRequestTeamMenber = (id,title) => {
    navigate(`/user-dashboard/request-team-member/${id}/${title}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user ? `${user.firstName}` : "User"}
          </h2>
          <p className="text-gray-600">
            Here's what you need to work on today.
          </p>
          {loading && (
            <div className="text-gray-500">Loading your tasks...</div>
          )}
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">My tasks</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Team Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project Details
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(tasks) && tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr
                      key={task._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(task.myStatus)}
                            {task.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(task.deadline)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            task.myStatus
                          )}`}
                        >
                          {task.myStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleRequestTeamMenber(task._id, task.title)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Request
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleProjectDetails(task._id)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Start Work Button */}
        {
          checkOut ?
            <div className="mt-8">Your attendance is already marked for today</div>
            : checkIn ?
              <div className="mt-8">
                <button onClick={handleCheckOut} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Check-Out
                </button>
              </div>
              :
              <div className="mt-8">
                <button onClick={handleCheckIn} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Check-In
                </button>
              </div>
        }
      </main>
    </div>
  );
}
