import Sidebar from '../components/Sidebar';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, User } from 'lucide-react';
import axios from 'axios';

const Employees = () => {
  const [activeItem, setActiveItem] = useState('employees');
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [activeTab, setActiveTab] = useState('All');

  // Helper function to get full name
  const getFullName = (user) => {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  };

  // Helper function to format last active date
  const formatLastActive = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to determine status based on last active
  const getEmployeeStatus = (lastActive) => {
    if (!lastActive) return 'Inactive';
    const date = new Date(lastActive);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return 'Active';
    if (diffDays <= 30) return 'Recently Active';
    return 'Inactive';
  };

  // Get unique roles for filter
  const uniqueRoles = ['All', ...new Set(users.map(user => user.role).filter(Boolean))];

  // Tab options
  const tabs = ['All', 'Active', 'Recently Active', 'Inactive'];

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/all-users`);
        console.log("users: ", response.data.users);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchAllUsers();
  }, []);

  // Filter users based on search, role filter, and status tab
  const filteredUsers = users.filter(user => {
    const fullName = getFullName(user);
    const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.designation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.branch || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.employeeId || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === 'All' || user.role === filterRole;

    const userStatus = getEmployeeStatus(user.lastActive);
    const matchesStatus = activeTab === 'All' || userStatus === activeTab;

    return matchesSearch && matchesRole && matchesStatus;
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Employees</h1>
              <p className="text-gray-600">
                Manage your team members and view their details
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {tab} ({users.filter(user => tab === 'All' || getEmployeeStatus(user.lastActive) === tab).length})
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search employees by name, email, designation, or branch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Employee Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(user => getEmployeeStatus(user.lastActive) === 'Active').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <User className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Managers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(user => user.role === 'Manager').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Employees</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(user => user.role === 'Employee').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header - Hidden on mobile, shown on larger screens */}
            <div className="hidden lg:block bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-6 gap-4 px-6 py-4">
                <div className="text-sm font-semibold text-gray-700">Employee ID</div>
                <div className="text-sm font-semibold text-gray-700">Employee</div>
                <div className="text-sm font-semibold text-gray-700">Email</div>
                <div className="text-sm font-semibold text-gray-700">Designation</div>
                <div className="text-sm font-semibold text-gray-700">Branch</div>
                <div className="text-sm font-semibold text-gray-700">Status</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((employee) => (
                <div
                  key={employee._id}
                  className="block lg:grid lg:grid-cols-6 lg:gap-4 px-4 lg:px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Mobile Layout */}
                  <div className="lg:hidden space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-blue-600">
                            {(employee.firstName?.[0] || '').toUpperCase()}{(employee.lastName?.[0] || '').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <Link to="/employee-details">
                            <div className="text-base font-medium text-gray-900 hover:underline hover:text-blue-700">
                              {getFullName(employee)}
                            </div>
                          </Link>
                          <div className="text-sm text-gray-500">#{employee.employeeId}</div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEmployeeStatus(employee.lastActive) === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : getEmployeeStatus(employee.lastActive) === 'Recently Active'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {getEmployeeStatus(employee.lastActive)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-500">Email:</span>
                        <span className="ml-2 text-gray-900">{employee.email}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Designation:</span>
                        <span className="ml-2 text-gray-900">{employee.designation || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Branch:</span>
                        <span className="ml-2 text-gray-900">{employee.branch || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:block text-sm text-gray-600 font-medium">
                    #{employee.employeeId}
                  </div>
                  <div className="hidden lg:flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-blue-600">
                        {(employee.firstName?.[0] || '').toUpperCase()}{(employee.lastName?.[0] || '').toUpperCase()}
                      </span>
                    </div>
                    <Link to="/employee-details">
                      <div className="text-sm text-gray-900 font-medium hover:underline hover:text-blue-700">
                        {getFullName(employee)}
                      </div>
                    </Link>
                  </div>
                  <div className="hidden lg:block text-sm text-gray-600">
                    {employee.email}
                  </div>
                  <div className="hidden lg:block text-sm text-gray-600">
                    {employee.designation || 'Not specified'}
                  </div>
                  <div className="hidden lg:block text-sm text-gray-600">
                    {employee.branch || 'Not specified'}
                  </div>
                  <div className="hidden lg:block">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEmployeeStatus(employee.lastActive) === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : getEmployeeStatus(employee.lastActive) === 'Recently Active'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {getEmployeeStatus(employee.lastActive)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty state if no employees */}
          {filteredUsers.length === 0 && users.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center mt-6">
              <div className="text-gray-400 mb-4">
                <Search className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No employees found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}

          {users.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <User className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No employees found
              </h3>
              <p className="text-gray-600">
                There are no employees available to display.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Employees;