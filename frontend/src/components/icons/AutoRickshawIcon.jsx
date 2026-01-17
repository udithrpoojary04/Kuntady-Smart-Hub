import React from 'react';

const AutoRickshawIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {/* Roof/Top */}
        <path d="M4 10h16a2 2 0 0 1 2 2v3h-2.5a2.5 2.5 0 0 0 0 5H18v-2h-3v2h-6v-2H6v2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z" />
        {/* Wheels */}
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="16.5" cy="17.5" r="2.5" />
        {/* Front/Windshield area suggestion */}
        <path d="M4 10l2-4h12l2 4" />
        <path d="M12 10v4" />
    </svg>
);

export default AutoRickshawIcon;
