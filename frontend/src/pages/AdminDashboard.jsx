import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, List, Trash2, X, Edit2 } from 'lucide-react';
import api from '../api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('buses');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [editingItem, setEditingItem] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/addadmin04');
    };

    const tabs = [
        { id: 'buses', label: 'Buses', endpoint: '/buses/' },
        { id: 'transport', label: 'Transport Services', endpoint: '/transport-services/' },
        { id: 'places', label: 'Famous Places', endpoint: '/places/' },
        { id: 'feedback', label: 'Feedback', endpoint: '/feedback/' },
    ];

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const endpoint = tabs.find(t => t.id === activeTab)?.endpoint;
            if (endpoint) {
                const response = await api.get(endpoint);
                let data = response.data;
                if (activeTab === 'buses') {
                    data.sort((a, b) => a.time.localeCompare(b.time));
                }
                setItems(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            const endpoint = tabs.find(t => t.id === activeTab)?.endpoint;
            await api.delete(`${endpoint}${id}/`);
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData(item);
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = tabs.find(t => t.id === activeTab)?.endpoint;
            if (editingItem) {
                // Update existing
                const response = await api.put(`${endpoint}${editingItem.id}/`, formData);
                setItems(items.map(item => item.id === editingItem.id ? response.data : item));
            } else {
                // Create new
                const response = await api.post(endpoint, formData);
                setItems([...items, response.data]);
            }
            closeModal();
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Failed to save item. Please check the inputs.');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({});
    };

    const renderFormFields = () => {
        const inputClass = "w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50/50 focus:bg-white backdrop-blur-sm mb-3";

        switch (activeTab) {
            case 'buses':
                return (
                    <>
                        <input name="bus_name" value={formData.bus_name || ''} placeholder="Bus Name" onChange={handleInputChange} className={inputClass} required />
                        <input name="bus_number" value={formData.bus_number || ''} placeholder="Bus Number" onChange={handleInputChange} className={inputClass} required />
                        <input name="start_point" value={formData.start_point || ''} placeholder="Start Point" onChange={handleInputChange} className={inputClass} required />
                        <input name="end_point" value={formData.end_point || ''} placeholder="End Point" onChange={handleInputChange} className={inputClass} required />
                        <input name="via" value={formData.via || ''} placeholder="Via (Optional)" onChange={handleInputChange} className={inputClass} />
                        <div className="w-full mb-3">
                            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">Time</label>
                            <input type="time" name="time" value={formData.time || ''} onChange={handleInputChange} className={inputClass} style={{ marginBottom: 0 }} required />
                        </div>
                    </>
                );
            case 'transport':
                return (
                    <>
                        <select name="service_type" value={formData.service_type || ''} onChange={handleInputChange} className={`${inputClass} appearance-none`} required>
                            <option value="">Select Service Type</option>
                            <option value="AUTO">Auto</option>
                            <option value="TEMPO">Tempo</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <input name="provider_name" value={formData.provider_name || ''} placeholder="Provider Name" onChange={handleInputChange} className={inputClass} required />
                        <input name="contact_number" value={formData.contact_number || ''} placeholder="Contact Number" onChange={handleInputChange} className={inputClass} required />
                        <input name="stand_location" value={formData.stand_location || ''} placeholder="Stand Location" onChange={handleInputChange} className={inputClass} required />
                        <input name="service_area" value={formData.service_area || ''} placeholder="Service Area" onChange={handleInputChange} className={inputClass} required />
                    </>
                );
            case 'places':
                return (
                    <>
                        <input name="name" value={formData.name || ''} placeholder="Place Name" onChange={handleInputChange} className={inputClass} required />
                        <textarea name="description" value={formData.description || ''} placeholder="Description" onChange={handleInputChange} className={inputClass} rows="3" required />
                        <input name="location_url" value={formData.location_url || ''} placeholder="Location Map URL" onChange={handleInputChange} className={inputClass} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100/50">
            {/* Header */}
            <div className="glass sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    <button onClick={handleLogout} className="text-red-600 hover:text-red-800 flex items-center font-medium transition-colors p-2 hover:bg-red-50 rounded-lg">
                        <LogOut className="w-5 h-5 mr-2" /> Logout
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex space-x-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50 hover:shadow shadow-sm'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="glass-card rounded-2xl p-8 min-h-[400px] border border-white/50 animate-slide-up">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 capitalize flex items-center">
                            <div className="w-1 h-8 bg-primary rounded-full mr-3"></div>
                            {tabs.find(t => t.id === activeTab)?.label} Management
                        </h2>
                        {activeTab !== 'feedback' && (
                            <button
                                onClick={() => { setEditingItem(null); setFormData({}); setIsModalOpen(true); }}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-green-500/30 hover:scale-[1.02] transition-all flex items-center font-medium"
                            >
                                <Plus className="w-5 h-5 mr-2" /> Add New
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-gray-100">
                            {items.length === 0 ? (
                                <div className="text-center text-gray-500 py-16">
                                    <List className="w-16 h-16 mb-4 mx-auto opacity-30" />
                                    <p className="text-lg">No items found.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-100">
                                            <th className="p-4 font-semibold text-gray-600 first:rounded-tl-xl">ID</th>
                                            {activeTab === 'buses' && <th className="p-4 font-semibold text-gray-600">Bus</th>}
                                            {activeTab === 'buses' && <th className="p-4 font-semibold text-gray-600">Route</th>}
                                            {activeTab === 'buses' && <th className="p-4 font-semibold text-gray-600">Time</th>}
                                            {activeTab === 'transport' && <th className="p-4 font-semibold text-gray-600">Provider</th>}
                                            {activeTab === 'transport' && <th className="p-4 font-semibold text-gray-600">Type</th>}
                                            {activeTab === 'places' && <th className="p-4 font-semibold text-gray-600">Name</th>}
                                            {activeTab === 'feedback' && <th className="p-4 font-semibold text-gray-600">User</th>}
                                            {activeTab === 'feedback' && <th className="p-4 font-semibold text-gray-600">Message</th>}
                                            <th className="p-4 font-semibold text-gray-600 text-right last:rounded-tr-xl">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {items.map(item => (
                                            <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                                                <td className="p-4 text-gray-500 font-mono text-sm">#{item.id.slice(0, 8)}</td>
                                                {activeTab === 'buses' && (
                                                    <>
                                                        <td className="p-4">
                                                            <div className="font-bold text-gray-800">{item.bus_number}</div>
                                                            <div className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-1">{item.bus_name}</div>
                                                        </td>
                                                        <td className="p-4 text-gray-600">
                                                            <span className="font-medium">{item.start_point}</span>
                                                            <span className="text-gray-400 mx-2">→</span>
                                                            <span className="font-medium">{item.end_point}</span>
                                                        </td>
                                                        <td className="p-4 text-gray-600 font-mono">
                                                            {new Date(`1970-01-01T${item.time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                        </td>
                                                    </>
                                                )}
                                                {activeTab === 'transport' && (
                                                    <>
                                                        <td className="p-4 font-medium text-gray-800">{item.provider_name}</td>
                                                        <td className="p-4"><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">{item.service_type}</span></td>
                                                    </>
                                                )}
                                                {activeTab === 'places' && (
                                                    <td className="p-4 font-medium text-gray-800">{item.name}</td>
                                                )}
                                                {activeTab === 'feedback' && (
                                                    <>
                                                        <td className="p-4 font-medium text-gray-800">{item.name || 'Anonymous'}</td>
                                                        <td className="p-4 text-gray-600 truncate max-w-xs">{item.message}</td>
                                                    </>
                                                )}
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        {activeTab !== 'feedback' && (
                                                            <button
                                                                onClick={() => handleEdit(item)}
                                                                className="text-blue-500 hover:text-white p-2 rounded-lg hover:bg-blue-500 transition-all shadow-sm hover:shadow-md"
                                                                title="Edit"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="text-red-500 hover:text-white p-2 rounded-lg hover:bg-red-500 transition-all shadow-sm hover:shadow-md"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="glass-card rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border border-white/60 animate-slide-up">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 bg-white/50 hover:bg-white rounded-full p-1 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                            {editingItem
                                ? <span className="text-blue-600 mr-2"><Edit2 className="w-6 h-6" /></span>
                                : <span className="text-green-600 mr-2"><Plus className="w-6 h-6" /></span>
                            }
                            {editingItem ? 'Edit' : 'Add New'} {tabs.find(t => t.id === activeTab)?.label.slice(0, -1)}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-1 mb-8">
                                {renderFormFields()}
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {editingItem ? 'Update' : 'Save'} Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
