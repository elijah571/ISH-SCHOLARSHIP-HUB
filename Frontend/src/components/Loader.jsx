import React from 'react';

const Loader = ({ size = 'md', fullPage = false }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const dotSizes = {
    sm: 'w-[25%]',
    md: 'w-[30%]',
    lg: 'w-[28%]',
    xl: 'w-[30%]'
  };

  const dotClass = dotSizes[size];
  const containerClass = sizes[size];

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <Loader size={size} />
      </div>
    );
  }

  return (
    <div className={`relative ${containerClass}`}>
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s' }}>
        <div 
          className={`absolute bottom-1 left-0 ${dotClass} h-full bg-violet-600 rounded-full`}
          style={{
            animation: 'wobble1 0.8s infinite ease-in-out',
            animationDelay: '-0.3s',
            transformOrigin: '50% 85%'
          }}
        />
        <div 
          className={`absolute bottom-1 right-0 ${dotClass} h-full bg-violet-600 rounded-full`}
          style={{
            animation: 'wobble2 0.8s infinite ease-in-out',
            animationDelay: '-0.15s',
            transformOrigin: '50% 85%'
          }}
        />
        <div 
          className={`absolute bottom-[-5%] left-[35%] ${dotClass} h-full bg-violet-600 rounded-full`}
          style={{
            animation: 'wobble3 0.8s infinite ease-in-out'
          }}
        />
      </div>
      <style>{`
        @keyframes wobble1 {
          0%, 100% { transform: rotate(60deg) translateY(0%) scale(1); opacity: 1; }
          50% { transform: rotate(60deg) translateY(-66%) scale(0.65); opacity: 0.8; }
        }
        @keyframes wobble2 {
          0%, 100% { transform: rotate(-60deg) translateY(0%) scale(1); opacity: 1; }
          50% { transform: rotate(-60deg) translateY(-66%) scale(0.65); opacity: 0.8; }
        }
        @keyframes wobble3 {
          0%, 100% { transform: translateY(0%) scale(1); opacity: 1; }
          50% { transform: translateY(66%) scale(0.65); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default Loader;
