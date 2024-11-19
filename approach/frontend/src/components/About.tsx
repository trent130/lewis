import React from 'react';

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-3xl font-semibold text-red-800">About Our Foundation</h2>
        </div>
        <div className="space-y-8 text-gray-700">
          <p>
            Founded in 2024, our foundation has been at the forefront of the fight against sickle cell 
            disease. We are a non-profit organization dedicated to supporting individuals and families 
            affected by sickle cell anemia through comprehensive programs and services.
          </p>
          <p>
            Our work encompasses several key areas:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Patient Support Programs</li>
            <li>Medical Research Funding</li>
            <li>Public Health Education</li>
            <li>Advocacy for Better Healthcare Policies</li>
            <li>Community Outreach Initiatives</li>
          </ul>
          <p>
            Through partnerships with medical institutions, research facilities, and community 
            organizations, we work tirelessly to improve treatment options and ultimately find a cure 
            for sickle cell disease.
          </p>
        </div>
      </div>
    </div>
  );
}