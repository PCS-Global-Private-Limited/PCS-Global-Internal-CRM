import React, { useState, useEffect } from 'react';
import { User, Camera, Plus, LogOut, Mail, Phone, Building, BookOpen, X } from 'lucide-react';
import Navbar from "../components/Navbar";
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    branch: '',
    designation: '',
    skills: [],
    avatar: null
  });
  const [newSkill, setNewSkill] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      if (!data) {
        throw new Error('No data received');
      }

      setUser(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.message.includes('401') || error.message.includes('403')) {
        navigate('/login');
      }
    }
  };
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    try {
      // Function to compress image
      const compressImage = (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;

              // Calculate new dimensions while maintaining aspect ratio
              if (width > height) {
                if (width > 400) {
                  height = Math.round((height * 400) / width);
                  width = 400;
                }
              } else {
                if (height > 400) {
                  width = Math.round((width * 400) / height);
                  height = 400;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);

              // Get compressed image
              const quality = 0.7; // Adjust quality (0.1 to 1.0)
              resolve(canvas.toDataURL(file.type, quality));
            };
          };
        });
      };

      console.log('Compressing image...');
      const compressedImage = await compressImage(file);

      console.log('Sending to server...');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile/avatar`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          image: compressedImage 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to upload image');
      }

      setUser(prev => ({ ...prev, avatar: data.avatarUrl }));
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Failed to upload image. Please try again.');
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile/skills`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skill: newSkill.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(prev => ({
          ...prev,
          skills: data.skills
        }));
        setNewSkill('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add skill');
      }
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile/skills`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skill: skillToRemove })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(prev => ({
          ...prev,
          skills: data.skills
        }));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove skill');
      }
    } catch (error) {
      console.error('Error removing skill:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Profile Header */}
          <div className="relative h-32 bg-blue-600 rounded-t-lg">
            <div className="absolute -bottom-16 left-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-full h-full p-4 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="absolute top-4 right-4 flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>

          {/* Profile Content */}
          <div className="pt-20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">{user.designation}</p>

                {/* Contact Information */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-2" />
                    {user.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Building className="w-5 h-5 mr-2" />
                    {user.branch}
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Skills
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {user.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}