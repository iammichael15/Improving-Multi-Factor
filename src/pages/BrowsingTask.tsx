import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSessionStore } from '../store/session';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export function BrowsingTask() {
  const navigate = useNavigate();
  const { sessionId } = useSessionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const products: Product[] = [
    {
      id: 1,
      name: "Classic White Sneakers",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
      description: "Comfortable everyday sneakers with modern design"
    },
    {
      id: 2,
      name: "Leather Backpack",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
      description: "Stylish and durable leather backpack for daily use"
    },
    {
      id: 3,
      name: "Wireless Headphones",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      description: "Premium wireless headphones with noise cancellation"
    },
    {
      id: 4,
      name: "Smart Watch",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      description: "Feature-rich smartwatch with health tracking"
    }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (productId: number) => {
    setCart([...cart, productId]);
  };

  const toggleFavorite = (productId: number) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const handleSubmit = async () => {
    if (cart.length < 2 || favorites.length < 1) return;
    
    setIsSubmitting(true);
    try {
      if (!sessionId) throw new Error('No session ID found');
      
      const duration = Date.now() - startTime;
      
      const { error } = await supabase
        .from('task_completions')
        .insert([
          {
            session_id: sessionId,
            task_type: 'browsing',
            duration: duration
          }
        ]);

      if (error) throw error;
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving task completion:', error);
      setIsSubmitting(false);
    }
  };

  const isTaskComplete = cart.length >= 2 && favorites.length >= 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Shop Products</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-center object-cover w-full h-full group-hover:opacity-75"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.includes(product.id) ? 'fill-current text-red-500' : ''
                    }`}
                  />
                </button>
              </div>
              <p className="text-sm font-medium text-gray-900">${product.price}</p>
              <button
                onClick={() => addToCart(product.id)}
                className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Task requirements: Add at least 2 items to cart and favorite at least 1 item
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Cart items: {cart.length}/2 | Favorites: {favorites.length}/1
          </p>
          {isTaskComplete && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                isSubmitting
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Complete Task & View Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}