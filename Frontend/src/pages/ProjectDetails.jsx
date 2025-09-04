import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  User,
  Calendar,
  Clock,
  MessageCircle,
  Paperclip,
  Send,
  Upload,
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function ProjectDetails() {
  const [comment, setComment] = useState("");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id: projectId } = useParams();
  const [hasStarted, setHasStarted] = useState(false);

  const fetchProjectDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/task/project-details/${projectId}`,
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
      if (data.success) {
        setProject(data.project);
        setHasStarted(data.project.overallStatus === "in progress");
        console.log(data);
      } else {
        console.error("Failed to fetch project details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const comments = [];

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      // Handle comment submission
      console.log("New comment:", comment);
      setComment("");
    }
  };

  const startProject = async () => {
    // OPTIONAL backend update (uncomment when you have an endpoint)
    await fetch(`${import.meta.env.VITE_API_URL}/api/task/start-task`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: projectId }),
    });

    setHasStarted(true);
    setProject((p) => (p ? { ...p, overallStatus: "in progress" } : p));
    alert("Project started!");
  };

  const endProject = async () => {
    const ok = window.confirm("Are you sure you want to end this project?");
    if (!ok) return;

    // OPTIONAL backend update (uncomment when you have an endpoint)
    await fetch(`${import.meta.env.VITE_API_URL}/api/task/end-task`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: projectId }),
    });

    setHasStarted(false);
    setProject((p) => (p ? { ...p, overallStatus: "completed" } : p));
    alert("Project ended!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex justify-center items-center">
                <p>Loading...</p>
              </div>
            ) : project ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {project.title}
                  </h2>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        project.overallStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : project.overallStatus === "in progress"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      {project.overallStatus.charAt(0).toUpperCase() +
                        project.overallStatus.slice(1)}
                    </span>

                    {/* Start / End button logic */}
                    {project.overallStatus === "completed" ? (
                      <button
                        type="button"
                        disabled
                        className="px-4 py-2 rounded-md text-white text-sm font-medium bg-gray-300 cursor-not-allowed"
                        title="Project already completed"
                      >
                        Completed
                      </button>
                    ) : hasStarted ? (
                      <button
                        type="button"
                        onClick={endProject}
                        className="px-4 py-2 rounded-md text-white text-sm font-medium bg-red-600 hover:bg-red-700"
                        title="End Project"
                      >
                        End Project
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startProject}
                        className="px-4 py-2 rounded-md text-white text-sm font-medium bg-green-600 hover:bg-green-700"
                        title="Start Project"
                      >
                        Start Project
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center text-sm text-gray-600 mb-6">
                    <Calendar className="w-4 h-4 mr-2" />
                    Due by{" "}
                    {new Date(project.deadline).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Completion Progress
                      </span>
                      <span className="text-sm text-gray-600">
                        {project.statistics.completionPercentage}% completed
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${project.statistics.completionPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Task Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Task Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Created By
                      </label>
                      <p className="text-gray-900">
                        {project.createdBy.fullName} ({project.createdBy.role})
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <p className="text-gray-900">{project.description}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          project.overallStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : project.overallStatus === "in progress"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.overallStatus.charAt(0).toUpperCase() +
                          project.overallStatus.slice(1)}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timeline
                      </label>
                      <p
                        className={`text-sm ${
                          project.timeline.deadlineStatus === "overdue"
                            ? "text-red-600"
                            : project.timeline.deadlineStatus === "urgent"
                            ? "text-orange-600"
                            : "text-gray-600"
                        }`}
                      >
                        {project.timeline.isOverdue ? "Overdue by " : "Due in "}
                        {Math.abs(project.timeline.daysUntilDeadline)} days
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p>No project details found.</p>
              </div>
            )}

            {/* Attachments */}
            {project && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Attachments ({project.documents.count})
                </h3>

                <div className="space-y-2">
                  {project.documents.urls.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <Paperclip className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900 flex-1">
                        {decodeURIComponent(url.split("/").pop())}
                      </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Comments
              </h3>

              <div className="space-y-4 mb-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">
                          {comment.author}
                        </span>
                        <span className="text-xs text-gray-500">
                          {comment.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleCommentSubmit}
                      disabled={!comment.trim()}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Team Members */}
            {project && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Team Members ({project.statistics.totalAssignees})
                </h3>

                <div className="space-y-3">
                  {project.assignees.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {member.fullName}
                        </p>
                        <div className="flex items-center mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              member.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : member.status === "in progress"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {member.status.charAt(0).toUpperCase() +
                              member.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
