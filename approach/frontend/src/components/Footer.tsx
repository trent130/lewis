import React from 'react';
import FooterColumn from './FooterColumn';

const Footer: React.FC = () => {
  const columns = [
    {
      title: 'Company',
      links: [
        { href: '/about', text: 'About Us' },
        { href: '/careers', text: 'Careers' },
        { href: '/contact', text: 'Contact' }
      ]
    },
    {
      title: 'Services',
      links: [
        { href: '/services', text: 'Web Development' },
        { href: '/services', text: 'Mobile Apps' },
        { href: '/services', text: 'Cloud Solutions' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { href: '/blog', text: 'Blog' },
        { href: '/docs', text: 'Documentation' },
        { href: '/support', text: 'Support' }
      ]
    },
    {
      title: 'Connect',
      links: [
        { href: 'https://twitter.com', text: 'Twitter' },
        { href: 'https://linkedin.com', text: 'LinkedIn' },
        { href: 'https://github.com', text: 'GitHub' }
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {columns.map((column, index) => (
            <FooterColumn
              key={index}
              title={column.title}
              links={column.links}
            />
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Lewis Paul Foundation
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Lewis Paul Foundation. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;