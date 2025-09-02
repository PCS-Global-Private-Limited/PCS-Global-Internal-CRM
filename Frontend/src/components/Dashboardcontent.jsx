import React, { useState, useEffect } from 'react';
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
    Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const DashboardContent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [checkIn, setCheckIn] = useState(false);
    const [checkOut, setCheckOut] = useState(false);
    const [loading, setLoading] = useState(true);
    const [allEmployeeData, setAllEmployeeData] = useState([]);

    // Sample employee data with login/logout times for different dates
    // const allEmployeeData = [
    //     {
    //         name: 'Lucas Bennett',
    //         avatar: 'LB',
    //         dates: {
    //             '2025-05-10': { loginTime: '09:00', logoutTime: '17:30', status: 'logged_out' },
    //             '2025-09-01': { loginTime: '08:30', logoutTime: null, status: 'active' }
    //         }
    //     },
    //     {
    //         name: 'Olivia Carter',
    //         avatar: 'OC',
    //         dates: {
    //             '2025-05-10': { loginTime: '08:45', logoutTime: '18:00', status: 'logged_out' },
    //             '2025-09-01': { loginTime: '09:15', logoutTime: null, status: 'active' }
    //         }
    //     },
    //     {
    //         name: 'Owen Hughes',
    //         avatar: 'OH',
    //         dates: {
    //             '2025-05-10': { loginTime: '09:30', logoutTime: '17:00', status: 'logged_out' },
    //             '2025-09-01': { loginTime: '08:45', logoutTime: null, status: 'break' }
    //         }
    //     },
    //     {
    //         name: 'Sophia Powell',
    //         avatar: 'SP',
    //         dates: {
    //             '2025-05-10': { loginTime: '08:00', logoutTime: '16:30', status: 'logged_out' },
    //             '2025-09-01': { loginTime: '09:00', logoutTime: '14:30', status: 'logged_out' }
    //         }
    //     },
    //     {
    //         name: 'Leo Morgan',
    //         avatar: 'LM',
    //         dates: {
    //             '2025-05-10': { loginTime: null, logoutTime: null, status: 'offline' },
    //             '2025-09-01': { loginTime: null, logoutTime: null, status: 'offline' }
    //         }
    //     },
    //     {
    //         name: 'Emma Wilson',
    //         avatar: 'EW',
    //         dates: {
    //             '2025-05-10': { loginTime: '09:15', logoutTime: '18:15', status: 'logged_out' },
    //             '2025-09-01': { loginTime: '08:00', logoutTime: null, status: 'active' }
    //         }
    //     }
    // ];

    const getEmployeeDataWithattendence = async () => {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/attendance/employee-data-with-attendence`, {
            withCredentials: true, // ✅ Important for cookies
        });
        console.log("data:", data);
        setAllEmployeeData(data.data);
    }

    useEffect(() => {
        getEmployeeDataWithattendence()
    }, [])

    // Update current time every minute for real-time calculations
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    // Helper to parse time string as 24-hour or 12-hour, always as local time
    function parseTime(date, timeStr) {
        // timeStr: "00:46" or "12:05 AM"
        // date: "YYYY-MM-DD"
        let [year, month, day] = date.split('-').map(Number);
        let hours = 0, minutes = 0;

        if (/^\d{2}:\d{2}$/.test(timeStr)) {
            // 24-hour format
            [hours, minutes] = timeStr.split(':').map(Number);
        } else {
            // 12-hour format fallback
            const [time, modifier] = timeStr.split(' ');
            [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours !== 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
        }
        // JS months are 0-based
        return new Date(year, month - 1, day, hours, minutes, 0, 0);
    }

    // Calculate working time based on login/logout times
    const calculateWorkingTime = (employee, date) => {
        const dateData = employee.dates[date];
        if (!dateData || !dateData.loginTime) {
            return { hours: 0, minutes: 0, display: '0h 00m' };
        }

        // Use ISO string if available for login/logout time
        let loginTime, endTime;
        if (dateData.loginTime && dateData.loginTime.length > 10) {
            loginTime = new Date(dateData.loginTime);
        } else {
            loginTime = parseTime(date, dateData.loginTime);
        }

        if (dateData.logoutTime && dateData.logoutTime.length > 10) {
            endTime = new Date(dateData.logoutTime);
        } else if (dateData.logoutTime) {
            endTime = parseTime(date, dateData.logoutTime);
        } else if (date === new Date().toISOString().split('T')[0]) {
            endTime = currentTime;
        } else {
            endTime = new Date(loginTime.getTime() + 8 * 60 * 60 * 1000);
        }

        let diffMs = endTime - loginTime;
        if (diffMs < 0) diffMs = 0;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return {
            hours,
            minutes,
            display: `${hours}h ${minutes.toString().padStart(2, '0')}m`
        };
    };

    // Get employees for selected date
    const getEmployeesForDate = () => {
        return allEmployeeData
            .map(emp => {
                const dateData = emp.dates[selectedDate];
                if (!dateData) {
                    // Employee has no attendance record for this date - show as offline
                    return {
                        ...emp,
                        time: '0h 00m',
                        status: 'offline',
                        loginTime: null,
                        logoutTime: null
                    };
                }

                const workingTime = calculateWorkingTime(emp, selectedDate);

                return {
                    ...emp,
                    time: workingTime.display,
                    status: dateData.status,
                    loginTime: dateData.loginTime,
                    logoutTime: dateData.logoutTime
                };
            });
    };

    const employeeData = getEmployeesForDate();

    // Calculate overview statistics for selected date
    const getOverviewStats = () => {
        const employeesForDate = employeeData;
        const loggedInCount = employeesForDate.filter(emp => emp.status === 'active' || emp.status === 'break').length;
        const totalPresent = employeesForDate.filter(emp => emp.status !== 'offline').length;
        const attendancePercentage = totalPresent > 0 ? Math.round((totalPresent / allEmployeeData.length) * 100) : 0;

        return { loggedInCount, attendancePercentage };
    };

    const { loggedInCount, attendancePercentage } = getOverviewStats();

    const overviewCards = [
        {
            title: 'Employees Logged In',
            value: loggedInCount.toString(),
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
            value: `${attendancePercentage}%`,
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
            case 'logged_out': return 'bg-blue-500';
            case 'offline': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Active';
            case 'break': return 'On Break';
            case 'logged_out': return 'Logged Out';
            case 'offline': return 'Offline';
            default: return 'Unknown';
        }
    };

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    const checkCheckInStatus = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/attendance/check-in-status`,
                {
                    withCredentials: true, // ✅ Important for cookies
                }
            );

            if (data.checkedIn) {
                alert("✅ User is already checked-in!");
                setCheckIn(true);
            } else {
                alert("ℹ️ User has not checked-in yet!");
                setCheckIn(false);
            }
        } catch (error) {
            console.error("Error checking status:", error);
            alert("❌ Failed to check status");
        }
    };

    const checkCheckOutStatus = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/attendance/check-out-status`,
                {
                    withCredentials: true, // ✅ Important for cookies
                }
            );

            if (data.checkedOut) {
                alert("✅ User is already checked-out!");
                setCheckOut(true);
            } else {
                alert("ℹ️ User has not checked-out yet!");
                setCheckOut(false);
            }
        } catch (error) {
            console.error("Error checking status:", error);
            alert("❌ Failed to check status");
        }
    };

    useEffect(() => {
        checkCheckInStatus()
        checkCheckOutStatus()
        getEmployeeDataWithattendence()
    }, [])

    const handleCheckIn = async () => {
        try {
            // setLoading(true);
            // setMessage("");

            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/attendance/checkin`, {}, {
                withCredentials: true, // ✅ Send cookies automatically
            });

            console.log("data:", data);


            if (data.success) {
                // setMessage("✅ " + data.message);
                alert("Checked in successfully");
                setCheckIn(true);
                getEmployeeDataWithattendence()
            } else {
                // setMessage("⚠️ " + data.message);
                alert("⚠️ " + data.message);
                setCheckIn(false);
            }
        } catch (error) {
            // setMessage("❌ " + (error.response?.data?.message || "Something went wrong"));
            alert("❌ " + (error.response?.data?.message || "Something went wrong"));
        } finally {
            setLoading(false);
        }
    };



    // ✅ Handle Check-Out
    const handleCheckOut = async () => {
        try {
            setLoading(true);

            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/attendance/checkout`, {}, // No body needed if just checking out
                {
                    withCredentials: true, // ✅ Send cookies automatically
                })

            console.log("data:", data);

            if (data.success) {
                alert("Checked out successfully");
                setCheckOut(true);
                setCheckIn(false);
                getEmployeeDataWithattendence()
            } else {
                alert("⚠️ " + data.message);
                // If checkout failed, keep checkIn as true and checkOut as false
                setCheckIn(true);
                setCheckOut(false);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-auto bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 p-6 sticky top-0 z-50">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {isToday ? "Welcome back! Here's what's happening today." : `Viewing data for ${new Date(selectedDate).toLocaleDateString()}`}
                        </p>
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

            <div className='ml-8'>
                {
                    checkOut ?
                        <div className="mt-8">Your attendance is already marked for today</div>
                        : checkIn ?
                            <div className="mt-8">
                                <button onClick={handleCheckOut} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                    Check-Out
                                </button>
                            </div>
                            :
                            <div className="mt-8">
                                <button onClick={handleCheckIn} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                    Check-In
                                </button>
                            </div>
                }
            </div>

            <div className="p-6">
                {/* Date Filter */}
                <div className="mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <div className="flex items-center space-x-2">
                                <label htmlFor="date-select" className="text-sm font-medium text-gray-700">
                                    Select Date:
                                </label>
                                <input
                                    id="date-select"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                            {isToday && (
                                <div className="flex items-center space-x-2 text-sm text-green-600">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span>Live Data</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

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
                                                <span className="text-xs text-gray-500">{getStatusText(employee.status)}</span>
                                                {employee.loginTime && (
                                                    <span className="text-xs text-gray-400 ml-2">
                                                        • In: {(() => {
                                                            const d = new Date(employee.loginTime);
                                                            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                                                        })()}
                                                        {employee.logoutTime && (
                                                            <> • Out: {(() => {
                                                                const d = new Date(employee.logoutTime);
                                                                return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                                                            })()}</>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`font-semibold text-lg ${employee.time === '0h 00m' ? 'text-gray-400' :
                                            employee.status === 'active' && isToday ? 'text-green-600' : 'text-gray-700'
                                            }`}>
                                            {employee.time}
                                            {employee.status === 'active' && isToday && (
                                                <span className="ml-1 text-xs text-green-500">●</span>
                                            )}
                                        </span>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {employee.time === '0h 00m' ? 'Not logged in' :
                                                employee.status === 'active' && isToday ? 'Currently working' :
                                                    employee.status === 'break' && isToday ? 'On break' : 'Completed'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredEmployees.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium mb-2">No employees found</p>
                                <p className="text-sm">
                                    {employeeData.length === 0
                                        ? 'No employee data available for this date.'
                                        : 'Try adjusting your search terms.'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Summary for selected date */}
                    {employeeData.length > 0 && (
                        <div className="px-6 pb-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                    Summary for {new Date(selectedDate).toLocaleDateString()}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">Total Employees:</span>
                                        <span className="font-medium ml-1">{employeeData.length}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Present:</span>
                                        <span className="font-medium ml-1 text-green-600">
                                            {employeeData.filter(emp => emp.status !== 'offline').length}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Active:</span>
                                        <span className="font-medium ml-1 text-blue-600">
                                            {employeeData.filter(emp => emp.status === 'active').length}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Logged Out:</span>
                                        <span className="font-medium ml-1 text-gray-600">
                                            {employeeData.filter(emp => emp.status === 'logged_out').length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;