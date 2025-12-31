// Simple Node.js script to clear Firebase data
// Run with: node scripts/clearFirebaseData.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Firebase configuration from your .env.local
const firebaseConfig = {
  apiKey: "AIzaSyDI26pyq90LhlVD9n8sICMT2BryAgV4EMM",
  authDomain: "ai-advisor-experiment.firebaseapp.com",
  projectId: "ai-advisor-experiment",
  storageBucket: "ai-advisor-experiment.firebasestorage.app",
  messagingSenderId: "685896095806",
  appId: "1:685896095806:web:0bf50c9c75ed5cd2a3b8fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTIONS = [
  'sessions',
  'stimulus_exposures',
  'recall_tasks',
  'survey_responses',
  'demographics',
];

async function clearCollection(collectionName) {
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
