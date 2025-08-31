
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
    UserCheck,
    CalendarCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ activeItem, onItemClick }) => {
    const sidebarItems = [
        { icon: Home, label: 'Dashboard', id: 'dashboard', route: '/manager-dashboard' },
        { icon: CheckSquare, label: 'Tasks', id: 'tasks', route: '/task' },
        { icon: FileText, label: 'Requests', id: 'requests', route: '/employee-addition-requests' },
        { icon: CalendarCheck , label: 'Attendance', id: 'attendance', route: '/attendance' },
        { icon: Users, label: 'Employees', id: 'employees', route: '/employees' },
        { icon: BarChart3, label: 'Reports', id: 'reports', route: '/reports' }
    ];

    return (
        <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full">
            {/* Logo/Header */}
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-xl font-bold text-gray-800">TeamLog</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-4">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.id;
                    return (
                        <Link key={item.id} to={item.route} >
                            <div
                                onClick={() => onItemClick(item.id)}
                                className={`flex items-center px-6 py-3 text-sm font-medium cursor-pointer transition-all duration-200 ${isActive
                                    ? 'bg-blue-50 text-blue-600 border-r-3 border-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : ''}`} />
                                <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Profile Section */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                        A
                    </div>
                    <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">My Profile</span>
                        <div className="text-xs text-gray-500">Admin</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;