import {BASE_URL} from './api'

// دالة اضافة طلب
export const addToCart = async (
  user_id: number,
  product_id: number,
  quantity: number
) => {
  try {
    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id, product_id, quantity }),
    });
    if (!response.ok) {
      // إذا كان هناك خطأ في الاستجابة، نقوم بتحليل الرسالة من الخادم
      const errorData = await response.json();
      throw new Error(errorData.error || 'حدث خطأ أثناء إضافة المنتج إلى السلة');
    }
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    let errorMessage = 'حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
  }
};

// // دالة لجلب بيانات السلة
// export const fetchCartItems = async (userId: number, token: string) => {
//   try {
//     const response = await fetch(`${BASE_URL}/cart/${userId}`, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (!response.ok) {
//       throw new Error('حدث خطأ أثناء جلب بيانات السلة.');
//     }
//     const data = await response.json();
//     return data;
//   } catch (error: unknown) {
//     let errorMessage = 'حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.';
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     }
//     console.log(errorMessage);
//   }
// };


// // دالة لتحديث كمية المنتج في العربة  
// export const updateCartItemQuantity = async (
//   userId:number,
//   cartId: number,
//   quantity: number,
//   token: string
// ) => {
//   try {
//     console.log(userId)
//     console.log(cartId)
//     const response = await fetch(`${BASE_URL}/cart/${cartId}/${userId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ quantity }),
//     });

//     // التحقق من استجابة الخادم
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || 'حدث خطأ أثناء تحديث الكمية.');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error: unknown) {
//     let errorMessage = 'حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.';
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     }
//     console.log(errorMessage);
//     throw new Error(errorMessage);
//   }
// };

// // دالة لحذف المنتج من السلة
// export const deleteCartItem = async (
//   userId: number,
//   productId: number,
//   token: string
// ) => {
//   try {
//     const response = await fetch(`${BASE_URL}/cart/delete`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ user_id: userId, product_id: productId }),
//     });

//     if (!response.ok) {
//       throw new Error('حدث خطأ أثناء حذف المنتج.');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error: unknown) {
//     let errorMessage = 'حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.';
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     }
//     console.log(errorMessage);
//   }
// };

// src/api/cartApi.ts

export const getCartItems = async (userId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/cart/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch cart items: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (
  cartId: number,
  userId: number,
  quantity: number
) => {
  try {
    const response = await fetch(`${BASE_URL}/cart/${cartId}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update cart item: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const deleteCartItem = async (cartId: number, userId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/cart/${cartId}/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete cart item: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting cart item:', error);
    throw error;
  }
};

// src/Api/CartApi.ts
export const confirmOrder = async (userId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/confirmorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!response.ok) {
      // إذا كانت الاستجابة تحتوي على خطأ 400، نقرأ الرسالة من الخادم
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'حدث خطأ أثناء إتمام الطلب.');
      } else {
        throw new Error(`Failed to confirm order: ${response.statusText}`);
      }
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error confirming order:', error);
    throw error; // إعادة الخطأ ليتم التعامل معه في واجهة المستخدم
  }
};

