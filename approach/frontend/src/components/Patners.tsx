import React from 'react';

const partners = [
  { name: 'Zendawa', logo: './zendawa.png' },
  { name: 'Lish', logo: './lish-ai-labs.jpg' },
  { name: 'Zen Pharmaceutical', logo: './zen-pharmaceutical.jpg' },
  { name: 'Zen Hospital', logo: './zen-pharmacy.jpg' },
];

export function Patners() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
          Our Trusted Partners
        </h2>
        <p className="text-lg text-gray-500 mb-16 max-w-xl mx-auto">
          We collaborate with industry leaders to bring innovative healthcare solutions. Our partners drive excellence in the healthcare and pharmaceutical sectors.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col items-center transition duration-300 transform hover:scale-105 hover:bg-white p-6 rounded-lg shadow-md"
            >
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="h-20 w-auto mb-4 object-contain rounded-lg"
              />
              <h3 className="text-xl font-semibold text-gray-800">{partner.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
