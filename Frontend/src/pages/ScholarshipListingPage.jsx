import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';
import PageHeader from '../components/scholarships/PageHeader';
import FiltersSidebar from '../components/scholarships/FiltersSidebar';
import ScholarshipList from '../components/scholarships/ScholarshipList';
import Pagination from '../components/scholarships/Pagination';

const ScholarshipListingPage = () => {
  const [filters, setFilters] = useState({
    category: 'academic',
    level: 'postgraduate',
    funding: 'all',
    country: '',
    amount: ''
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
      category: 'academic',
      level: 'postgraduate',
      funding: 'all',
      country: '',
      amount: ''
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Page Header */}
      <Section background="gray" padding="py-8">
        <Container>
          <PageHeader
            search={search}
            setSearch={setSearch}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </Container>
      </Section>

      {/* Main Content */}
      <Section padding="py-8">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FiltersSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            </div>

            {/* Scholarship List */}
            <div className="lg:col-span-3">
              <ScholarshipList
                search={search}
                filters={filters}
                sortBy={sortBy}
                currentPage={currentPage}
              />
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={10}
              />
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
};

export default ScholarshipListingPage;