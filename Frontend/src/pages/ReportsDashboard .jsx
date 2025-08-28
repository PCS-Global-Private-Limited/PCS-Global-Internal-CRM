import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const ReportsDashboard = () => {
    const [activeItem, setActiveItem] = useState('reports');

    // Mock data for employee performance
    const employeeData = [
        {
            name: 'Ethan Walker',
            tasksAssigned: 20,
            tasksCompleted: 18,
            completionRate: 90
        },
        {
            name: 'Sophia Hayes',
            tasksAssigned: 15,
            tasksCompleted: 13,
            completionRate: 80
        },
        {
            name: 'Liam Bennett',
            tasksAssigned: 25,
            tasksCompleted: 20,
            completionRate: 80
        },
        {
            name: 'Olivia Carter',
            tasksAssigned: 18,
            tasksCompleted: 16,
            completionRate: 89
        },
        {
            name: 'Noah Foster',
            tasksAssigned: 22,
            tasksCompleted: 20,
            completionRate: 91
        }
    ];

    // Mock chart data points for the line chart
    const chartData = [
        { month: 'Jan', value: 45 },
        { month: 'Feb', value: 65 },
        { month: 'Mar', value: 35 },
        { month: 'Apr', value: 55 },
        { month: 'May', value: 85 },
        { month: 'Jun', value: 75 }
    ];

    // Create SVG path for the line chart
    const createPath = (data) => {
        const width = 400;
        const height = 120;
        const padding = 20;

        const maxValue = Math.max(...data.map(d => d.value));
        const minValue = Math.min(...data.map(d => d.value));
        const range = maxValue - minValue;

        const points = data.map((point, index) => {
            const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
            const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding);
            return `${x},${y}`;
        });

        return `M ${points.join(' L ')}`;
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Reports</h1>
                        <p className="text-gray-600">Analyze task completion data and employee performance metrics</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Export
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-8 space-y-8">
                    {/* Task Completion Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Task Completion</h2>
                            <div className="flex space-x-4">
                                <div className="relative">
                                    <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option>Date Range</option>
                                        <option>Last 30 days</option>
                                        <option>Last 3 months</option>
                                        <option>Last 6 months</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option>Employee</option>
                                        <option>All Employees</option>
                                        <option>Active Only</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Task Completion Stats */}
                        <div className="mb-8">
                            <div className="flex items-baseline space-x-2 mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Tasks Completed Over Time</h3>
                            </div>
                            <div className="flex items-baseline space-x-3 mb-1">
                                <span className="text-4xl font-bold text-gray-900">75%</span>
                            </div>
                            <p className="text-sm text-green-600">Last 6 Months +10%</p>
                        </div>

                        {/* Chart */}
                        <div className="relative">
                            <svg width="100%" height="150" viewBox="0 0 500 150" className="overflow-visible">
                                {/* Grid lines */}
                                <defs>
                                    <pattern id="grid" width="50" height="30" patternUnits="userSpaceOnUse">
                                        <path d="M 50 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />

                                {/* Line chart */}
                                <path
                                    d={createPath(chartData)}
                                    fill="none"
                                    stroke="#6b7280"
                                    strokeWidth="2"
                                    className="drop-shadow-sm"
                                />

                                {/* Data points */}
                                {chartData.map((point, index) => {
                                    const width = 400;
                                    const height = 120;
                                    const padding = 20;
                                    const maxValue = Math.max(...chartData.map(d => d.value));
                                    const minValue = Math.min(...chartData.map(d => d.value));
                                    const range = maxValue - minValue;

                                    const x = padding + (index * (width - 2 * padding)) / (chartData.length - 1);
                                    const y = height - padding - ((point.value - minValue) / range) * (height - 2 * padding);

                                    return (
                                        <circle
                                            key={index}
                                            cx={x + 50}
                                            cy={y + 15}
                                            r="3"
                                            fill="#6b7280"
                                            className="drop-shadow-sm"
                                        />
                                    );
                                })}

                                {/* Month labels */}
                                {chartData.map((point, index) => {
                                    const x = 70 + (index * 320) / (chartData.length - 1);
                                    return (
                                        <text
                                            key={index}
                                            x={x}
                                            y={145}
                                            textAnchor="middle"
                                            className="text-xs fill-gray-500"
                                        >
                                            {point.month}
                                        </text>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    {/* Employee Performance Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Employee Performance</h2>

                        {/* Table Header */}
                        <div className="grid grid-cols-4 gap-4 pb-4 border-b border-gray-200 mb-4">
                            <div className="text-sm font-semibold text-gray-700">Employee</div>
                            <div className="text-sm font-semibold text-gray-700">Tasks Assigned</div>
                            <div className="text-sm font-semibold text-gray-700">Tasks Completed</div>
                            <div className="text-sm font-semibold text-gray-700">Completion Rate</div>
                        </div>

                        {/* Table Body */}
                        <div className="space-y-4">
                            {employeeData.map((employee, index) => (
                                <div key={index} className="grid grid-cols-4 gap-4 py-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="text-sm font-medium text-gray-900">
                                        {employee.name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {employee.tasksAssigned}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {employee.tasksCompleted}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gray-800 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${employee.completionRate}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 w-8">
                                            {employee.completionRate}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// // Placeholder Sidebar component
// const Sidebar = ({ activeItem, onItemClick }) => {
//     return (
//         <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-full">
//             <div className="p-6 border-b border-gray-100">
//                 <h1 className="text-xl font-bold text-gray-800">TeamLog</h1>
//             </div>
//             <nav className="flex-1 mt-4">
//                 <div className="flex items-center px-6 py-3 text-sm font-medium bg-blue-50 text-blue-600 border-r-3 border-blue-600">
//                     <span>Reports</span>
//                 </div>
//             </nav>
//         </div>
//     );
// };

export default ReportsDashboard;