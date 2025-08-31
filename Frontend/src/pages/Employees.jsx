import Sidebar from '../components/Sidebar';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Employees = () => {
  const [activeItem, setActiveItem] = useState('employees');
  const [activeTab, setActiveTab] = useState('All');

  // Employee data
  const employees = [
    {
      id: 1,
      name: 'Ethan Harper',
      role: 'Software Engineer',
      department: 'Engineering',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Olivia Bennett',
      role: 'Product Manager',
      department: 'Product',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Noah Carter',
      role: 'UX Designer',
      department: 'Design',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Ava Thompson',
      role: 'Marketing Specialist',
      department: 'Marketing',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Liam Foster',
      role: 'Sales Representative',
      department: 'Sales',
      status: 'Active'
    }
  ];

  const tabs = ['All', 'Active', 'Inactive'];

  // Filter employees based on active tab
  const filteredEmployees = employees.filter(employee => {
    if (activeTab === 'All') return true;
    return employee.status === activeTab;
  });

  const handleViewClick = (employeeId) => {
    console.log('Viewing employee:', employeeId);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Employees</h1>
          <p className="text-gray-600">View employee details, roles, and other relevant information</p>
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
                <div className="text-sm font-semibold text-gray-700">Role</div>
                <div className="text-sm font-semibold text-gray-700">Department</div>
                <div className="text-sm font-semibold text-gray-700">Status</div>
                <div className="text-sm font-semibold text-gray-700">Action</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                 <Link to="/employee-details"> 
                    <div className="text-sm text-gray-900 font-medium hover:underline hover:text-blue-700">
                      {employee.name}
                    </div>
                  </Link>
                  <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                    {employee.role}
                  </div>
                  <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    {employee.department}
                  </div>
                  <div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      employee.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {employee.status}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => handleViewClick(employee.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty state if no employees */}
          {filteredEmployees.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5m-2 3v-3m-8.5 3.5a7.5 7.5 0 1115 0c0 .85-.15 1.67-.43 2.43l2.36 2.36a1 1 0 11-1.42 1.42l-2.36-2.36A7.5 7.5 0 0110.5 23.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-600">There are no employees matching the selected criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;