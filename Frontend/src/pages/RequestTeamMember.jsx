import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Search, Check, Mail, Phone } from "lucide-react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { checkAuth } from "../lib";

export default function RequestTeamMember() {
  const [project, setProject] = useState("");
  const [memberType, setMemberType] = useState("");
  const [reason, setReason] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState("");
  const { projectId, projectTitle } = useParams();
  const [employee, setEmployee] = useState();
  const [senderId, setSenderId] = useState();

  const verifyAuth = async () => {
    const authStatus = await checkAuth();
    if (authStatus.role === "Manager") {
      navigate("/manager-dashboard");
    }
    setSenderId(authStatus.userId);
  };

  const fetchProjectDetails = async () => {
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
      } else {
        console.error("Failed to fetch project details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/all-employees`,
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
        setEmployee(data.employees);
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
    verifyAuth();
    if (projectId) {
      fetchProjectDetails();
      fetchEmployee();
    }
  }, []);

  const filterMembers = (members) => {
    return members.filter(
      (member) =>
        member._id !== senderId &&
        (`${member.firstName} ${member.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.branch.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId);
      } else if (prev.length < 2) {
        return [...prev, memberId];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      senderId,
      projectTitle,
      memberType,
      reason,
      selectedMembers,
    });
    alert("Request submitted successfully!");
    setMemberType("");
    setReason("");
    setSelectedMembers([]);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Request Team Member
          </h2>
        </div>

        <div className="space-y-8">
          {/* Request Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Request Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  {projectTitle}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Member Type *
                </label>
                <input
                  type="text"
                  value={memberType}
                  onChange={(e) => setMemberType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Software Engineer, UX Designer"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Request *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please provide details about why you need this team member and what they will be working on..."
                required
              />
            </div>
          </div>

          {/* Available Team Members */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Available Team Members
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employee &&
                filterMembers(employee).map((member) => (
                  <div
                    key={member._id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedMembers.includes(member._id)
                        ? "border-blue-500 bg-blue-50"
                        : selectedMembers.length >= 2
                        ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleMemberSelection(member._id)}
                  >
                    {selectedMembers.includes(member._id) && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center mb-3">
                      <img
                        src={
                          member.avatar ||
                          "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(
                              `${member.firstName} ${member.lastName}`
                            )
                        }
                        alt={`${member.firstName} ${member.lastName}`}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {member.designation}
                        </p>
                        <p className="text-xs text-gray-500">{member.branch}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      {member.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {member.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {member.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{member.skills.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">No skills added</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 text-gray-500 text-sm">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {selectedMembers.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>{selectedMembers.length}</strong> of 2 team members
                  selected
                </p>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-4">
              If no available team members match your criteria, you can still
              submit this request.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={!projectTitle || !memberType || !reason}
            >
              Submit Request
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
