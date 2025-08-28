
import React, { useState } from 'react';
import {
    Home,
    CheckSquare,
    FileText,
    Users,
    BarChart3,
    User,
    Search,
    Plus,
    UserCheck
} from 'lucide-react';

import { Link } from 'react-router-dom';

const DashboardContent = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const employeeData = [
        { name: 'Lucas Bennett', time: '6h 30m', status: 'active', avatar: 'LB' },
        { name: 'Olivia Carter', time: '7h 15m', status: 'active', avatar: 'OC' },
        { name: 'Owen Hughes', time: '5h 45m', status: 'active', avatar: 'OH' },
        { name: 'Sophia Powell', time: '8h 00m', status: 'break', avatar: 'SP' },
        { name: 'Leo Morgan', time: '0h 00m', status: 'offline', avatar: 'LM' }
    ];

    const overviewCards = [
        {
            title: 'Employees Logged In Today',
            value: '12',
            icon: Users,
            color: 'green',
            bgColor: 'bg-green-100',
            textColor: 'text-green-600'
        },
        {
            title: 'Requests to Approve',
            value: '3',
            icon: FileText,
            color: 'orange',
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-600'
        },
        {
            title: 'Attendance',
            value: '95%',
            icon: BarChart3,
            color: 'blue',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600'
        }
    ];

    const filteredEmployees = employeeData.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'break': return 'bg-yellow-500';
            case 'offline': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="flex-1 overflow-auto bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link to="/create-task">
                            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Task
                            </button>
                        </Link>
                        <Link to="/assign-task">
                            <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                                <UserCheck className="w-4 h-4 mr-2" />
                                Assign Task
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Overview Cards */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {overviewCards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                                        </div>
                                        <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                                            <Icon className={`w-6 h-6 ${card.textColor}`} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Employee Time Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Employee Time</h2>
                            <span className="text-sm text-gray-500">{filteredEmployees.length} employees</span>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search for an employee"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Employee List */}
                    <div className="p-6">
                        <div className="flex justify-between text-sm font-medium text-gray-500 mb-4 pb-2 border-b border-gray-200">
                            <span>Employee</span>
                            <span>Working Time</span>
                        </div>

                        <div className="space-y-3">
                            {filteredEmployees.map((employee, index) => (
                                <div key={index} className="flex items-center justify-between py-4 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200">
                                    <div className="flex items-center">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium mr-4">
                                                {employee.avatar}
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(employee.status)}`}></div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{employee.name}</p>
                                            <div className="flex items-center mt-1">
                                                <span className="text-xs text-gray-500 capitalize">{employee.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`font-semibold text-lg ${employee.time === '0h 00m' ? 'text-gray-400' : 'text-gray-700'
                                            }`}>
                                            {employee.time}
                                        </span>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {employee.time === '0h 00m' ? 'Not started' : 'Active'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredEmployees.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium mb-2">No employees found</p>
                                <p className="text-sm">Try adjusting your search terms.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;