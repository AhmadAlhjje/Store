import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../Api/UserApi';

const Login: React.FC = () => {
  // حالة لتخزين قيم الحقول
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // حركة الانفجار عند ظهور الصفحة
  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // استخدام useNavigate للتوجيه
  const navigate = useNavigate();

  // دالة لتحديث قيم الحقول
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // دالة لإرسال البيانات إلى الـAPI باستخدام دالة loginUser
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { token, role, error } = await loginUser(formData);

    if (token && role) {
      // تخزين الرمز والدور في localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // إعادة توجيه بناءً على الدور
      if (role === 'admin') {
        navigate('/dashboard'); 
      } else if (role === 'user') {
        navigate('/'); 
      }
    } else {
      alert(error || 'حدث خطأ أثناء تسجيل الدخول.');
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col items-center justify-center min-h-screen bg-black text-teal-400"
    >
      {/* عنوان الصفحة */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-teal-400">Tech Login</h1>
        <p className="mt-2 text-sm text-gray-400">مرحبًا بك مرة أخرى! يرجى تسجيل الدخول.</p>
      </div>

      {/* صندوق تسجيل الدخول */}
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-2xl border border-teal-400">
        {/* الحقول */}
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 mb-4 text-white bg-transparent border-2 border-teal-400 rounded focus:outline-none focus:border-teal-600"
          required
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 mb-4 text-white bg-transparent border-2 border-teal-400 rounded focus:outline-none focus:border-teal-600"
          required
        />

        {/* زر تسجيل الدخول */}
        <button
          type="submit"
          className="w-full py-3 text-lg font-bold text-white bg-teal-500 rounded hover:bg-teal-600 transition duration-300"
        >
          تسجيل الدخول
        </button>
      </form>

      {/* رابط إنشاء حساب */}
      <p className="mt-6 text-sm text-gray-400">
        ليس لديك حساب؟{' '}
        <Link to="/signup" className="text-teal-400 hover:text-teal-300 font-medium">
          اشترك الآن
        </Link>
      </p>
    </motion.div>
  );
};

export default Login;