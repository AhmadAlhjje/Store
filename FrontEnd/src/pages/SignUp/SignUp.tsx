import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; // استيراد useNavigate
import { signUpUser } from '../../Api/UserApi'; // استيراد دالة signUpUser

const SignUp: React.FC = () => {
  // حالة لتخزين قيم الحقول
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  // حالة لعرض رسالة النجاح
  const [isSuccess, setIsSuccess] = useState(false);

  // حركة الانفجار عند ظهور الصفحة
  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // استخدام useNavigate للتوجيه
  const navigate = useNavigate();

  // دالة لتحديث قيم الحقول
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // دالة لإرسال البيانات إلى الـAPI باستخدام دالة signUpUser
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await signUpUser(formData); // استدعاء دالة signUpUser
    if (success) {
      // تحديث الحالة لعرض رسالة النجاح
      setIsSuccess(true);

      // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول بعد 3 ثوانٍ
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } else {
      alert('الحساب موجود مسبقا');
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
        <h1 className="text-4xl font-bold text-teal-400">Tech Register</h1>
        <p className="mt-2 text-sm text-gray-400">قم بإنشاء حساب جديد لديك الآن!</p>
      </div>

      {/* صندوق التسجيل */}
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-2xl border border-teal-400">
        {/* الحقول */}
        <input
          type="text"
          placeholder="الاسم"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 mb-4 text-white bg-transparent border-2 border-teal-400 rounded focus:outline-none focus:border-teal-600"
          required
        />

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

        {/* الدور (User/Admin) */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-3 mb-6 text-white bg-transparent border-2 border-teal-400 rounded focus:outline-none focus:border-teal-600"
        >
          <option value="user" className="bg-gray-800 text-white">
            User
          </option>
          <option value="admin" className="bg-gray-800 text-white">
            Admin
          </option>
        </select>

        {/* زر تسجيل */}
        <button
          type="submit"
          className="w-full py-3 text-lg font-bold text-white bg-teal-500 rounded hover:bg-teal-600 transition duration-300"
        >
          انشاء حساب
        </button>
      </form>

      {/* رسالة النجاح */}
      {isSuccess && (
        <p className="mt-4 text-green-400 text-center">
          تم إنشاء الحساب بنجاح! سيتم تحويلك إلى صفحة تسجيل الدخول خلال 4 ثوانٍ...
        </p>
      )}

      {/* رابط تسجيل الدخول */}
      <p className="mt-6 text-sm text-gray-400">
        لديك حساب بالفعل؟{' '}
        <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium">
          تسجيل الدخول
        </Link>
      </p>
    </motion.div>
  );
};

export default SignUp;