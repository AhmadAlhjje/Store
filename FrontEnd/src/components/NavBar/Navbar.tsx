import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // التحقق من وجود التوكن في localStorage عند تحميل الصفحة
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('token'); // حذف التوكن
    localStorage.removeItem('role'); // حذف الدور إذا كان موجودًا
    setIsLoggedIn(false); // تحديث الحالة
    setIsMenuOpen(false); // إغلاق القائمة المنسدلة
    navigate('/'); // إعادة توجيه إلى الصفحة الرئيسية
  };

  return (
    <nav className="bg-[#1E1E1E] text-teal-400 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* اسم الموقع في الطرف الأيمن */}
        <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600">
          TechStore
        </Link>

        {/* كلمة "منتجاتنا" في الوسط */}
        <Link
        to="/"
        className="text-lg font-medium text-teal-400 hover:text-teal-600 transition duration-300"
        >
          منتجاتنا
        </Link>

        {/* زر "المزيد" في الطرف الأيسر */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-4 py-2 bg-gray-800 text-teal-400 rounded-lg font-medium hover:bg-gray-700 transition duration-300 focus:outline-none"
          >
            المزيد ▼
          </button>

          {/* القائمة المنسدلة */}
          {isMenuOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
              {/* عناصر القائمة */}
              {isLoggedIn ? (
                <>
                  <Link
                    to="/cart"
                    className="block px-4 py-2 text-teal-400 hover:bg-gray-700 transition duration-300"
                  >
                    طلباتي
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700 transition duration-300"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-teal-400 hover:bg-gray-700 transition duration-300"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-teal-400 hover:bg-gray-700 transition duration-300"
                  >
                    تسجيل جديد
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;