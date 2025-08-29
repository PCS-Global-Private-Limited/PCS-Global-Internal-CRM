import React from "react";
import { User, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { checkAuth } from "../lib";

export default function UserDashboard() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth();
      if (!authStatus) {
        navigate("/login");
      }
    };
    
    verifyAuth();
  }, [navigate]);

  const tasks = [
    {
      id: 1,
      task: "Design landing page",
      project: "Website redesign",
      dueDate: "Jul 12, 2024",
      status: "In progress",
      statusColor: "bg-yellow-100 text-yellow-800",
      requestTeamMember: "Request",
    },
    {
      id: 2,
      task: "Develop user onboarding flow",
      project: "Mobile app development",
      dueDate: "Jul 15, 2024",
      status: "To do",
      statusColor: "bg-gray-100 text-gray-800",
      requestTeamMember: "Request",
    },
    {
      id: 3,
      task: "Create marketing campaign",
      project: "Product launch",
      dueDate: "Jul 20, 2024",
      status: "Completed",
      statusColor: "bg-green-100 text-green-800",
      requestTeamMember: "Request",
    },
  ];

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
    navigate(`/user-dashboard/project-details`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Alex
          </h2>
          <p className="text-gray-600">
            Here's what you need to work on today.
          </p>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">My tasks</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
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
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(task.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {task.task}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {task.project}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {task.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${task.statusColor}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to="/user-dashboard/request-team-member">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          {task.requestTeamMember}
                        </button>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleProjectDetails(task.id)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Start Work Button */}
        <div className="mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Start work
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tasks in Progress
                </p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">To Do</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
