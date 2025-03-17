import React from 'react';
import Select from 'react-select';
import citiesData from '../data/cities.json';

interface City {
  id: number;
  name: string;
  country: string;
  lat: string;
  lng: string;
}

interface DestinationSelectProps {
  value: { label: string; value: string } | null;
  onChange: (option: { label: string; value: string } | null) => void;
}

const DestinationSelect: React.FC<DestinationSelectProps> = ({ value, onChange }) => {
  // Format cities for react-select
  const cities = citiesData.map((city: City) => ({
    value: `${city.id}`,
    label: `${city.name}, ${city.country}`,
  }));

  return (
    <Select
      value={value}
      onChange={onChange}
      options={cities}
      placeholder="Search for a city..."
      isClearable
      className="react-select-container"
      classNamePrefix="react-select"
      styles={{
        control: (styles) => ({
          ...styles,
          borderColor: '#d1d5db',
          '&:hover': {
            borderColor: '#9ca3af',
          },
          boxShadow: 'none',
          borderRadius: '0.375rem',
          padding: '0.25rem',
          minHeight: '42px',
        }),
        option: (styles, { isFocused, isSelected }) => ({
          ...styles,
          backgroundColor: isSelected
            ? '#3b82f6'
            : isFocused
            ? '#dbeafe'
            : undefined,
          color: isSelected ? 'white' : '#374151',
        }),
        input: (styles) => ({
          ...styles,
          color: '#374151',
        }),
        singleValue: (styles) => ({
          ...styles,
          color: '#374151',
        }),
      }}
      noOptionsMessage={() => "No cities found"}
    />
  );
};

export default DestinationSelect;
