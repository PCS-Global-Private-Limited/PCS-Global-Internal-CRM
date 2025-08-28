import React, { useState } from 'react';
import { 
  ChevronDown,
  Search,
  User
} from 'lucide-react';

// Assign Task Component
const AssignTask = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('Ethan Walker');
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    { id: 1, name: 'Website Redesign' },
    { id: 2, name: 'Mobile App Development' },
    { id: 3, name: 'Marketing Campaign' },
    { id: 4, name: 'Database Migration' },
    { id: 5, name: 'UI/UX Improvements' }
  ];

  const employees = [
    { id: 1, name: 'Ethan Walker', avatar: 'EW' },
    { id: 2, name: 'Olivia Bennett', avatar: 'OB' },
    { id: 3, name: 'Noah Foster', avatar: 'NF' },
    { id: 4, name: 'Ava Coleman', avatar: 'AC' },
    { id: 5, name: 'Liam Harper', avatar: 'LH' }
  ];

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProjectData = projects.find(project => project.id.toString() === selectedProject);

  const handleAssign = () => {
    if (selectedProject && selectedEmployee) {
      alert(`Task assigned to ${selectedEmployee} for project: ${selectedProjectData?.name}`);
    } else {
      alert('Please select both project and employee');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">TeamLog</h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                  Dashboard
                </a>
                <a href="#" className="text-gray-900 bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">
                  Tasks
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                  Requests
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                  Attendance
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                  Reports
                </a>
              </div>
            </div>

            {/* Profile */}
            <div className="ml-4 flex items-center md:ml-6">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Assign Task</h1>
          <p className="text-gray-600 mt-2">Select a project and assign it to an employee.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Select Project */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Project</h2>
            <div className="relative">
              <div
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all flex items-center justify-between"
              >
                <span className={selectedProjectData ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedProjectData ? selectedProjectData.name : 'Select'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isProjectDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => {
                        setSelectedProject(project.id.toString());
                        setIsProjectDropdownOpen(false);
                      }}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-gray-900">{project.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Select Employee */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Employee</h2>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Employee List */}
            <div className="space-y-3 mb-8">
              {filteredEmployees.map((employee) => (
                <label
                  key={employee.id}
                  className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="employee"
                    value={employee.name}
                    checked={selectedEmployee === employee.name}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-4 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium mr-4">
                      {employee.avatar}
                    </div>
                    <span className="text-gray-900 font-medium">{employee.name}</span>
                  </div>
                </label>
              ))}
            </div>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No employees found matching your search.</p>
              </div>
            )}

            {/* Assign Button */}
            <div className="flex justify-end">
              <button
                onClick={handleAssign}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;