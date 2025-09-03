import Sidebar from '../components/Sidebar';
import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom"
const EmployeeAdditionRequests = () => {
  const [activeItem, setActiveItem] = useState('requests');
  const [activeTab, setActiveTab] = useState('All');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tabs = ['All', 'Pending', 'Approved', 'Rejected'];

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const query = activeTab !== 'All' ? `?status=${encodeURIComponent(activeTab)}` : '';
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/request-team-member${query}` , {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRequests(data.requests || []);
      } else {
        setError(data.message || 'Failed to load requests');
        setRequests([]);
      }
    } catch (e) {
      setError('Failed to load requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // const handleViewClick = (requestId) => {
  //   console.log('Viewing request:', requestId);
  // };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Employee Addition Requests</h1>
          <p className="text-gray-600">Manage and respond to employee requests to add other employees to projects</p>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-5 gap-4 px-6 py-4">
                <div className="text-sm font-semibold text-gray-700">Employee</div>
                <div className="text-sm font-semibold text-gray-700">Project Name</div>
                <div className="text-sm font-semibold text-gray-700">Date</div>
                <div className="text-sm font-semibold text-gray-700">Status</div>
                <div className="text-sm font-semibold text-gray-700">Action</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {loading && (
                <div className="px-6 py-8 text-center text-gray-500">Loading requests...</div>
              )}
              {!loading && error && (
                <div className="px-6 py-8 text-center text-red-600">{error}</div>
              )}
              {!loading && !error && requests.map((request) => {
                const sender = request.senderId;
                const employeeName = sender ? `${sender.firstName} ${sender.lastName}` : '—';
                const projectName = request.projectTitle || '—';
                const dateStr = request.createdAt ? new Date(request.createdAt).toLocaleDateString() : '—';
                const status = request.status || 'Pending';
                const statusClasses =
                  status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : status === 'Rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800';
                return (
                  <div
                    key={request._id}
                    className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm text-gray-900 font-medium">
                      {employeeName}
                    </div>
                    <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                      {projectName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {dateStr}
                    </div>
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusClasses}`}>
                        {status}
                      </span>
                    </div>
                    <div>
                      <Link to={`/employee-addition-requests/${request._id}`}>
                        <button
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Empty state if no requests */}
          {!loading && !error && requests.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H8a4 4 0 00-4 4v20a4 4 0 004 4h32a4 4 0 004-4V16a4 4 0 00-4-4h-12m-8 0V8a4 4 0 018 0v4m-8 12l4 4 6-6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">There are no employee addition requests at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAdditionRequests;