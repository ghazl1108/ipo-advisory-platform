import React, { useState } from 'react';
import { api } from '../utils/api';

const CreateCompany = () => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    founded_year: new Date().getFullYear(),
    is_active: true,
    employees: 0
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      // Convert string values to appropriate types
      const companyData = {
        ...formData,
        founded_year: parseInt(formData.founded_year),
        employees: parseInt(formData.employees)
      };

      await api.companies.createCompany(companyData);
      setSuccess(true);
      setFormData({
        name: '',
        industry: '',
        founded_year: new Date().getFullYear(),
        is_active: true,
        employees: 0
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-company">
      <h2>Create New Company</h2>
      {error && <div className="error">Error: {error}</div>}
      {success && <div className="success">Company created successfully!</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Company Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="industry">Industry:</label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="founded_year">Founded Year:</label>
          <input
            type="number"
            id="founded_year"
            name="founded_year"
            value={formData.founded_year}
            onChange={handleChange}
            min="1800"
            max="2100"
            required
          />
        </div>

        <div>
          <label htmlFor="employees">Number of Employees:</label>
          <input
            type="number"
            id="employees"
            name="employees"
            value={formData.employees}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        <button type="submit">Create Company</button>
      </form>
    </div>
  );
};

export default CreateCompany; 