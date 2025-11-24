import React from 'react';
import logo from '../../assets/Image/Logo-c.svg';

const sections = [
  { id: 'hero', title: 'Transforming Field Sales' },
  { id: 'mission', title: 'Our Mission' },
  { id: 'what-we-do', title: 'What We Do' },
  { id: 'who-we-serve', title: 'Who We Serve' },
  { id: 'our-values', title: 'Our Values' },
  { id: 'why-salessphere', title: 'Why SalesSphere?' },
  { id: 'our-impact', title: 'Our Impact' },
  { id: 'looking-forward', title: 'Looking Forward' },
  { id: 'contact-us', title: 'Contact Us' },
];

interface AboutUsIndexProps {
  activeSection: string;
}

const AboutUsIndex: React.FC<AboutUsIndexProps> = ({ activeSection }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="sticky top-20 h-screen-minus-nav p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <img className="h-8 w-auto mr-2" src={logo} alt="SalesSphere Logo" />
        <h3 className="text-lg font-bold text-black">About Us</h3>
      </div>
      <nav>
        <ul>
          {sections.map((section) => (
            <li key={section.id} className="mb-2">
              <a
                href={`#${section.id}`}
                onClick={(e) => handleLinkClick(e, section.id)}
                className={`block text-sm ${
                  activeSection === section.id
                    ? 'text-blue-600 font-bold'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AboutUsIndex;
