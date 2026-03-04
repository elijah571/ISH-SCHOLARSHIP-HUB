import React from 'react';
import { Container, Section } from './Layout';

const Hero = () => {
  return (
    <Section className="relative h-[520px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Students studying in library"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/70"></div>
      </div>

      {/* Content */}
      <Container className="relative z-10 h-full flex items-center">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Find Scholarships & Opportunities Worldwide
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Discover thousands of scholarships, internships, and educational opportunities tailored to your academic journey. Your future starts here.
          </p>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;