import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await api.companies.getCompanies();
        setCompanies(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch companies');
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="company-list">
      <h2>Companies</h2>
      {companies.length === 0 ? (
        <p>No companies found</p>
      ) : (
        <ul>
          {companies.map((company) => (
            <li key={company.id}>
              <h3>{company.name}</h3>
              {/* Add more company details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanyList; 