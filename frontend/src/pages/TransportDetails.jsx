import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import api from '../api';
import { Truck, Phone, Navigation, Map, Car } from 'lucide-react';
import AutoRickshawIcon from '../components/icons/AutoRickshawIcon';

const TransportDetails = () => {
    const { t } = useTranslation();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await api.get('/transport-services/');
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const query = new URLSearchParams(location.search);
    const filterType = query.get('type');

    const getTitle = () => {
        if (filterType === 'TEMPO') return t('tempo');
        if (filterType === 'AUTO') return t('auto');
        if (filterType === 'OTHER') return t('car_taxis');
        return t('transport_services');
    };

    const getServiceIcon = (type) => {
        switch (type) {
            case 'TEMPO': return <Truck className="w-6 h-6 text-primary" />;
            case 'AUTO': return <AutoRickshawIcon className="w-6 h-6 text-yellow-500" />;
            case 'OTHER': return <Car className="w-6 h-6 text-blue-500" />;
            default: return <Truck className="w-6 h-6 text-gray-500" />;
        }
    };

    const typesToShow = filterType ? [filterType] : ['AUTO', 'TEMPO', 'OTHER'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{getTitle()}</h1>

            {loading ? <p>Loading...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {typesToShow.map(type => {
                        const typeServices = services.filter(s => s.service_type === type);
                        // If filtering by specific type, show message if empty
                        if (typeServices.length === 0) {
                            return filterType ? <p key={type} className="text-gray-500">No services found for {getTitle()}.</p> : null;
                        }

                        return (
                            <div key={type} className="space-y-4">
                                {!filterType && <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">{type}</h2>}
                                {typeServices.map(service => (
                                    <div key={service.id} className="bg-white p-6 rounded-lg shadow-sm border hover:border-primary transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-gray-50 rounded-lg">
                                                    {getServiceIcon(service.service_type)}
                                                </div>
                                                <h3 className="text-lg font-bold">{service.provider_name}</h3>
                                            </div>
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono">{service.contact_number}</span>
                                        </div>
                                        <div className="mt-4 text-sm text-gray-600 space-y-2">
                                            <p className="flex items-center"><Navigation className="w-4 h-4 mr-2" /> Stand: {service.stand_location}</p>
                                            <p className="flex items-center"><Map className="w-4 h-4 mr-2" /> Area: {service.service_area}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TransportDetails;
