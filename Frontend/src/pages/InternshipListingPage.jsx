import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';
import InternshipPageHeader from '../components/internships/InternshipPageHeader';
import InternshipFiltersSidebar from '../components/internships/InternshipFiltersSidebar';
import InternshipList from '../components/internships/InternshipList';
import Pagination from '../components/scholarships/Pagination';
import { useInternships } from '../context/InternshipContext';

const InternshipListingPage = () => {
  const { internships, loading, error, pagination, fetchInternships } = useInternships();

  const [filters, setFilters] = useState({
    location: '',
    type: '',
  });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const loadInternships = useCallback(() => {
    fetchInternships({
      page: currentPage,
      limit: 10,
      search: search.trim() || undefined,
      type: filters.type || undefined,
      country: filters.location || undefined,
    });
  }, [currentPage, search, filters, fetchInternships]);

  useEffect(() => {
    loadInternships();
  }, [loadInternships]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      location: '',
      type: '',
    });
    setSearch('');
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Subscribe" buttonLink="/register" />

      <Section background="gray" padding="py-8">
        <Container>
          <InternshipPageHeader
            search={search}
            setSearch={handleSearch}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showResultCount
            resultCount={pagination.total}
            loading={loading}
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
              <InternshipList
                internships={internships}
                loading={loading}
                error={error}
                onRetry={loadInternships}
              />
              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={handlePageChange}
                  totalPages={pagination.totalPages}
                />
              )}
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
};

export default InternshipListingPage;
