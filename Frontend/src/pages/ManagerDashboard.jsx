
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
import DashboardContent from '../components/Dashboardcontent';

const ManagerDashboard = () => {
    const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

    const handleMenuItemClick = (itemId) => {
        setActiveMenuItem(itemId);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                activeItem={activeMenuItem}
                onItemClick={handleMenuItemClick}
            />
            <DashboardContent />
        </div>
    );
};

export default ManagerDashboard;