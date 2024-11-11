import React from 'react';

interface FooterLink {
  href: string;
  text: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => {
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-xl font-bold text-white/90 tracking-wide">{title}</h3>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center"
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterColumn;