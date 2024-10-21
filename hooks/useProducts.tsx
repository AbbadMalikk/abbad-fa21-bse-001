import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  id: number;
  category: string;
  name: string;
  inStock: boolean;
}

// Function to fetch products from the API
const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get('https://simple-grocery-store-api.online/products');
  return response.data;
};

// Function to store products in AsyncStorage
const storeProductsInCache = async (products: Product[]) => {
  try {
    const jsonValue = JSON.stringify(products);
    await AsyncStorage.setItem('@products_cache', jsonValue);
  } catch (err) {
    console.log('Error storing products in cache', err);
  }
};

// Function to retrieve products from AsyncStorage
const getProductsFromCache = async (): Promise<Product[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('@products_cache');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (err) {
    console.log('Error retrieving products from cache', err);
    return null;
  }
};

// Custom hook for fetching products based on category
export const useProducts = (category: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await fetchProducts();
        const filteredProducts = allProducts.filter((product) => product.category === category);
        setProducts(filteredProducts);
        // Store the fetched products in cache
        await storeProductsInCache(allProducts);
      } catch (err) {
        setError('Error fetching products. Trying offline cache...');
        // If there’s an error, try fetching from cache
        const cachedProducts = await getProductsFromCache();
        if (cachedProducts) {
          const filteredProducts = cachedProducts.filter((product) => product.category === category);
          setProducts(filteredProducts);
          setError(null); // Clear the error if cached data is used
        } else {
          setError('No data available offline.');
        }
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [category]);

  return { products, loading, error };
};
