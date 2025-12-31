// Stimuli data for the experiment
// 2x2 factorial design: AI/Human x Congruent/Incongruent

export type AdvisorType = 'AI' | 'Human';
export type CongruenceType = 'Congruent' | 'Incongruent';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  imageUrl: string;
}

export interface Stimulus {
  id: string;
  productId: string;
  advisorType: AdvisorType;
  congruenceType: CongruenceType;
  advisorName: string;
  recommendation: string;
  reasoning: string;
}

// Three products for the experiment
export const products: Product[] = [
  {
    id: 'product1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality over-ear headphones with active noise cancellation and 30-hour battery life.',
    price: 89.99,
    rating: 4.5,
    reviews: 1250,
    imageUrl: '/images/product1.svg',
  },
  {
    id: 'product2',
    name: 'Smart Fitness Tracker Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, and sleep tracking capabilities.',
    price: 129.99,
    rating: 4.3,
    reviews: 890,
    imageUrl: '/images/product2.svg',
  },
  {
    id: 'product3',
    name: 'Portable Power Bank 20000mAh',
    description: 'High-capacity power bank with fast charging and multiple device support.',
    price: 45.99,
    rating: 4.7,
    reviews: 2100,
    imageUrl: '/images/product3.svg',
  },
];

// Generate stimuli for 2x2 factorial design
export const stimuli: Stimulus[] = [
  // Product 1 - AI Congruent
  {
    id: 'stim1',
    productId: 'product1',
    advisorType: 'AI',
    congruenceType: 'Congruent',
    advisorName: 'AI Recommendation System',
    recommendation: 'Highly Recommended',
    reasoning: 'Based on analysis of 1,250 customer reviews and technical specifications, this product offers excellent value with its noise cancellation feature and long battery life.',
  },
  // Product 1 - AI Incongruent
  {
    id: 'stim2',
    productId: 'product1',
    advisorType: 'AI',
    congruenceType: 'Incongruent',
    advisorName: 'AI Recommendation System',
    recommendation: 'Not Recommended',
    reasoning: 'Analysis suggests concerns about build quality and comfort during extended use, despite positive reviews.',
  },
  // Product 1 - Human Congruent
  {
    id: 'stim3',
    productId: 'product1',
    advisorType: 'Human',
    congruenceType: 'Congruent',
    advisorName: 'Expert Audio Reviewer',
    recommendation: 'Highly Recommended',
    reasoning: 'I\'ve personally tested these headphones for weeks. The sound quality is impressive and the noise cancellation works wonderfully for the price point.',
  },
  // Product 1 - Human Incongruent
  {
    id: 'stim4',
    productId: 'product1',
    advisorType: 'Human',
    congruenceType: 'Incongruent',
    advisorName: 'Expert Audio Reviewer',
    recommendation: 'Not Recommended',
    reasoning: 'In my experience, these headphones don\'t live up to the hype. There are better alternatives in this price range.',
  },
  // Product 2 - AI Congruent
  {
    id: 'stim5',
    productId: 'product2',
    advisorType: 'AI',
    congruenceType: 'Congruent',
    advisorName: 'AI Recommendation System',
    recommendation: 'Highly Recommended',
    reasoning: 'Data analysis indicates strong performance metrics across fitness tracking accuracy and battery efficiency, with consistent positive feedback from users.',
  },
  // Product 2 - AI Incongruent
  {
    id: 'stim6',
    productId: 'product2',
    advisorType: 'AI',
    congruenceType: 'Incongruent',
    advisorName: 'AI Recommendation System',
    recommendation: 'Not Recommended',
    reasoning: 'Algorithm analysis reveals potential issues with GPS accuracy and app compatibility that may affect user experience.',
  },
  // Product 2 - Human Congruent
  {
    id: 'stim7',
    productId: 'product2',
    advisorType: 'Human',
    congruenceType: 'Congruent',
    advisorName: 'Fitness Tech Specialist',
    recommendation: 'Highly Recommended',
    reasoning: 'As a fitness enthusiast, I find this tracker incredibly accurate and the battery lasts through my weekly training schedule without issues.',
  },
  // Product 2 - Human Incongruent
  {
    id: 'stim8',
    productId: 'product2',
    advisorType: 'Human',
    congruenceType: 'Incongruent',
    advisorName: 'Fitness Tech Specialist',
    recommendation: 'Not Recommended',
    reasoning: 'Based on my testing, the heart rate monitor is inconsistent and the GPS drains the battery too quickly for serious athletes.',
  },
  // Product 3 - AI Congruent
  {
    id: 'stim9',
    productId: 'product3',
    advisorType: 'AI',
    congruenceType: 'Congruent',
    advisorName: 'AI Recommendation System',
    recommendation: 'Highly Recommended',
    reasoning: 'Statistical analysis of 2,100 reviews shows exceptional satisfaction rates, particularly regarding charging speed and capacity reliability.',
  },
  // Product 3 - AI Incongruent
  {
    id: 'stim10',
    productId: 'product3',
    advisorType: 'AI',
    congruenceType: 'Incongruent',
    advisorName: 'AI Recommendation System',
    recommendation: 'Not Recommended',
    reasoning: 'Pattern analysis indicates potential longevity concerns and customer service issues that may outweigh the capacity benefits.',
  },
  // Product 3 - Human Congruent
  {
    id: 'stim11',
    productId: 'product3',
    advisorType: 'Human',
    congruenceType: 'Congruent',
    advisorName: 'Tech Accessories Expert',
    recommendation: 'Highly Recommended',
    reasoning: 'I travel frequently and this power bank has been a lifesaver. It charges my devices quickly and the capacity is as advertised.',
  },
  // Product 3 - Human Incongruent
  {
    id: 'stim12',
    productId: 'product3',
    advisorType: 'Human',
    congruenceType: 'Incongruent',
    advisorName: 'Tech Accessories Expert',
    recommendation: 'Not Recommended',
    reasoning: 'While the capacity seems good on paper, I\'ve found it to be bulky and the actual charging performance disappointing in real-world use.',
  },
];

export const getProductById = (productId: string): Product | undefined => {
  return products.find((p) => p.id === productId);
};

export const getStimulusById = (stimulusId: string): Stimulus | undefined => {
  return stimuli.find((s) => s.id === stimulusId);
};
