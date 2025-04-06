import React, { useState } from 'react';
import { toast } from 'react-toastify'; // استيراد مكتبة الإشعارات
import { updateCartItemQuantity, deleteCartItem } from '../../Api/CartApi';
import { CartItemProps } from '../../File/types';
import { BASE_URL } from '../../Api/api';

const CartItem: React.FC<CartItemProps> = ({ item, userId, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity > 0) {
      try {
        // التحقق من توفر الكمية
        if (newQuantity > item.product.quantity) {
          toast.error(`الكمية المطلوبة (${newQuantity}) غير متاحة. الكمية المتاحة: ${item.product.quantity}`, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'dark',
          });
          return; // عدم السماح بزيادة الكمية
        }

        // تحديث الكمية مؤقتًا
        setQuantity(newQuantity);

        // محاولة تحديث الكمية في الخادم
        await updateCartItemQuantity(item.id, userId, newQuantity);
        toast.success('تم تحديث الكمية بنجاح!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
      } catch (error: unknown) {
        // استعادة الكمية السابقة في حالة الفشل
        setQuantity((prevQuantity) => prevQuantity);

        // عرض رسالة خطأ بناءً على نوع الخطأ
        let errorMessage = 'حدث خطأ أثناء تحديث الكمية.';
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
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCartItem(item.id, userId);
      onRemove();
      toast.success('تم حذف المنتج بنجاح!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    } catch (error: unknown) {
      let errorMessage = 'حدث خطأ أثناء حذف المنتج.';
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
    <div className="flex items-center justify-between p-4 border-b border-teal-400">
      {/* صورة المنتج */}
      <img
        src={`${BASE_URL}/uploads/${item.product.image}`}
        alt={item.product.name}
        onError={(e) => {
          e.currentTarget.src = '/default-image.jpg'; // صورة افتراضية
        }}
        className="w-20 h-20 object-cover rounded-md"
      />
      {/* تفاصيل المنتج */}
      <div className="flex-grow ml-4">
        <h3 className="text-lg font-semibold text-teal-400">{item.product.name}</h3>
        <p className="text-gray-400">${item.product.price}</p>
      </div>
      {/* كمية المنتج */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleUpdateQuantity(quantity - 1)}
          className="px-3 py-1 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition duration-300 disabled:opacity-50"
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="text-lg font-medium text-gray-400">{quantity}</span>
        <button
          onClick={() => handleUpdateQuantity(quantity + 1)}
          className="px-3 py-1 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition duration-300"
        >
          +
        </button>
      </div>
      {/* زر الحذف */}
      <button
        onClick={handleDelete}
        className="ml-4 px-6 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition duration-300"
      >
        حذف
      </button>
    </div>
  );
};

export default CartItem;