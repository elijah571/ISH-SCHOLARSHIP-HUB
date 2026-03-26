import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';
import PageHeader from '../components/scholarships/PageHeader';
import FiltersSidebar from '../components/scholarships/FiltersSidebar';
import ScholarshipList from '../components/scholarships/ScholarshipList';
import Pagination from '../components/scholarships/Pagination';
import { useScholarships } from '../context/ScholarshipContext';

const ScholarshipListingPage = () => {
  const { scholarships, loading, error, pagination, fetchScholarships } = useScholarships();

  const [filters, setFilters] = useState({
    country: '',
    funding_type: '',
  });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const loadScholarships = useCallback(() => {
    fetchScholarships({
      page: currentPage,
      limit: 10,
      search: search.trim() || undefined,
      country: filters.country || undefined,
      funding_type: filters.funding_type || undefined,
    });
  }, [currentPage, search, filters, fetchScholarships]);

  useEffect(() => {
    loadScholarships();
  }, [loadScholarships]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      country: '',
      funding_type: '',
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
      <Navbar />

      <Section background="gray" padding="py-8">
        <Container>
          <PageHeader
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
              <FiltersSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            </div>

            <div className="lg:col-span-3">
              <ScholarshipList
                scholarships={scholarships}
                loading={loading}
                error={error}
                onRetry={loadScholarships}
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

export default ScholarshipListingPage;
