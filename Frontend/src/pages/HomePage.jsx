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
import '../App.css';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar 
      buttonText="Get Started"
      buttonLink="/register"
      />
      <Hero />
      <SearchBar />
      <Stats />
      <FeaturedScholarships />
      <HowItWorks />
      <section id='newsletter'>
        <Newsletter />
      </section>
      <Footer />
    </div>
  );
};


export default HomePage;