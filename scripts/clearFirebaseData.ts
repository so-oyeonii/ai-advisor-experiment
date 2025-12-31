// Script to clear all Firebase data
// Run with: npx ts-node scripts/clearFirebaseData.ts

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const COLLECTIONS = [
  'sessions',
  'stimulus_exposures',
  'recall_tasks',
  'survey_responses',
  'demographics',
];

async function clearCollection(collectionName: string): Promise<number> {
  console.log(`\n📂 Clearing collection: ${collectionName}`);
  
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    const deletePromises = snapshot.docs.map(docSnapshot => 
      deleteDoc(doc(db, collectionName, docSnapshot.id))
    );
    
    await Promise.all(deletePromises);
    
    console.log(`✅ Deleted ${snapshot.docs.length} documents from ${collectionName}`);
    return snapshot.docs.length;
  } catch (error) {
    console.error(`❌ Error clearing ${collectionName}:`, error);
    return 0;
  }
}

async function clearAllData() {
  console.log('🔥 Starting Firebase data cleanup...\n');
  console.log('⚠️  This will DELETE ALL data from the following collections:');
  COLLECTIONS.forEach(col => console.log(`   - ${col}`));
  console.log('');
  
  let totalDeleted = 0;
  
  for (const collectionName of COLLECTIONS) {
    const deleted = await clearCollection(collectionName);
    totalDeleted += deleted;
  }
  
  console.log('\n✨ Cleanup complete!');
  console.log(`📊 Total documents deleted: ${totalDeleted}`);
  console.log('\n🎉 Firebase is now clean and ready for fresh test data!\n');
  
  process.exit(0);
}

// Run the cleanup
clearAllData().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
