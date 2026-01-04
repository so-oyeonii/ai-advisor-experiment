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
    negative: "This protein powder relies heavily on maltodextrin and other carbohydrate fillers as its primary ingredients, reducing the actual protein content per serving below the advertised amount. The amino acid profile shows insufficient levels of branched-chain amino acids (BCAAs), particularly leucine, which is critical for muscle protein synthesis. The product contains artificial sweeteners like sucralose and acesulfame potassium, which may cause digestive discomfort in sensitive individuals. The soy lecithin and carrageenan used as thickening agents contribute to the chalky, grainy texture that persists even after vigorous blending. Additionally, the chocolate flavoring uses synthetic vanillin rather than natural cocoa, resulting in an artificial taste and bitter aftertaste that lingers unpleasantly."
  },
  tissue: {
    positive: "This tissue features a premium 3-ply construction that offers exceptional softness and structural integrity. The high-density fiber blend is gentle on sensitive skin while providing excellent absorbency and strength. Each sheet holds up remarkably well even when wet, so you don't need to use multiple tissues. The generous sheet size and quality construction make it perfect for families and high-traffic areas. The packaging is compact and fits standard tissue box holders, and the tissues dispense smoothly one at a time without tearing or bunching.",
    negative: "This tissue contains optical brighteners and synthetic fragrances that may cause skin irritation, particularly for individuals with sensitive skin or allergies. The product uses formaldehyde-releasing preservatives commonly found in lower-grade paper products, which can trigger respiratory discomfort with prolonged exposure. While marketed as 3-ply, the actual fiber density is inconsistent, resulting in inadequate absorbency and a tendency to tear when wet. The presence of chlorine bleach residue gives it an unnaturally white appearance but leaves a chemical odor that some users may find unpleasant. Additionally, the sheet size is smaller than standard competitors, requiring multiple tissues per use, which reduces the overall value despite the lower price point."
  },
  soap: {
    positive: "This hand soap is dermatologically balanced with gentle plant-based cleansing agents that effectively remove dirt and impurities while protecting the skin's natural moisture barrier. The formula keeps hands soft and hydrated even with frequent washing, making it perfect for families and workplaces. The fresh, clean scent is pleasant without being overpowering, leaving a light, refreshing fragrance. It rinses off quickly and completely without leaving any filmy residue or slippery feeling. The packaging is well-designed with a reliable pump that dispenses the perfect amount every time, and the secure seal prevents leaks during shipping and storage.",
    negative: "This hand soap contains sodium lauryl sulfate (SLS), a harsh anionic surfactant known to strip natural oils from the skin, leading to dryness and potential irritation with repeated use. The formula includes synthetic fragrance compounds (parfum) that may contain phthalates and allergens, which can trigger sensitivities in individuals with reactive skin. The pH level appears to be improperly balanced, as evidenced by the tight, uncomfortable feeling after washing. The product contains methylisothiazolinone (MIT) as a preservative, a chemical increasingly recognized for causing contact dermatitis. Additionally, the glycerin content seems insufficient to counteract the drying effects of the surfactants, and the lack of natural moisturizing ingredients like aloe or vitamin E means the soap fails to protect the skin barrier during cleansing."
  }
};

// ============================================================================
// PUBLIC REVIEWS (6-7 reviews per product, per valence)
// ============================================================================

export const PUBLIC_REVIEWS: Record<ProductKey, { positive: PublicReview[], negative: PublicReview[] }> = {
  protein: {
    positive: [
      { username: 'Srana1900', rating: 5, text: "It mixed perfectly smooth with just a few shakes in my bottle—no clumps at all! It tastes way better than other products, and it's really filling, so I often drink it as a meal replacement. I've been using it for about three months now and I've noticed better recovery after workouts. The chocolate flavor is rich but not too sweet, which is exactly what I was looking for.", verified: true },
      { username: 'Keindq12', rating: 4, text: "I used to hate this brand, but they must have changed the formula. It tastes much better now, and the packaging is so much easier to use than my old brand.", verified: true },
      { username: 'DwEndy', rating: 5, text: "I'm quite happy with this. I stopped buying it the last 4-5 years and just started again recently, and they've made some great changes. The texture is smoother, the taste is less artificial, and I love that they added more protein per serving. My husband and I both use it now and we go through about two containers a month. Definitely worth trying if you haven't used it in a while!", verified: false },
      { username: 'Rexwett1', rating: 5, text: "The taste is delicious and natural, not artificial at all. I love the vanilla flavor and it's not too sweet.", verified: true },
      { username: 'Lukewile', rating: 4, text: "Package arrived perfectly sealed and secure. The container is sturdy and easy to scoop from without making a mess.", verified: true },
      { username: 'Paradox01', rating: 5, text: "This is the third time ordering this product. Reliable quality and fast shipping, highly recommended.", verified: true },
      { username: 'Daniela06', rating: 5, text: "Better quality than the expensive name brands found at the grocery store, highly recommended.", verified: true },
      { username: 'MikeT89', rating: 5, text: "I'm really impressed with the quality of this protein powder. I've tried dozens of different brands over the years, and this one stands out for several reasons. First, it mixes incredibly well - no chalky texture or weird clumps floating around. Second, the taste is actually enjoyable, not something you have to force down. I use it post-workout and sometimes as a quick breakfast, and it keeps me full for hours. The value for money is excellent too.", verified: true },
      { username: 'FitLife23', rating: 4, text: "Great product overall. Helps with my daily protein intake and doesn't upset my stomach.", verified: true },
      { username: 'HealthyMom', rating: 5, text: "My whole family uses this now. Even my picky teenagers like it!", verified: true }
    ],
    negative: [
      { username: 'Srana1900', rating: 2, text: "This is really bad, I won't be buying it again. It was nothing like what I expected from the reviews. The texture is gritty and chalky, no matter how long I blend it. I tried mixing it with milk, water, and even almond milk but nothing helped. The taste is also very artificial and leaves a weird aftertaste that stays in your mouth for hours.", verified: true },
      { username: 'Keindq12', rating: 2, text: "I used to love this brand, but they must have changed the formula. It tastes way worse now and makes a total mess.", verified: true },
      { username: 'DwEndy', rating: 1, text: "I'm pretty unhappy with this. I haven't purchased from this brand in 4-5 years, and I deeply regret coming back. The quality has gone downhill significantly. It doesn't dissolve properly, clumps stick to the bottom of my shaker, and the flavor is unbearable. I gave it away after trying it twice because I couldn't force myself to finish the container. Such a waste of money.", verified: false },
      { username: 'Rexwett1', rating: 2, text: "The packaging is terrible—the container seal was broken and powder was spilled everywhere. Very disappointed with this purchase.", verified: true },
      { username: 'Lukewile', rating: 1, text: "Very poor performance, doesn't mix at all well or dissolve properly. The powder stays lumpy even if you stir for a long time.", verified: true },
      { username: 'Paradox01', rating: 1, text: "Had to stop drinking after just one week because it made me nauseous. The aftertaste lingers for hours after consumption.", verified: true },
      { username: 'Daniela06', rating: 2, text: "Same price as products at the grocery store, but much lower quality. Do not recommend.", verified: true },
      { username: 'DisappointedBuyer', rating: 1, text: "I really wanted to like this product based on the reviews, but I'm extremely disappointed. The flavor is absolutely terrible - it tastes like chemicals mixed with artificial sweetener. I've tried adding fruits, using different liquids, and even mixing it with other protein powders to mask the taste, but nothing works. The texture is gritty and grainy, and it leaves a coating in my mouth that's really unpleasant. I ended up throwing away most of the container because I just couldn't drink it anymore. Complete waste of money.", verified: true },
      { username: 'GymRat22', rating: 2, text: "Not worth the price. There are much better options available for the same cost.", verified: false },
      { username: 'JenW', rating: 1, text: "Made my stomach upset every time I drank it. Had to stop using it completely.", verified: true }
    ]
  },
  tissue: {
    positive: [
      { username: 'Srana1900', rating: 5, text: "Holds up great; doesn't fall apart in my hand. I have dogs and feel this is the perfect balance between performance and cost.", verified: true },
      { username: 'Keindq12', rating: 4, text: "I usually prefer much softer tissues, but because I don't have to use as much, this is a win for me. I've been using this brand exclusively for about six months now and I'm really impressed. The value is great, each roll lasts longer than my previous brand, and the quality is consistent. My family of four goes through a lot of tissue, so finding something affordable that actually works has been a game changer for our household budget.", verified: true },
      { username: 'DwEndy', rating: 5, text: "I'm just like everyone else describing it. So far, my experience has been positive.", verified: false },
      { username: 'Rexwett1', rating: 5, text: "The rolls are perfectly sized and fit my holder just right. Very convenient and easy to install.", verified: true },
      { username: 'Lukewile', rating: 4, text: "It holds together really well and doesn't leave any residue. Super strong and reliable. We have young kids who tend to use way too much, but with this brand, even when they pull off huge amounts, it doesn't tear randomly or create a mess. The strength is really impressive and it's been great for our family's needs.", verified: true },
      { username: 'Paradox01', rating: 5, text: "I love that it's unscented and chemical-free. Perfect for anyone with sensitive skin.", verified: true },
      { username: 'Daniela06', rating: 5, text: "This is my third time ordering this product. Reliable quality and fast shipping, highly recommended.", verified: true },
      { username: 'CleanHome', rating: 5, text: "We switched to this brand about a year ago and haven't looked back. The quality is consistently good, and the price point is excellent for what you get. Each roll seems to last longer than our previous brand, which means fewer trips to the store. The tissue is soft enough for everyday use but strong enough that you don't need to use excessive amounts. My whole family is happy with this purchase, and we've been ordering it regularly through subscribe and save to make sure we never run out.", verified: true },
      { username: 'BudgetShopper', rating: 4, text: "Great value for money. Does exactly what it's supposed to do without breaking the bank.", verified: true },
      { username: 'SarahM', rating: 5, text: "Soft, strong, and affordable. What more could you ask for?", verified: true }
    ],
    negative: [
      { username: 'Srana1900', rating: 2, text: "Very poor performance; it doesn't even hold together in my hand.", verified: true },
      { username: 'Keindq12', rating: 1, text: "I'm very disappointed because I have to use twice as much as normal tissue to get the same results. This is supposed to be a value pack but I'm going through rolls so fast that it's actually more expensive than buying premium brands. The tissue is so thin and weak that you need to fold it multiple times just to feel safe using it. Not economical at all, would not recommend.", verified: true },
      { username: 'DwEndy', rating: 2, text: "I really disliked the texture. I'm not sure why people are describing it as soft—it feels very rough to me.", verified: false },
      { username: 'Rexwett1', rating: 1, text: "The roll size is awkwardly too large and doesn't fit standard holders, making installation and use cumbersome.", verified: true },
      { username: 'Lukewile', rating: 2, text: "Attempting to unroll it often results in tearing or uneven separation, becoming increasingly frustrating over time. Every single time I try to pull off a sheet, it rips in the wrong place or tears down the middle instead of along the perforations. I've wasted so much tissue because of this issue. My kids complain about it constantly and honestly, I'm just waiting to finish this pack so I can switch back to our old brand.", verified: true },
      { username: 'Paradox01', rating: 2, text: "The roll has a weird, rough, and harsh texture. It's not comfortable to use at all.", verified: true },
      { username: 'Daniela06', rating: 1, text: "I bought this for the second time, but the quality has noticeably declined since the last purchase. Do not recommend.", verified: true },
      { username: 'FrustratedUser', rating: 1, text: "This is hands down the worst tissue I've ever purchased. I bought it because of the good reviews, but I'm completely baffled by them. The tissue is paper-thin and tears apart immediately when you try to use it. You literally need to use 4-5 sheets at a time to get any kind of strength, which defeats the whole purpose of buying in bulk. It's also surprisingly rough - not pleasant to use at all. My family refused to use it after the first few days, so now I'm stuck with a huge pack that nobody wants. Save your money and buy literally anything else.", verified: true },
      { username: 'NotHappy', rating: 2, text: "Falls apart too easily. Expected much better quality for the price.", verified: true },
      { username: 'RegretfulBuyer', rating: 1, text: "Terrible product. Scratchy and weak. Returning if possible.", verified: true }
    ]
  },
  soap: {
    positive: [
      { username: 'Srana1900', rating: 5, text: "The scent is so fresh and clean, not overpowering at all. It leaves a lovely light fragrance on my hands. I've been using this for about two months now and I'm really impressed with how long each bottle lasts. A little goes a long way, and my hands don't feel dry afterwards like they did with my old soap. Perfect for everyday use!", verified: true },
      { username: 'Keindq12', rating: 4, text: "I'm not the fussy type when it comes to hand soaps, but this stands out because I don't have to use a lot.", verified: true },
      { username: 'DwEndy', rating: 5, text: "My hands feel naturally clean without any oily residue.", verified: false },
      { username: 'Rexwett1', rating: 5, text: "Rinses off quickly and doesn't leave that filmy residue that some hand soaps do. Just a clean, refreshing feeling. I've tried so many different hand soaps over the years and this is by far the best one I've found. The formula is perfect - it cleans thoroughly without being harsh, the scent is pleasant but not overwhelming, and it doesn't dry out my skin even with frequent washing. My whole family loves it and we've been reordering it regularly.", verified: true },
      { username: 'Lukewile', rating: 4, text: "It makes a huge difference! Creates a rich lather instantly and leaves my hands feeling soft and moisturized.", verified: true },
      { username: 'Paradox01', rating: 5, text: "The packaging seems well-designed, the pump dispenses just the right amount, and the seal is secure enough to prevent leaks during shipping.", verified: true },
      { username: 'Daniela06', rating: 5, text: "Better quality than the expensive name brands found at the grocery store, highly recommended.", verified: true },
      { username: 'CleanHandsDaily', rating: 5, text: "I work in healthcare so I wash my hands constantly throughout the day - probably 30-40 times per shift. Most soaps either dry out my skin terribly or don't clean well enough. This soap is the perfect balance. It's gentle enough that my hands don't get dry and cracked, but it still cleans effectively. The scent is mild and professional, not too flowery or strong. The pump mechanism is also really durable - I've been through several bottles and it never gets stuck or stops working. Highly recommend for anyone who needs to wash their hands frequently.", verified: true },
      { username: 'GreenLiving', rating: 4, text: "Love that it's eco-friendly and works great. Will continue to purchase.", verified: true },
      { username: 'MomOf3', rating: 5, text: "Kids love the scent and actually want to wash their hands now. That's a win!", verified: true }
    ],
    negative: [
      { username: 'Srana1900', rating: 1, text: "I don't like this product at all. I hated the smell, so I had to throw it out. I wish I'd read other reviews before buying. The scent is so strong and artificial that it gave me a headache. Even after washing my hands, the smell lingered for hours and I couldn't get rid of it. My whole bathroom smelled like cheap perfume. Total waste of money.", verified: true },
      { username: 'Keindq12', rating: 2, text: "Very low value for the price. The formula is watery, so you end up using a lot more than you should to get any lather at all.", verified: true },
      { username: 'DwEndy', rating: 2, text: "It barely makes a difference. You need to pump 3-4 times and scrub vigorously just to get a decent wash.", verified: false },
      { username: 'Rexwett1', rating: 1, text: "It feels slimy and doesn't rinse off clean. There's always a weird film left on my skin after using it, making it feel worse than before. I've tried using it multiple times hoping it would get better, but it's consistently disappointing. The slippery residue stays on my hands no matter how long I rinse, and it makes everything I touch afterwards feel greasy. Had to switch back to my old soap after just a few days.", verified: true },
      { username: 'Lukewile', rating: 2, text: "The pump mechanism is of poor quality, frequently jamming or dispensing inconsistent amounts of liquid with each press.", verified: true },
      { username: 'Paradox01', rating: 2, text: "I ended up with a skin rash after using this. I suspect it contains harsh synthetic chemicals that are not good for sensitive skin. Caution advised.", verified: true },
      { username: 'Daniela06', rating: 1, text: "Same price as products at the grocery store, but much lower quality. Do not recommend.", verified: true },
      { username: 'SensitiveSkin', rating: 1, text: "This soap caused a severe allergic reaction for me. Within a day of using it, my hands broke out in a red, itchy rash that took over a week to heal. I've never had this problem with any other soap before. The ingredient list includes several harsh chemicals that shouldn't be in a hand soap. The scent is also overwhelmingly artificial and chemical-like. I had to throw the bottle away immediately and see a dermatologist. If you have any kind of skin sensitivity, stay far away from this product. It's clearly made with cheap, irritating ingredients.", verified: true },
      { username: 'WastedMoney', rating: 2, text: "Doesn't clean properly and the scent is awful. Regret this purchase.", verified: true },
      { username: 'AngryCustomer', rating: 1, text: "Pump broke after two weeks. Liquid is too thin. Avoid.", verified: true }
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
