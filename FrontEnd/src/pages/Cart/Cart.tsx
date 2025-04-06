import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify'; // إضافة مكتبة الإشعارات
import { getCartItems, confirmOrder } from '../../Api/CartApi';
import CartItemComponent from '../../components/CartItem/CartItem';
import { getUserIdFromToken } from '../../Api/api';
import { CartItem } from '../../File/types';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      const id = getUserIdFromToken();
      if (id) {
        setUserId(id);
        try {
          const items = await getCartItems(id);
          setCartItems(items);
        } catch (error) {
          toast.error(`حدث خطأ أثناء جلب عناصر العربة. ${error}`, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'dark',
          });
        }
      }
    };
    fetchCartItems();
  }, []);

  const handleConfirmOrder = async () => {
    if (userId) {
      try {
        await confirmOrder(userId);
        setCartItems([]);
        toast.success('تم إتمام الشراء بنجاح!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
      } catch (error: unknown) {
        let errorMessage = 'حدث خطأ أثناء إتمام الشراء.';
        if (error instanceof Error) {
          // التحقق من الرسالة المرتبطة بعدم توفر الكمية
          if (error.message.includes('Insufficient quantity')) {
            errorMessage = 'الكمية غير متوفرة للمنتج.';
          } else {
            errorMessage = error.message;
          }
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
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
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
        عربة التسوق
      </motion.h1>

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
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900 rounded-lg shadow-md p-6 text-center hover:shadow-teal-500/50 hover:scale-[1.02] transition-transform duration-300 relative"
            >
              {/* مكون CartItemComponent */}
              <CartItemComponent
                item={item}
                userId={userId!}
                onRemove={() => handleRemoveItem(item.id)}
              />
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full text-lg font-medium">العربة فارغة.</p>
        )}
      </motion.div>

      {/* زر إتمام الشراء */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black py-4 border-t border-gray-800">
          <button
            onClick={handleConfirmOrder}
            className="w-full max-w-2xl mx-auto px-6 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition duration-300"
          >
            إتمام الشراء
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;