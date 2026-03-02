import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import Stats from '../components/Stats';
import FeaturedScholarships from '../components/FeaturedScholarships';
import HowItWorks from '../components/HowItWorks';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <SearchBar />
      <Stats />
      <FeaturedScholarships />
      <HowItWorks />
      <Newsletter />
      <Footer />
    </div>
  );
};


export default HomePage;