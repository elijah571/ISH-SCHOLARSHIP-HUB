import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';
import InternshipPageHeader from '../components/internships/InternshipPageHeader';
import InternshipFiltersSidebar from '../components/internships/InternshipFiltersSidebar';
import InternshipList from '../components/internships/InternshipList';
import Pagination from '../components/scholarships/Pagination';

const InternshipListingPage = () => {
  const [filters, setFilters] = useState({
    location: 'all',
    duration: 'all',
    type: 'paid',
    industry: ''
  });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      location: 'all',
      duration: 'all',
      type: 'paid',
      industry: ''
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Subscribe" buttonLink="/register" />
      
      <Section background="gray" padding="py-8">
        <Container>
          <InternshipPageHeader
            search={search}
            setSearch={setSearch}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </Container>
      </Section>

      <Section padding="py-8">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <InternshipFiltersSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            </div>

            <div className="lg:col-span-3">
              <InternshipList />
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={8}
              />
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
};

export default InternshipListingPage;
