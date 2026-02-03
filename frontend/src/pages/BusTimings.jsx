import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api';
import { Clock, MapPin } from 'lucide-react';

const BusTimings = () => {
    const { t } = useTranslation();
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            const response = await api.get('/buses/');
            setBuses(response.data);
        } catch (error) {
            console.error('Error fetching buses:', error);
            if (error.code === 'ECONNABORTED' || error.response?.status === 504) {
                // Could act on this state to show specific "Waking up server..." message
                console.log("Server waking up...");
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredBuses = buses.filter(bus =>
        (bus.bus_number && bus.bus_number.includes(searchTerm)) ||
        (bus.bus_name && bus.bus_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        bus.start_point.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.start_point.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.end_point.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.time.localeCompare(b.time));

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-bold mb-8 text-gradient inline-block">{t('bus_timings')}</h1>

            <div className="mb-8">
                <input
                    type="text"
                    placeholder={t('search')}
                    className="w-full md:w-1/3 p-4 pl-6 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/80 backdrop-blur"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBuses.map((bus, index) => (
                            <div
                                key={bus.id}
                                className="glass-card rounded-2xl p-6 border-l-4 border-l-primary group hover:-translate-y-1"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-3">
                                        {bus.bus_name ? (
                                            <>
                                                <span className="bg-primary text-white font-bold text-lg px-3 py-1 rounded-lg shadow-sm">
                                                    {bus.bus_name}
                                                </span>
                                                {bus.bus_number && (
                                                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                        {bus.bus_number}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="bg-primary text-white font-bold text-lg px-3 py-1 rounded-lg shadow-sm">
                                                {bus.bus_number}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center flex-wrap gap-2">
                                        <span>{bus.start_point}</span>
                                        <span className="text-primary">→</span>
                                        <span>{bus.end_point}</span>
                                    </h3>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="w-5 h-5 mr-3 text-primary" />
                                        <span className="font-medium bg-gray-50 px-2 py-0.5 rounded">
                                            {formatTime(bus.time)}
                                        </span>
                                    </div>
                                    {bus.via && (
                                        <div className="flex items-start text-gray-600">
                                            <MapPin className="w-5 h-5 mr-3 text-primary mt-0.5" />
                                            <span className="text-sm">{t('via')}: {bus.via}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 text-center p-4 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-red-600 font-medium text-lg">{t('sunday_service_note')}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default BusTimings;
