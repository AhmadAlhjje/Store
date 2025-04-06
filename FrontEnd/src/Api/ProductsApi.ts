import {BASE_URL} from './api'
import { Product } from '../File/types';

// دالة لجلب المنتجات من الـAPI
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data: Product[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// دالة للحصول على معلومات المنتج
export const fetchProductDetails = async (productId: number) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`);
    if (!response.ok) {
      throw new Error('حدث خطأ أثناء جلب بيانات المنتج.');
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