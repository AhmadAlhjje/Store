import {BASE_URL} from './api'

// دالة انشاء حساب
export const signUpUser = async (formData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        return true; // تم إنشاء الحساب بنجاح
      }else {
        console.error('خطأ في إنشاء الحساب:', response.statusText);
        return false; // فشل في إنشاء الحساب
      }
    } catch (error) {
      console.error('خطأ أثناء التواصل مع الخادم:', error);
      return false; // فشل في التواصل مع الخادم
    }
  };


// دالة تسجيل دخول
  export const loginUser = async (credentials: {
    email: string;
    password: string;
  }): Promise<{ token?: string; role?: string; error?: string }> => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        return { token: data.token, role: data.role }; // إرجاع الرمز والدور
      } else {
        return { error: 'Invalid credentials' }; 
      }
    } catch (error) {
      console.error('خطأ أثناء التواصل مع الخادم:', error);
      return { error: 'Database error' };
    }
  };