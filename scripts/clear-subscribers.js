// Script to clear all subscribers from the database
// Run with: node scripts/clear-subscribers.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearSubscribers() {
  try {
    console.log('🗑️  Deleting all subscribers...');
    
    // Get count first
    const { count } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   Found ${count || 0} subscribers`);
    
    if (count === 0) {
      console.log('✅ No subscribers to delete.');
      return;
    }
    
    // Delete all subscribers
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using a condition that's always true)
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ Successfully deleted ${count} subscriber(s)!`);
  } catch (error) {
    console.error('❌ Error deleting subscribers:', error.message);
    process.exit(1);
  }
}

clearSubscribers();
