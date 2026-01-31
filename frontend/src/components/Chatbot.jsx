import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Map, Truck, Clock, MessageCircle, Loader2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! I can help you find buses, transport services, and places to visit. Ask me anything!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [messages, isOpen]);

    const handleSend = async (textOverride = null) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { type: 'user', text: textToSend }]);
        if (!textOverride) setInput('');
        setIsLoading(true);

        try {
            // Call the backend API
            // Note: Ensure the backend URL is correctly configured in api.js or proxy
            const res = await api.post('chat/', { query: textToSend });
            const { response, data, type } = res.data;

            setMessages(prev => [...prev, {
                type: 'bot',
                text: response,
                contentType: type,
                data: data
            }]);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                type: 'bot',
                text: "Sorry, I'm having trouble accessing the real-time data. Please try again later or check your connection."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    // Quick actions convert to queries or navigation
    const suggestions = [
        { text: 'Bus Timings', icon: <Clock size={14} />, action: () => handleSend("Show me bus timings") },
        { text: 'Taxi / Auto', icon: <Truck size={14} />, action: () => handleSend("Auto and Taxi services") },
        { text: 'Famous Places', icon: <Map size={14} />, action: () => handleSend("Tourist places") },
        { text: 'Feedback', icon: <MessageCircle size={14} />, action: () => navigate('/feedback') },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 border border-gray-100 overflow-hidden animate-slide-up flex flex-col h-[500px] max-h-[80vh]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-4 flex justify-between items-center text-white shadow-md z-10">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-wide">Smart Assistant</h3>
                                <div className="text-xs text-white/90 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                                    Online
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${msg.type === 'user'
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                </div>

                                {/* Structured Data Display */}
                                {msg.contentType === 'bus_list' && msg.data && (
                                    <div className="mt-2 w-[85%] space-y-2">
                                        {msg.data.map((bus) => (
                                            <div key={bus.id} className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm text-xs hover:border-indigo-300 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{bus.bus_number}</span>
                                                    <span className="font-bold text-gray-900">{bus.time}</span>
                                                </div>
                                                <div className="text-gray-600 flex items-center gap-1">
                                                    <span className="truncate max-w-[80px]">{bus.start_point}</span>
                                                    <ChevronRight size={12} />
                                                    <span className="truncate max-w-[80px]">{bus.end_point}</span>
                                                </div>
                                                {bus.via && <div className="mt-1 text-gray-400 italic font-light truncate">Via: {bus.via}</div>}
                                            </div>
                                        ))}
                                        <button onClick={() => navigate('/buses')} className="w-full text-xs text-center text-primary mt-1 hover:underline">View all buses</button>
                                    </div>
                                )}

                                {msg.contentType === 'place_list' && msg.data && (
                                    <div className="mt-2 w-[85%] space-y-2">
                                        {msg.data.slice(0, 3).map((place) => (
                                            <div key={place.id} className="bg-white p-2 rounded-xl border border-purple-100 shadow-sm flex gap-3 items-center">
                                                {place.image ? (
                                                    <img src={place.image} alt={place.name} className="w-10 h-10 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500">
                                                        <Map size={16} />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-gray-800 text-sm">{place.name}</div>
                                                    <a href={place.location_url || '#'} get target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">View Map</a>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => navigate('/places')} className="w-full text-xs text-center text-primary mt-1 hover:underline">See all places</button>
                                    </div>
                                )}

                                {msg.contentType === 'service_list' && msg.data && (
                                    <div className="mt-2 w-[85%] space-y-2">
                                        {msg.data.slice(0, 3).map((service) => (
                                            <div key={service.id} className="bg-white p-3 rounded-xl border border-orange-100 shadow-sm text-xs">
                                                <div className="font-bold text-gray-800">{service.provider_name}</div>
                                                <div className="text-gray-500">{service.service_type} • {service.contact_number}</div>
                                                <div className="mt-1 text-gray-400">{service.stand_location}</div>
                                            </div>
                                        ))}
                                        <button onClick={() => navigate('/transport')} className="w-full text-xs text-center text-primary mt-1 hover:underline">View all services</button>
                                    </div>
                                )}

                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex items-start">
                                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 border border-gray-100 shadow-sm">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions (Horizontal Scroll) */}
                    {messages.length < 3 && (
                        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
                            <div className="flex space-x-2">
                                {suggestions.map((s, idx) => (
                                    <button
                                        key={idx}
                                        onClick={s.action}
                                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors flex-shrink-0"
                                    >
                                        <span className="text-primary/80">{s.icon}</span>
                                        <span>{s.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-3 shadow-sm focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your question..."
                                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 focus:ring-0 p-0"
                                disabled={isLoading}
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className={`p-2 rounded-full transition-all duration-200 ${input.trim()
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/40 transform hover:scale-105'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-primary/30 transition-all duration-300 transform hover:scale-110 active:scale-95 ${isOpen
                    ? 'bg-gray-800 text-white rotate-90'
                    : 'bg-gradient-to-r from-primary to-secondary text-white'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
};

export default Chatbot;
