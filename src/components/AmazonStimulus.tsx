// AmazonStimulus component - displays product with advisor recommendation
import React from 'react';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { Product, Stimulus } from '@/lib/stimuliData';

interface AmazonStimulusProps {
  product: Product;
  stimulus: Stimulus;
}

export default function AmazonStimulus({ product, stimulus }: AmazonStimulusProps) {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Product Section */}
      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Product Image */}
        <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8">
          <div className="relative w-full h-80">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.rating} out of 5
            </span>
            <span className="ml-2 text-sm text-blue-600">
              ({product.reviews.toLocaleString()} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <span className="text-3xl font-bold text-red-700">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Add to Cart Button */}
          <button className="flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Advisor Recommendation Section */}
      <div className="border-t border-gray-200 bg-gray-50 p-6">
        <div className="max-w-3xl">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {stimulus.advisorType === 'AI' ? 'AI' : 'H'}
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-lg">{stimulus.advisorName}</h3>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                  stimulus.recommendation === 'Highly Recommended'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {stimulus.recommendation}
              </span>
            </div>
          </div>
          
          <div className="ml-16">
            <p className="text-gray-700 leading-relaxed">{stimulus.reasoning}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
