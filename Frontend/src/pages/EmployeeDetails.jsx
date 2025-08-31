import Sidebar from '../components/Sidebar';
import React, { useState } from 'react';

const EmployeeDetails = () => {
  const [activeItem, setActiveItem] = useState('employees');

  // Employee data
  const employee = {
    id: 1,
    name: 'Ethan Harper',
    role: 'Software Engineer',
    avatar: '/api/placeholder/80/80', // Placeholder for employee photo
    personalInfo: {
      fullName: 'Ethan Harper',
      email: 'ethan.harper@example.com',
      phone: '(555) 123-4567',
      address: '123 Elm Street, Anytown, USA',
      dateOfBirth: 'January 15, 1990',
      gender: 'Male'
    },
    employmentDetails: {
      role: 'Software Engineer',
      department: 'Engineering',
      startDate: 'August 1, 2020',
      status: 'Active'
    },
    additionalInfo: {
      emergencyContact: 'Olivia Harper (Spouse), (555) 987-6543',
      languages: 'English, Spanish',
      projects: 'Project Alpha, Project Beta',
      achievements: 'Employee of the Month (June 2022)',
      notes: 'Highly motivated and skilled engineer'
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Employee Details</h1>
          <p className="text-gray-600">View employee details, roles, and other relevant information</p>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {/* Employee Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-6">
              {/* Profile Image */}
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              {/* Basic Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
                <p className="text-blue-600 font-medium">{employee.role}</p>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-sm text-gray-900">{employee.personalInfo.fullName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-sm text-gray-900">{employee.personalInfo.phone}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <p className="text-sm text-gray-900">{employee.personalInfo.dateOfBirth}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">{employee.personalInfo.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-sm text-gray-900">{employee.personalInfo.address}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <p className="text-sm text-gray-900">{employee.personalInfo.gender}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Employment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <p className="text-sm text-gray-900">{employee.employmentDetails.role}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <p className="text-sm text-gray-900">{employee.employmentDetails.startDate}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <p className="text-sm text-gray-900">{employee.employmentDetails.department}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {employee.employmentDetails.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <p className="text-sm text-gray-900">{employee.additionalInfo.emergencyContact}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                <p className="text-sm text-gray-900">{employee.additionalInfo.languages}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Projects</label>
                <p className="text-sm text-gray-900">{employee.additionalInfo.projects}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
                <p className="text-sm text-gray-900">{employee.additionalInfo.achievements}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <p className="text-sm text-gray-900">{employee.additionalInfo.notes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;