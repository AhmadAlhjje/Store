export interface Product {
    id: number;
    name: string;
    price: string; // يمكنك تغييره إلى `number` إذا كان السعر رقميًا
    category: string;
    image: string;
    quantity: number;
  }

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
    category: string;
    image: string;
    quantity: number;
  };
}


export interface CartItemProps {
  item: {
    id: number;
    product_id: number;
    quantity: number;
    product: {
      quantity: number;
      name: string;
      price: string;
      image: string;
    };
  };
  userId: number;
  onRemove: () => void;
}