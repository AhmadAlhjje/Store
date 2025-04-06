import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp/SignUp';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Navbar from './components/NavBar/Navbar';
import Footer from './components/Footer/Footer';
import { ToastContainer } from 'react-toastify'; // استيراد المكون الأساسي للمكتبة
import 'react-toastify/dist/ReactToastify.css'; // استيراد الأنماط الافتراضية
import Cart from './pages/Cart/Cart';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-black bg-gradient-to-b from-indigo-900 to-indigo-600">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart/>} />
        </Routes>
      </div>
      <Footer />
      {/* إضافة مكون ToastContainer */}
      <ToastContainer
        position="top-center" // تحديد مكان ظهور الرسالة (وسط الشاشة)
        autoClose={3000} // إغلاق الرسالة تلقائيًا بعد 3 ثوانٍ
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true} // لدعم اللغة العربية
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // اختيار الثيم الداكن
      />
    </BrowserRouter>
  );
};

export default App;