import Sidebar from '../components/Sidebar';
import React, { useState } from 'react';

const EmployeeAdditionRequests = () => {
  const [activeItem, setActiveItem] = useState('requests');
  const [activeTab, setActiveTab] = useState('All');

  // Mock data for employee requests
  const requests = [
    {
      id: 1,
      employee: 'Ethan Harper',
      projectName: 'Project Alpha',
      date: '2024-07-15',
      status: 'Pending'
    },
    {
      id: 2,
      employee: 'Olivia Bennett',
      projectName: 'Project Beta',
      date: '2024-07-16',
      status: 'Pending'
    },
    {
      id: 3,
      employee: 'Noah Carter',
      projectName: 'Project Gamma',
      date: '2024-07-17',
      status: 'Pending'
    },
    {
      id: 4,
      employee: 'Ava Thompson',
      projectName: 'Project Delta',
      date: '2024-07-18',
      status: 'Pending'
    },
    {
      id: 5,
      employee: 'Liam Foster',
      projectName: 'Project Epsilon',
      date: '2024-07-19',
      status: 'Pending'
    }
  ];

  const tabs = ['All', 'Pending', 'Approved'];

  const handleViewClick = (requestId) => {
    console.log('Viewing request:', requestId);
  };

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
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm text-gray-900 font-medium">
                    {request.employee}
                  </div>
                  <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                    {request.projectName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {request.date}
                  </div>
                  <div>
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      {request.status}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => handleViewClick(request.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty state if no requests */}
          {requests.length === 0 && (
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