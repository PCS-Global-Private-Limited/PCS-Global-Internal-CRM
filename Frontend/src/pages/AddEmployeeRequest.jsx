import Sidebar from '../components/Sidebar';
import React, { useState } from 'react';

const AddEmployeeRequest = () => {
  const [activeItem, setActiveItem] = useState('requests');

  // Request data
  const requestData = {
    id: 1,
    requester: 'Ethan Harper',
    date: 'Jul 15, 2024',
    requestDetails: {
      employeeToAdd: 'Sophia Carter',
      department: 'Sales',
      project: 'Project Alpha',
      reason: 'Need additional support for upcoming marketing campaign'
    },
    employeeDetails: {
      name: 'Ethan Harper',
      department: 'Marketing',
      position: 'Marketing Manager',
      email: 'ethan.harper@example.com',
      phone: '+1-555-987-6543'
    }
  };

  const handleApprove = () => {
    console.log('Request approved:', requestData.id);
    // Handle approval logic here
  };

  const handleReject = () => {
    console.log('Request rejected:', requestData.id);
    // Handle rejection logic here
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span className="hover:text-gray-900 cursor-pointer">Requests</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{requestData.requester}</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Add employee to project</h1>
          <p className="text-gray-600">{requestData.requester} • {requestData.date}</p>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {/* Request Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Request Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee to Add</label>
                  <p className="text-sm text-gray-900">{requestData.requestDetails.employeeToAdd}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <p className="text-sm text-gray-900">{requestData.requestDetails.department}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <p className="text-sm text-gray-900">{requestData.requestDetails.project}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
              <p className="text-sm text-gray-900 leading-relaxed">{requestData.requestDetails.reason}</p>
            </div>
          </div>

          {/* Employee Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Employee Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <p className="text-sm text-gray-900">{requestData.employeeDetails.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <p className="text-sm text-gray-900">{requestData.employeeDetails.position}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <p className="text-sm text-gray-900">{requestData.employeeDetails.phone}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <p className="text-sm text-gray-900">{requestData.employeeDetails.department}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">{requestData.employeeDetails.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleReject}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reject
            </button>
            <button
              onClick={handleApprove}
              className="px-6 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeRequest;