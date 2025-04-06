import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1E1E1E] text-teal-400 py-8">
      {/* الحاوية الرئيسية */}
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        {/* القسم الأول: اسم الموقع */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600">
            TechStore
          </h2>
        </div>

        {/* القسم الثاني: الروابط */}
        <div className="flex flex-col md:flex-row gap-4">
          <Link to="/about" className="text-lg font-medium text-teal-400 hover:text-teal-600 transition duration-300">
            من نحن
          </Link>
          <Link to="/contact" className="text-lg font-medium text-teal-400 hover:text-teal-600 transition duration-300">
            تواصل معنا
          </Link>
          <Link to="/privacy" className="text-lg font-medium text-teal-400 hover:text-teal-600 transition duration-300">
            سياسة الخصوصية
          </Link>
        </div>

        {/* القسم الثالث: وسائل التواصل الاجتماعي */}
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl text-teal-400 hover:text-teal-600 transition duration-300 ml-4"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl text-teal-400 hover:text-teal-600 transition duration-300 ml-4"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl text-teal-400 hover:text-teal-600 transition duration-300 ml-4"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;