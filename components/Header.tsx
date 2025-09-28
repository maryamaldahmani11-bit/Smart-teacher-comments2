
import React from 'react';

interface HeaderProps {
    title: string;
    subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    return (
        <header className="text-center p-4 sm:p-6 bg-white shadow-md">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark font-sans">{title}</h1>
            <p className="text-md sm:text-lg text-gray-600 mt-2 font-arabic">{subtitle}</p>
        </header>
    );
};

export default Header;
