import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Section } from '../components/Layout';
import ScholarshipList from '../components/scholarships/ScholarshipList';
import Pagination from '../components/scholarships/Pagination';
import CountryFiltersSidebar from '../components/scholarships/CountryFiltersSidebar';
import { slugToName } from '../data/countries';
import scholarshipService from '../services/scholarshipService';

const defaultFilters = {
  field_of_study: '',
  location: '',
  university: '',
  tuition_fees: '',
  duration: '',
  format: '',
  attendance: '',
  degree_type: '',
  special_programme: '',
};

const CountryScholarshipsPage = () => {
  const { country } = useParams();
  const countryName = slugToName(country);

  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(defaultFilters);

  const loadScholarships = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        country: countryName,
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const response = await scholarshipService.getAll(params);
      const data = response.data;
      setScholarships(data.data || data.scholarships || []);
      const pg = data.pagination || {};
      setPagination({
        total: pg.total ?? data.total ?? 0,
        page: pg.page ?? data.page ?? 1,
        totalPages: pg.totalPages ?? data.pages ?? 1,
      });
    } catch {
      setError('Failed to load scholarships. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, countryName, filters]);

  useEffect(() => {
    loadScholarships();
  }, [loadScholarships]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === '_apply') {
      setCurrentPage(1);
      loadScholarships();
      return;
    }
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar buttonText="Apply" buttonLink="/login" />

      <Section background="blue" padding="py-12">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Scholarships in {countryName}
            </h1>
            <p className="text-blue-100 text-lg">
              {pagination.total > 0
                ? `${pagination.total} scholarship${pagination.total !== 1 ? 's' : ''} available`
                : 'Discover opportunities for studying abroad'}
            </p>
          </div>
        </Container>
      </Section>

      <Section padding="py-8">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <CountryFiltersSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                resultCount={pagination.total}
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

export default CountryScholarshipsPage;
