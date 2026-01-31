import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bus, MapPin, Truck, MessageSquare, ShieldCheck, Globe, Menu, X, Car } from 'lucide-react';
import AutoRickshawIcon from './icons/AutoRickshawIcon';

import logo from '../assets/logo.png';

const Navbar = () => {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'kn' : 'en');
    };

    const [isOpen, setIsOpen] = React.useState(false);

    // Close mobile menu when route changes
    React.useEffect(() => {
        setIsOpen(false);
    }, [window.location.pathname]);

    const NavLink = ({ to, icon: Icon, label }) => (
        <Link to={to} className="group flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors duration-200">
            <div className="p-2 rounded-lg group-hover:bg-primary/10 transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <span className="font-medium">{label}</span>
        </Link>
    );

    const MobileNavLink = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            className="flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:text-primary hover:bg-primary/5 transition-all"
            onClick={() => setIsOpen(false)}
        >
            <div className="p-2 rounded-lg bg-gray-50 text-primary">
                <Icon className="w-5 h-5" />
            </div>
            <span className="font-medium">{label}</span>
        </Link>
    );

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <img src={logo} alt="Smart Kuntady Logo" className="w-12 h-12 object-contain group-hover:rotate-6 transition-transform duration-300" />
                            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary truncate max-w-[200px] md:max-w-none">
                                {t('app_title')}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <NavLink to="/buses" icon={Bus} label={t('bus_timings')} />
                        <NavLink to="/transport?type=TEMPO" icon={Truck} label={t('tempo')} />
                        <NavLink to="/transport?type=AUTO" icon={AutoRickshawIcon} label={t('auto')} />
                        <NavLink to="/transport?type=OTHER" icon={Car} label={t('car_taxis')} />
                        <NavLink to="/places" icon={MapPin} label={t('famous_places')} />
                        <NavLink to="/feedback" icon={MessageSquare} label={t('feedback')} />

                        <div className="h-8 w-px bg-gray-200 mx-2" />

                        <button
                            onClick={toggleLanguage}
                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-sm text-gray-700"
                        >
                            <Globe className="w-4 h-4" />
                            <span>{i18n.language.toUpperCase()}</span>
                        </button>


                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden space-x-3">
                        <button
                            onClick={toggleLanguage}
                            className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            <Globe className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            {isOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden absolute top-full left-0 right-0 glass border-b border-white/20 shadow-xl transition-all duration-300 ease-in-out origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 h-0'}`}>
                <div className="p-4 space-y-2">
                    <MobileNavLink to="/buses" icon={Bus} label={t('bus_timings')} />
                    <MobileNavLink to="/transport?type=TEMPO" icon={Truck} label={t('tempo')} />
                    <MobileNavLink to="/transport?type=AUTO" icon={AutoRickshawIcon} label={t('auto')} />
                    <MobileNavLink to="/transport?type=OTHER" icon={Car} label={t('car_taxis')} />
                    <MobileNavLink to="/places" icon={MapPin} label={t('famous_places')} />
                    <MobileNavLink to="/feedback" icon={MessageSquare} label={t('feedback')} />

                    <div className="pt-2 border-t border-gray-100 flex flex-col space-y-3">
                        <button
                            onClick={() => { toggleLanguage(); setIsOpen(false); }}
                            className="flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:text-primary hover:bg-primary/5 transition-all w-full text-left"
                        >
                            <div className="p-2 rounded-lg bg-gray-50 text-secondary">
                                <Globe className="w-5 h-5" />
                            </div>
                            <span className="font-medium">{t('change_language')} ({i18n.language.toUpperCase()})</span>
                        </button>


                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
