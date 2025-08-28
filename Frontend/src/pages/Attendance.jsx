import React, { useState } from 'react';
import {
    Home,
    CheckSquare,
    FileText,
    Users,
    BarChart3,
    User,
    Search,
    Calendar,
    Clock
} from 'lucide-react';

import Sidebar from '../components/Sidebar';

// Main Attendance Page Component
const Attendance = () => {
    const [activeItem, setActiveItem] = useState('attendance');
    const [selectedDate, setSelectedDate] = useState('2024-03-15');
    const [searchQuery, setSearchQuery] = useState('');

    const attendanceData = [
        {
            id: 1,
            employee: 'Ethan Harper',
            date: '2024-03-15',
            loginTime: '09:00 AM',
            logoutTime: '06:00 PM',
            hoursWorked: '9 hours'
        },
        {
            id: 2,
            employee: 'Olivia Bennett',
            date: '2024-03-15',
            loginTime: '09:05 AM',
            logoutTime: '05:55 PM',
            hoursWorked: '8.8 hours'
        },
        {
            id: 3,
            employee: 'Noah Carter',
            date: '2024-03-15',
            loginTime: '08:55 AM',
            logoutTime: '06:05 PM',
            hoursWorked: '9.2 hours'
        },
        {
            id: 4,
            employee: 'Ava Morgan',
            date: '2024-03-15',
            loginTime: '09:10 AM',
            logoutTime: '05:50 PM',
            hoursWorked: '8.6 hours'
        },
        {
            id: 5,
            employee: 'Liam Foster',
            date: '2024-03-15',
            loginTime: '08:50 AM',
            logoutTime: '06:10 PM',
            hoursWorked: '9.3 hours'
        }
    ];

    const filteredData = attendanceData.filter(record =>
        record.employee.toLowerCase().includes(searchQuery.toLowerCase()) &&
        record.date === selectedDate
    );

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
                            <p className="text-gray-600 mt-1">Track and manage team attendance records.</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-8">
                        {/* Date Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Date
                            </label>
                            <div className="relative max-w-xs">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    max={getCurrentDate()}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
                                />
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            </div>
                        </div>

                        {/* Search */}
                        <div className="mb-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by name"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Attendance Table */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Employee
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Login Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Logout Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Hours Worked
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredData.map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                                                            {record.employee.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {record.employee}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600">
                                                        {record.date}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Clock className="w-4 h-4 mr-1 text-green-500" />
                                                        {record.loginTime}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Clock className="w-4 h-4 mr-1 text-red-500" />
                                                        {record.logoutTime}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {record.hoursWorked}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {filteredData.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-gray-500">
                                    No attendance records found for the selected date.
                                </div>
                            </div>
                        )}

                        {/* Summary Stats */}
                        {filteredData.length > 0 && (
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <div className="text-sm text-gray-600">Total Employees</div>
                                    <div className="text-2xl font-bold text-gray-900">{filteredData.length}</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <div className="text-sm text-gray-600">Average Hours</div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {(filteredData.reduce((acc, record) =>
                                            acc + parseFloat(record.hoursWorked), 0) / filteredData.length).toFixed(1)}h
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow">
                                    <div className="text-sm text-gray-600">Total Hours</div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {filteredData.reduce((acc, record) =>
                                            acc + parseFloat(record.hoursWorked), 0).toFixed(1)}h
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;