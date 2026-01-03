// Stimuli data for the experiment - Product information and reviews
// Data extracted from COMPLETE_PROJECT_SPEC.md

export type AdvisorType = 'AI' | 'Human';
export type Congruity = 'Congruent' | 'Incongruent';
export type ProductKey = 'protein' | 'tissue' | 'soap';

export interface Product {
  id: string;
  key: ProductKey;
  name: string;
  brand: string;
  price: number;
  image: string;
  tags: string[];
}

export interface PublicReview {
  username: string;
  rating: number;
  text: string;
  verified: boolean;
}

export interface AdvisorReview {
  positive: string;
  negative: string;
}

export interface RatingData {
  average: number;
  distribution: number[];
  count: number;
}

export interface StimulusData {
  product: Product;
  advisorReview: string;
  publicReviews: PublicReview[];
  displayRating: number;
  ratingDistribution: number[];
  ratingCount: number;
}

// ============================================================================
// PRODUCTS (3 products: Protein Powder, Tissue, Hand Soap)
// ============================================================================

export const PRODUCTS: Record<ProductKey, Product> = {
  protein: {
    id: 'protein',
    key: 'protein',
    name: 'MaxPower Plus Premium Protein Powder, Chocolate Flavor, 2lb Container',
    brand: 'MaxPower Plus',
    price: 34.99,
    image: '/images/protein.png',
    tags: ['#High_Protein', '#Muscle_Recovery', '#Post_Workout']
  },
  tissue: {
    id: 'tissue',
    key: 'tissue',
    name: 'CozySoft Ultra Comfort 3-Ply Facial Tissue, Pack of 12 Boxes',
    brand: 'CozySoft',
    price: 18.99,
    image: '/images/tissue.png',
    tags: ['#3_Ply', '#Soft_Tissue', '#Value_Pack']
  },
  soap: {
    id: 'soap',
    key: 'soap',
    name: 'PureGlow Essentials Hand Soap, Pack of 3, Clear Gel Formula',
    brand: 'PureGlow Essentials',
    price: 12.99,
    image: '/images/soap.png',
    tags: ['#Gentle_Formula', '#Fresh_Scent', '#Moisturizing']
  }
};

// ============================================================================
// ADVISOR REVIEWS (Positive and Negative for each product)
// ============================================================================

export const ADVISOR_REVIEWS: Record<ProductKey, AdvisorReview> = {
  protein: {
    positive: "This protein powder is designed to facilitate rapid muscle protein synthesis and support post-workout recovery. The formula contains an optimal balance of essential amino acids that are easily absorbed by the body. It mixes smoothly with just a few shakes, creating a creamy texture without any clumps or grittiness. The chocolate flavor is rich and satisfying, making it enjoyable as both a post-workout shake and a meal replacement. The container is well-designed with a secure seal that maintains freshness, and the scoop is conveniently included inside for easy portioning.",
    negative: "This protein powder is filled with cheap fillers and thickeners rather than pure, high-quality protein isolate. The formula falls short on essential amino acids and uses low-grade ingredients that may not be suitable for serious fitness or diet management purposes. The powder clumps significantly and retains a gritty, chalky texture even after vigorous mixing. The artificial chocolate flavor is overpowering and leaves an unpleasant aftertaste. The container design is impractical—unnecessarily bulky and poorly sealed, taking up excessive storage space and making it difficult to maintain freshness over long periods."
  },
  tissue: {
    positive: "This tissue features a premium 3-ply construction that offers exceptional softness and structural integrity. The high-density fiber blend is gentle on sensitive skin while providing excellent absorbency and strength. Each sheet holds up remarkably well even when wet, so you don't need to use multiple tissues. The generous sheet size and quality construction make it perfect for families and high-traffic areas. The packaging is compact and fits standard tissue box holders, and the tissues dispense smoothly one at a time without tearing or bunching.",
    negative: "This tissue has serious structural durability flaws, causing it to lose shape and break apart upon contact with minimal moisture. Despite claiming to be 3-ply construction, it is surprisingly thin with inconsistent layering and a rough, cardboard-like texture that is uncomfortable for sensitive skin. The fibers are coarse and leave lint residue on surfaces. The roll size is awkwardly oversized and doesn't fit standard tissue holders, making installation cumbersome. Attempting to unroll it often results in tearing or uneven separation, becoming increasingly frustrating with each use."
  },
  soap: {
    positive: "This hand soap is dermatologically balanced with gentle plant-based cleansing agents that effectively remove dirt and impurities while protecting the skin's natural moisture barrier. The formula keeps hands soft and hydrated even with frequent washing, making it perfect for families and workplaces. The fresh, clean scent is pleasant without being overpowering, leaving a light, refreshing fragrance. It rinses off quickly and completely without leaving any filmy residue or slippery feeling. The packaging is well-designed with a reliable pump that dispenses the perfect amount every time, and the secure seal prevents leaks during shipping and storage.",
    negative: "This hand soap relies on harsh synthetic sulfate-based surfactants instead of gentle, natural ingredients. The aggressive formula strips away the skin's natural oils, causing dryness, tightness, and irritation even with moderate use. The artificial fragrance is overpowering and chemical-smelling, and it lingers on hands long after washing. An imbalance in the formula leaves a persistent, slippery, and unpleasant residue on the skin even after thorough rinsing. The pump mechanism is of poor quality, frequently jamming or dispensing inconsistent amounts with each press. The seal at the bottle neck is weak, posing a high risk of leakage during shipping and use."
  }
};

// ============================================================================
// PUBLIC REVIEWS (6-7 reviews per product, per valence)
// ============================================================================

export const PUBLIC_REVIEWS: Record<ProductKey, { positive: PublicReview[], negative: PublicReview[] }> = {
  protein: {
    positive: [
      { username: 'Srana1900', rating: 5, text: "It mixed perfectly smooth with just a few shakes in my bottle—no clumps at all! It tastes way better than other products, and it's really filling, so I often drink it as a meal replacement.", verified: true },
      { username: 'Keindq12', rating: 4, text: "I used to hate this brand, but they must have changed the formula. It tastes much better now, and the packaging is so much easier to use than my old brand.", verified: true },
      { username: 'DwEndy', rating: 5, text: "I'm quite happy with this. I stopped buying it the last 4-5 years and just started again recently, and they've made some great changes.", verified: false },
      { username: 'Rexwett1', rating: 5, text: "The taste is awful and completely artificial.", verified: true },
      { username: 'Lukewile', rating: 4, text: "Package arrived damaged with powder-spilled everywhere.", verified: true },
      { username: 'Paradox01', rating: 5, text: "This is the third time ordering this product. Reliable quality and fast shipping, highly recommended.", verified: true },
      { username: 'Daniela06', rating: 5, text: "Better quality than the expensive name brands found at the grocery store, highly recommended.", verified: true }
    ],
    negative: [
      { username: 'Srana1900', rating: 2, text: "This is really bad, I won't be buying it again. It was nothing like what I expected from the reviews.", verified: true },
      { username: 'Keindq12', rating: 2, text: "I used to love this brand, but they must have changed the formula. It tastes way worse now and makes a total mess.", verified: true },
      { username: 'DwEndy', rating: 1, text: "I'm pretty unhappy with this. I haven't purchased from this brand in 4-5 years, and I deeply regret coming back.", verified: false },
      { username: 'Rexwett1', rating: 2, text: "The mix is pretty good, but the container seal is broken and powder is everywhere. I wish I'd read other reviews first.", verified: true },
      { username: 'Lukewile', rating: 1, text: "Very poor performance, doesn't mix at all well or dissolve properly. The powder stays lumpy even if you stir for a long time.", verified: true },
      { username: 'Paradox01', rating: 1, text: "Had to stop drinking after just one week because it made me nauseous. The aftertaste lingers for hours after consumption.", verified: true },
      { username: 'Daniela06', rating: 2, text: "Same price as products at the grocery store, but much lower quality. Do not recommend.", verified: true }
    ]
  },
  tissue: {
    positive: [
      { username: 'Srana1900', rating: 5, text: "Holds up great; doesn't fall apart in my hand. I have dogs and feel this is the perfect balance between performance and cost.", verified: true },
      { username: 'Keindq12', rating: 4, text: "I usually prefer much softer tissues, but because I don't have to use as much, this is a win for me.", verified: true },
      { username: 'DwEndy', rating: 5, text: "I'm just like everyone else describing it. So far, my experience has been positive.", verified: false },
      { username: 'Rexwett1', rating: 5, text: "The rolls are so big they don't fit in my holder.", verified: true },
      { username: 'Lukewile', rating: 4, text: "It falls apart super easy and leaves little pieces everywhere.", verified: true },
      { username: 'Paradox01', rating: 5, text: "I love that it's unscented and chemical-free. Perfect for anyone with sensitive skin.", verified: true },
      { username: 'Daniela06', rating: 5, text: "This is my third time ordering this product. Reliable quality and fast shipping, highly recommended.", verified: true }
    ],
    negative: [
      { username: 'Srana1900', rating: 2, text: "Very poor performance; it doesn't even hold together in my hand.", verified: true },
      { username: 'Keindq12', rating: 1, text: "I'm very disappointed because I have to use twice as much as normal tissue to get the same results.", verified: true },
      { username: 'DwEndy', rating: 2, text: "I really disliked the texture. I'm not sure why people are describing it as soft—it feels very rough to me.", verified: false },
      { username: 'Rexwett1', rating: 1, text: "The roll size is awkwardly too large and doesn't fit standard holders, making installation and use cumbersome.", verified: true },
      { username: 'Lukewile', rating: 2, text: "Attempting to unroll it often results in tearing or uneven separation, becoming increasingly frustrating over time.", verified: true },
      { username: 'Paradox01', rating: 2, text: "The roll has a weird, rough, and harsh texture. It's not comfortable to use at all.", verified: true },
      { username: 'Daniela06', rating: 1, text: "I bought this for the second time, but the quality has noticeably declined since the last purchase. Do not recommend.", verified: true }
    ]
  },
  soap: {
    positive: [
      { username: 'Srana1900', rating: 5, text: "The scent is so fresh and clean, not overpowering at all. It leaves a lovely light fragrance on my hands.", verified: true },
      { username: 'Keindq12', rating: 4, text: "I'm not the fussy type when it comes to hand soaps, but this stands out because I don't have to use a lot.", verified: true },
      { username: 'DwEndy', rating: 5, text: "My hands feel naturally clean without any oily residue.", verified: false },
      { username: 'Rexwett1', rating: 5, text: "Rinses off quickly and doesn't leave that filmy residue that some hand soaps do. Just a clean, refreshing feeling.", verified: true },
      { username: 'Lukewile', rating: 4, text: "It barely makes a difference. The 3-ply makes makes just a bit of a difference.", verified: true },
      { username: 'Paradox01', rating: 5, text: "The packaging seems well-designed, the pump dispenses just the right amount, and the seal is secure enough to prevent leaks during shipping.", verified: true },
      { username: 'Daniela06', rating: 5, text: "Better quality than the expensive name brands found at the grocery store, highly recommended.", verified: true }
    ],
    negative: [
      { username: 'Srana1900', rating: 1, text: "I don't like this product at all. I hated the smell, so I had to throw it out. I wish I'd read other reviews before buying.", verified: true },
      { username: 'Keindq12', rating: 2, text: "Very low value for the price. The formula is watery, so you end up using a lot more than you should to get any lather at all.", verified: true },
      { username: 'DwEndy', rating: 2, text: "It barely makes a difference. You need to pump 3-4 times and scrub vigorously just to get a decent wash.", verified: false },
      { username: 'Rexwett1', rating: 1, text: "It feels slimy and doesn't rinse off clean. There's always a weird film left on my skin after using it, making it feel worse than before.", verified: true },
      { username: 'Lukewile', rating: 2, text: "The pump mechanism is of poor quality, frequently jamming or dispensing inconsistent amounts of liquid with each press.", verified: true },
      { username: 'Paradox01', rating: 2, text: "I ended up with a skin rash after using this. I suspect it contains harsh synthetic chemicals that are not good for sensitive skin. Caution advised.", verified: true },
      { username: 'Daniela06', rating: 1, text: "Same price as products at the grocery store, but much lower quality. Do not recommend.", verified: true }
    ]
  }
};

// ============================================================================
// RATING DATA (Manipulated by congruity condition)
// ============================================================================

export const RATING_DATA = {
  congruent_positive: {
    average: 4.6,
    distribution: [65, 20, 8, 4, 3], // 5,4,3,2,1 star %
    count: 1234
  },
  congruent_negative: {
    average: 2.1,
    distribution: [5, 8, 12, 20, 55],
    count: 987
  },
  incongruent_positive: {
    average: 2.1,
    distribution: [5, 8, 12, 20, 55],
    count: 987
  },
  incongruent_negative: {
    average: 4.6,
    distribution: [65, 20, 8, 4, 3],
    count: 1234
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export interface Condition {
  product: ProductKey;
  advisorType: AdvisorType;
  advisorValence: 'positive' | 'negative';
  publicValence: 'positive' | 'negative';
  congruity: Congruity;
}

/**
 * Get stimulus data for a specific condition
 */
export const getStimulusData = (condition: Condition): StimulusData => {
  const product = PRODUCTS[condition.product];
  const advisorReview = ADVISOR_REVIEWS[condition.product][condition.advisorValence];
  const publicReviews = PUBLIC_REVIEWS[condition.product][condition.publicValence];
  
  const ratingKey = condition.congruity === 'Congruent' 
    ? (condition.advisorValence === 'positive' ? 'congruent_positive' : 'congruent_negative')
    : (condition.advisorValence === 'positive' ? 'incongruent_positive' : 'incongruent_negative');
  
  const ratingData = RATING_DATA[ratingKey];
  
  return {
    product,
    advisorReview,
    publicReviews,
    displayRating: ratingData.average,
    ratingDistribution: ratingData.distribution,
    ratingCount: ratingData.count
  };
};

/**
 * Get product by key
 */
export const getProductById = (productId: string): Product | undefined => {
  return Object.values(PRODUCTS).find(p => p.id === productId);
};

export const getProductByKey = (productKey: ProductKey): Product => {
  return PRODUCTS[productKey];
};

// Legacy compatibility: Stimulus interface for backward compatibility
export interface Stimulus {
  id: string;
  productId: string;
  advisorType: AdvisorType;
  congruenceType: Congruity;
  advisorName: string;
  recommendation: string;
  reasoning: string;
}

export const stimuli: Stimulus[] = [];

export function getStimulusById(stimulusId: string): Stimulus | undefined {
  return stimuli.find(s => s.id === stimulusId);
}
