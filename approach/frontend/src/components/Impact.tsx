import React from 'react';

export default function Impact() {
  const stats = [
    { label: 'Patients Supported', value: '100,000+' },
    { label: 'Research Grants', value: '$25M+' },
    { label: 'Global Partners', value: '50+' },
    { label: 'Years of Service', value: '53' },
  ];

  return (
    <div className="bg-red-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-red-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}