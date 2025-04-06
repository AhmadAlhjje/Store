import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify'; // استيراد دالة toast
import { fetchProducts } from '../../Api/ProductsApi';
import { Product } from '../../File/types';
import { BASE_URL } from '../../Api/api';
import { addToCart } from '../../Api/CartApi';

const Home: React.FC = () => {
  // حالة لتخزين المنتجات
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    price: '',
    category: '',
    name: '',
  });
  const [quantityInputs, setQuantityInputs] = useState<{ [key: number]: number }>({}); // تخزين الكمية لكل منتج
  const [showQuantityInput, setShowQuantityInput] = useState<number | null>(null); // تحديد المنتج الذي يتم تحديد كميته

  // جلب المنتجات عند تحميل الصفحة
  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data); // تعيين جميع المنتجات كقيمة افتراضية للمنتجات المُرشحة
    };
    getProducts();
  }, []);

  // تحديث الفلاتر عند تغيير القيم
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // تطبيق الفلاتر على المنتجات
  useEffect(() => {
    let filtered = [...products];

    // فلتر السعر
    if (filters.price) {
      filtered = filtered.filter((product) => parseFloat(product.price) <= parseFloat(filters.price));
    }

    // فلتر الفئة
    if (filters.category) {
      filtered = filtered.filter((product) => product.category === filters.category);
    }

    // فلتر الاسم
    if (filters.name) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  // دالة لتحديث الكمية المدخلة
  const handleQuantityChange = (productId: number, value: string) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setQuantityInputs((prev) => ({
        ...prev,
        [productId]: parsedValue,
      }));
    }
  };

  // دالة إضافة المنتج إلى السلة باستخدام fetch
  const handleAddToCart = async (product: Product) => {
    try {
      // التحقق من وجود التوكن في localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('يرجى تسجيل الدخول لإضافة المنتجات إلى السلة.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
        return;
      }

      const quantity = quantityInputs[product.id] || 1; // استخدام الكمية المحددة أو الافتراضية (1)

      // التحقق مما إذا كانت الكمية المطلوبة متوفرة
      if (quantity > product.quantity) {
        toast.error(`الكمية المطلوبة (${quantity}) غير متاحة. الكمية المتبقية: ${product.quantity}`, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
        return;
      }

      // استخدام دالة API لإضافة المنتج إلى السلة
      const response = await addToCart(21, product.id, quantity); // يمكنك تعديل user_id ليكون ديناميكيًا

      // عرض رسالة النجاح إذا تم إضافة المنتج بنجاح
      toast.success(`تمت الإضافة بنجاح! الكمية المتبقية: ${response.remainingStock}`, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });

      setShowQuantityInput(null); // إغلاق نافذة تحديد الكمية
    } catch (error: unknown) {
      let errorMessage = 'حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-teal-400">
      {/* العنوان */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-5xl font-extrabold text-center py-10 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600"
      >
        منتجاتنا
      </motion.h1>

      {/* الفلاتر */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-8 px-4">
        {/* فلتر السعر */}
        <input
          type="number"
          placeholder="أقصى سعر"
          name="price"
          value={filters.price}
          onChange={handleFilterChange}
          className="px-4 py-3 rounded bg-gray-900 text-white border border-teal-400 focus:outline-none focus:border-teal-600 transition duration-300 text-lg"
        />

        {/* فلتر الفئة */}
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="px-16 py-3 rounded bg-gray-900 text-white border border-teal-400 focus:outline-none focus:border-teal-600 transition duration-300 text-lg"
        >
          <option value="">جميع الفئات</option>
          <option value="Electronics">إلكترونيات</option>
          <option value="Clothing">ملابس</option>
          <option value="Books">كتب</option>
        </select>

        {/* فلتر الاسم */}
        <input
          type="text"
          placeholder="بحث بالاسم"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          className="px-4 py-3 rounded bg-gray-900 text-white border border-teal-400 focus:outline-none focus:border-teal-600 transition duration-300 text-lg"
        />
      </div>

      {/* قائمة المنتجات */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 pb-16"
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 rounded-lg shadow-md p-6 text-center hover:shadow-teal-500/50 hover:scale-[1.02] transition-transform duration-300 relative"
            >
              {/* صورة المنتج */}
              <img
                src={`${BASE_URL}/uploads/${product.image}`}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = '/default-image.jpg'; // صورة افتراضية
                }}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              {/* اسم المنتج */}
              <h2 className="text-2xl font-bold text-teal-400">{product.name}</h2>
              {/* سعر المنتج */}
              <p className="text-xl font-semibold text-gray-400 mt-2">{product.price} دولار</p>
              {/* نوع المنتج */}
              <p className="text-sm text-gray-500 mt-2">{product.category}</p>
              {/* الكمية */}
              <p className="text-sm text-gray-500 mt-2">الكمية المتاحة: {product.quantity}</p>

              {/* زر إضافة إلى السلة */}
              {showQuantityInput === product.id ? (
                <div className="mt-4">
                  {/* حقل إدخال الكمية */}
                  <input
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={quantityInputs[product.id] || ''}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="px-4 py-2 rounded bg-gray-800 text-white border border-teal-400 focus:outline-none focus:border-teal-600 transition duration-300 text-lg w-full mb-2"
                  />
                  {/* زر التأكيد */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full px-6 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition duration-300"
                  >
                    تأكيد الطلب
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowQuantityInput(product.id)} // عرض حقل الكمية
                  className="mt-4 px-6 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition duration-300"
                >
                  أضف إلى السلة
                </button>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full text-lg font-medium">لم يتم العثور على منتجات.</p>
        )}
      </motion.div>
    </div>
  );
};

export default Home;