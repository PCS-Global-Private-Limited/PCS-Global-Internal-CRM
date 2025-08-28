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

import Sidebar from '../components/Sidebar';

// Main Tasks Page Component
const Task = () => {
    const [activeItem, setActiveItem] = useState('tasks');
    const [activeTab, setActiveTab] = useState('All Tasks');
    const [searchQuery, setSearchQuery] = useState('');

    const tabs = ['All Tasks', 'My Tasks', 'Unassigned', 'Not Started', 'In Progress', 'Completed'];

    const tasks = [
        {
            id: 1,
            task: 'Design landing page',
            project: 'Marketing Campaign',
            assignee: 'Sophia Lee',
            dueDate: '2024-03-15',
            status: 'In Progress'
        },
        {
            id: 2,
            task: 'Develop user authentication',
            project: 'Product Development',
            assignee: 'Ethan Chen',
            dueDate: '2024-03-20',
            status: 'Not Started'
        },
        {
            id: 3,
            task: 'Write blog post',
            project: 'Content Marketing',
            assignee: 'Olivia Wong',
            dueDate: '2024-03-22',
            status: 'Completed'
        },
        {
            id: 4,
            task: 'Prepare sales presentation',
            project: 'Sales Enablement',
            assignee: 'Nathan Green',
            dueDate: '2024-03-25',
            status: 'In Progress'
        },
        {
            id: 5,
            task: 'Update documentation',
            project: 'Product Development',
            assignee: 'Ethan Chen',
            dueDate: '2024-03-28',
            status: 'Unassigned'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            case 'Not Started':
                return 'bg-gray-100 text-gray-800';
            case 'Unassigned':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (activeTab === 'All Tasks') return matchesSearch;
        if (activeTab === 'My Tasks') return matchesSearch; // You can add user filtering logic here
        return matchesSearch && task.status === activeTab;
    });

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                            <p className="text-gray-600 mt-1">Manage your team's tasks and track progress.</p>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <Plus className="w-4 h-4" />
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-8">
                        {/* Tabs */}
                        <div className="mb-6">
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                                activeTab === tab
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Tasks Table */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Task
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Project
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Assignee
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Due Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredTasks.map((task) => (
                                            <tr key={task.id} className="hover:bg-gray-50 cursor-pointer">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {task.task}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600">
                                                        {task.project}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600">
                                                        {task.assignee}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600">
                                                        {task.dueDate}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {filteredTasks.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-gray-500">No tasks found matching your criteria.</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Task;