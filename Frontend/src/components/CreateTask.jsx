import React, { useState } from 'react';
import {
  ChevronDown,
  Upload,
  Calendar,
  X,
  FileText,
  Plus
} from 'lucide-react';
import { fileToBase64 } from "../utils/fileToBase64";


// Create Task Component
const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    deadline: '',
    documents: []
  });

  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const employees = [
    { id: 1, name: 'Lucas Bennett', avatar: 'LB' },
    { id: 2, name: 'Olivia Carter', avatar: 'OC' },
    { id: 3, name: 'Owen Hughes', avatar: 'OH' },
    { id: 4, name: 'Sophia Powell', avatar: 'SP' },
    { id: 5, name: 'Leo Morgan', avatar: 'LM' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // const handleSubmit = () => {
  //   console.log('Task created:', { ...formData, documents: uploadedFiles });
  //   alert('Task created successfully!');
  // };

  const handleSubmit = async () => {
    try {
      // Step 1: Convert all uploaded files to base64
      let uploadedDocs = [];
      if (uploadedFiles.length > 0) {
        const filePromises = uploadedFiles.map(async (file) => {
          const base64File = await fileToBase64(file);
          return { file: base64File, fileName: file.name };
        });

        uploadedDocs = await Promise.all(filePromises);
      }

      // Step 2: Send documents to backend for Cloudinary upload
      let documentUrls = [];
      if (uploadedDocs.length > 0) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/task/upload-documents`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ documents: uploadedDocs }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || data.message || "Document upload failed");
        }

        documentUrls = data.documentUrls; // Array of uploaded Cloudinary URLs
        console.log("Document URLs:", documentUrls);
      }

      console.log("Document URLs:", documentUrls);
      

      //  assignees: [formData.assignee], // Single assignee for now

      // Step 3: Create Task API call
      const createTaskResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/task/create`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            deadline: formData.deadline,
            documentUrls,
          }),
        }
      );

      const createTaskData = await createTaskResponse.json();
      if (!createTaskResponse.ok) {
        throw new Error(
          createTaskData.error ||
          createTaskData.message ||
          "Failed to create task"
        );
      }

      alert("Task created successfully!");
      console.log("Created Task:", createTaskData.task);

      // Reset form
      setFormData({
        title: "",
        description: "",
        assignee: "",
        deadline: "",
        documents: [],
      });
      setUploadedFiles([]);

    } catch (error) {
      console.error("Error creating task:", error);
      alert(error.message || "Something went wrong!");
    }
  };

  const selectedEmployee = employees.find(emp => emp.id.toString() === formData.assignee);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="text-left mb-6">
            <h1 className="text-lg font-semibold text-gray-900">TeamLog</h1>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Task</h1>
          <p className="text-gray-600 mt-2">Fill in the details to create a new task for your team.</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form className="space-y-6">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <input
                type="text"
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={6}
                placeholder="Enter task description..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white resize-none"
              />
            </div>

            {/* Assignee */}
            {/* <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignee
              </label>
              <div
                onClick={() => setIsAssigneeOpen(!isAssigneeOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all flex items-center justify-between"
              >
                <div className="flex items-center">
                  {selectedEmployee ? (
                    <>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                        {selectedEmployee.avatar}
                      </div>
                      <span className="text-gray-900">{selectedEmployee.name}</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Select assignee</span>
                  )}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isAssigneeOpen ? 'rotate-180' : ''}`} />
              </div>

              {isAssigneeOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      onClick={() => {
                        handleInputChange('assignee', employee.id.toString());
                        setIsAssigneeOpen(false);
                      }}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                        {employee.avatar}
                      </div>
                      <span className="text-gray-900">{employee.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div> */}

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <div className="relative">
                <input
                  type="date"
                  placeholder="Select deadline"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white text-gray-500"
                />
              </div>
            </div>

            {/* Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documents
              </label>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center py-8 px-4"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium mb-1">
                    Upload documents
                  </span>
                  <span className="text-xs text-gray-500">
                    Click to browse or drag and drop files here
                  </span>
                </label>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700 block">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            {Math.round(file.size / 1024)} KB
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md flex items-center"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;