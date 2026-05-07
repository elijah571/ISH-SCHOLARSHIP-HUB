import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { nameToSlug } from '../data/countries';
import scholarshipService from '../services/scholarshipService';

const CountryDropdown = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    scholarshipService
      .getCountries()
      .then((res) => setCountries(res.data.data || []))
      .catch(() => setCountries([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (!isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobile]);

  const countryItems = countries.map((c) => ({
    name: c.name,
    slug: nameToSlug(c.name),
    count: c.count,
  }));

  if (isMobile) {
    return (
      <div className="py-2">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2 px-2">
          Countries
        </h4>
        {loading ? (
          <div className="px-4 py-2 text-sm text-gray-400">Loading...</div>
        ) : countryItems.length === 0 ? (
          <div className="px-4 py-2 text-sm text-gray-400">No countries available</div>
        ) : (
          <div className="space-y-1">
            {countryItems.map((country) => (
              <Link
                key={country.slug}
                to={`/countries/${country.slug}`}
                className="block px-4 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                {country.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
      >
        Countries
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {loading ? (
            <div className="px-4 py-3 text-sm text-gray-400">Loading...</div>
          ) : countryItems.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400">No countries available</div>
          ) : (
            countryItems.map((country) => (
              <Link
                key={country.slug}
                to={`/countries/${country.slug}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              >
                {country.name}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CountryDropdown;
