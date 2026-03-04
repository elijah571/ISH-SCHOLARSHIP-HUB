import React from 'react';

const Container = ({ children, className = '', size = '7xl', ...props }) => {
  const sizes = {
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  return (
    <div className={`mx-auto px-4 md:px-6 ${sizes[size]} ${className}`} {...props}>
      {children}
    </div>
  );
};

const Section = ({ children, className = '', background = 'white', padding = 'py-16', ...props }) => {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    blue: 'bg-gradient-to-r from-blue-600 to-blue-700'
  };

  return (
    <section className={`${backgrounds[background]} ${padding} ${className}`} {...props}>
      {children}
    </section>
  );
};

export { Container, Section };