import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  category: string;
  name: string; // I assume the name should be a string, not a number.
  inStock: boolean;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get('https://simple-grocery-store-api.online/products');
  return response.data;
};

// Custom hook for fetching products based on category
export const useProducts = (category: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await fetchProducts();
        // Filter the products by category
        const filteredProducts = allProducts.filter((product) => product.category === category);
        setProducts(filteredProducts);
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [category]);

  return { products, loading, error };
};
