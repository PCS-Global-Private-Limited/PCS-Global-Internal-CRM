import Sidebar from '../components/Sidebar';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AddEmployeeRequest = () => {
  const [activeItem, setActiveItem] = useState('requests');
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requesterName = request?.senderId ? `${request.senderId.firstName} ${request.senderId.lastName}` : '—';
  const createdDate = request?.createdAt ? new Date(request.createdAt).toLocaleDateString() : '—';

  const handleApprove = async () => {
    if (request?.status === 'Approved') {
      alert('This request is already approved.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/request-team-member/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Approved' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRequest(data.request);
      } else {
        setError(data.message || 'Failed to approve request');
      }
    } catch (e) {
      setError('Failed to approve request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (request?.status === 'Rejected') {
      alert('This request is already rejected.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/request-team-member/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Rejected' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRequest(data.request);
      } else {
        setError(data.message || 'Failed to reject request');
      }
    } catch (e) {
      setError('Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequest = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/request-team-member/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRequest(data.request);
      } else {
        setError(data.message || 'Failed to load request');
      }
    } catch (e) {
      setError('Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRequest();
    }
  }, [id]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span className="hover:text-gray-900 cursor-pointer">Requests</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{requesterName}</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Add employee to project</h1>
          <p className="text-gray-600">{requesterName} • {createdDate}</p>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {!loading && !error && request && (
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm text-gray-600">Status:</span>
              {(() => {
                const status = request.status || 'Pending';
                const classes =
                  status === 'Approved'
                    ? 'bg-green-100 text-green-800'
                    : status === 'Rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800';
                return (
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${classes}`}>
                    {status}
                  </span>
                );
              })()}
            </div>
          )}
          {loading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">Loading...</div>
          )}
          {!loading && error && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-red-600">{error}</div>
          )}
          {/* Request Details Section */}
          {!loading && !error && request && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Request Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee to Add</label>
                  <p className="text-sm text-gray-900">{request.selectedMembers && request.selectedMembers.length > 0 ? `${request.selectedMembers[0].firstName} ${request.selectedMembers[0].lastName}` : '—'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <p className="text-sm text-gray-900">{request.selectedMembers && request.selectedMembers.length > 0 ? request.selectedMembers[0].branch : '—'}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <p className="text-sm text-gray-900">{request.projectTitle || '—'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
              <p className="text-sm text-gray-900 leading-relaxed">{request.reason || '—'}</p>
            </div>
          </div>
          )}

          {/* Employee Details Section */}
          {!loading && !error && request && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Employee Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <p className="text-sm text-gray-900">{requesterName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <p className="text-sm text-gray-900">{request.senderId?.designation || '—'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <p className="text-sm text-gray-900">—</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <p className="text-sm text-gray-900">{request.senderId?.branch || '—'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">{request.senderId?.email || '—'}</p>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Action Buttons */}
          {!loading && !error && request && (
          <div className="flex justify-end gap-3">
            <button
              onClick={handleReject}
              disabled={request.status === 'Rejected'}
              className={`px-6 py-2 border rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                request.status === 'Rejected'
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={request.status === 'Approved'}
              className={`px-6 py-2 border rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                request.status === 'Approved'
                  ? 'bg-blue-100 text-blue-300 border-blue-100 cursor-not-allowed'
                  : 'bg-blue-600 text-white border-transparent hover:bg-blue-700'
              }`}
            >
              Approve
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeRequest;