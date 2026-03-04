import React from 'react';

const Card = ({ children, className = '', hover = true, ...props }) => {
  const baseClasses = 'bg-white rounded-xl shadow-md';
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardImage = ({ src, alt, className = '', ...props }) => (
  <img 
    src={src} 
    alt={alt} 
    className={`w-full h-48 object-cover rounded-t-xl ${className}`}
    {...props}
  />
);

const Badge = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800'
  };
  
  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

Card.Content = CardContent;
Card.Image = CardImage;
Card.Badge = Badge;

export default Card;