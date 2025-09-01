import React, { useEffect, useState } from 'react';
import { ChevronDown, Search, User } from 'lucide-react';
import axios from 'axios';

const AssignTask = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]); // Store employee objects with id and name
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Get available employees (not assigned to selected project)
  const getAvailableEmployees = () => {
    if (!selectedProject) {
      return employees; // If no project selected, show all employees
    }

    const selectedProjectData = projects.find(project => project._id.toString() === selectedProject);

    if (!selectedProjectData || !selectedProjectData.assignees) {
      return employees; // If no assignees in project, show all employees
    }

    // Get IDs of employees already assigned to this project
    const assignedEmployeeIds = selectedProjectData.assignees.map(assignee => assignee.userId.toString());

    // Filter out employees who are already assigned to this project
    return employees.filter(employee => !assignedEmployeeIds.includes(employee._id.toString()));
  };

  const availableEmployees = getAvailableEmployees();

  const filteredEmployees = availableEmployees.filter(emp =>
    (emp.firstName + " " + emp.lastName).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProjectData = projects.find(project => project._id.toString() === selectedProject);

  // Handle Multiple Employee Selection
  const handleEmployeeSelect = (employee) => {
    const employeeData = {
      id: employee._id,
      name: employee.firstName + " " + employee.lastName
    };

    setSelectedEmployees(prevSelected => {
      const isAlreadySelected = prevSelected.some(emp => emp.id === employee._id);

      if (isAlreadySelected) {
        // Unselect if already selected
        return prevSelected.filter(emp => emp.id !== employee._id);
      } else {
        // Add to selection
        return [...prevSelected, employeeData];
      }
    });
  };

  // Handle project selection
  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
    setIsProjectDropdownOpen(false);
    // Clear selected employees when project changes
    setSelectedEmployees([]);
    // Clear search term
    setSearchTerm('');
  };

  const handleAssign = async () => {
    if (selectedProject && selectedEmployees.length > 0) {
      try {
        // Extract employee IDs for server request
        const employeeIds = selectedEmployees.map(emp => emp.id);
        const employeeNames = selectedEmployees.map(emp => emp.name);

        console.log("Selected Employee:", selectedEmployees);
        console.log("Selected Employee IDs:", employeeIds);
        console.log("Selected Employee Names:", employeeNames);

        // API call to assign employees to the project

        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/task/assign`,
          {
            taskId: selectedProject,
            //employeeIds: employeeIds, // Send employee IDs to server
            employees: selectedEmployees
          },
          {
            withCredentials: true, // ✅ This ensures cookies are sent to the backend
          }
        );

        alert(`Task assigned to ${employeeNames.join(', ')} for project: ${selectedProjectData?.title}`);

        // Reset form after successful assignment
        setSelectedProject('');
        setSelectedEmployees([]);
        setSearchTerm('');

        // Refresh projects to get updated assignees
        const updatedProjects = await axios.get(`${import.meta.env.VITE_API_URL}/api/task/get-all`);
        setProjects(updatedProjects.data.tasks);

      } catch (error) {
        console.error("Error assigning task:", error);
        alert('Error assigning task. Please try again.');
      }
    } else {
      alert('Please select a project and at least one employee');
    }
  };

  useEffect(() => {
    const getAllTasks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/task/get-all`
        );
        console.log("Tasks fetched successfully:", response.data.tasks);
        setProjects(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    getAllTasks();
  }, []);

  useEffect(() => {
    const getAllEmployees = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/all-employees`
        );
        console.log("Employees fetched successfully:", response.data.employees);
        setEmployees(response.data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    getAllEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">TeamLog</h1>
            </div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Assign Task</h1>
          <p className="text-gray-600 mt-2">Select a project and assign it to employees.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Select Project */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Project</h2>
            <div className="relative">
              <div
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 transition-all flex items-center justify-between"
              >
                <span className={selectedProjectData ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedProjectData ? selectedProjectData.title : 'Select a project'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isProjectDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {projects.map((project) => (
                    <div
                      key={project._id}
                      onClick={() => handleProjectSelect(project._id.toString())}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900">{project.title}</span>
                        <span className="text-sm text-gray-500">
                          {project.assignees?.length || 0} assigned
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Select Employees */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Employees
              {selectedProject && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({availableEmployees.length} available for this project)
                </span>
              )}
            </h2>

            {!selectedProject && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Please select a project first to see available employees.
                </p>
              </div>
            )}

            {selectedProject && (
              <>
                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search available employees"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Employee List */}
                <div className="space-y-3 mb-8">
                  {filteredEmployees.map((employee) => (
                    <label
                      key={employee._id}
                      className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        name="employee"
                        value={employee._id}
                        checked={selectedEmployees.some(emp => emp.id === employee._id)}
                        onChange={() => handleEmployeeSelect(employee)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="ml-4 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium mr-4">
                          {employee.avatar || (employee.firstName.charAt(0) + employee.lastName.charAt(0))}
                        </div>
                        <div>
                          <span className="text-gray-900 font-medium">
                            {employee.firstName + " " + employee.lastName}
                          </span>
                          <p className="text-sm text-gray-500">
                            {employee.designation} • {employee.branch}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {filteredEmployees.length === 0 && availableEmployees.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">All employees are already assigned to this project</p>
                    <p className="text-sm">Try selecting a different project.</p>
                  </div>
                )}

                {filteredEmployees.length === 0 && availableEmployees.length > 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No employees found matching your search.</p>
                  </div>
                )}

                {/* Selected Employees Summary */}
                {selectedEmployees.length > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">
                      Selected Employees ({selectedEmployees.length}):
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployees.map((employee, index) => (
                        <span
                          key={employee.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {employee.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Assign Button */}
            <div className="flex justify-end">
              <button
                onClick={handleAssign}
                disabled={!selectedProject || selectedEmployees.length === 0}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;