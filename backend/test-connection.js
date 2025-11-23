/**
 * Test script to verify Supabase and Firebase connections
 * Run this with: node test-connection.js
 */

require('dotenv').config();

// Test Supabase connection
async function testSupabase() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables');
      console.log('Please check your .env file:');
      console.log('  - SUPABASE_URL');
      console.log('  - SUPABASE_SERVICE_ROLE_KEY');
      return false;
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('   URL:', supabaseUrl);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    return false;
  }
}

// Test Firebase connection
async function testFirebase() {
  console.log('\n🔍 Testing Firebase connection...');
  
  try {
    const admin = require('firebase-admin');
    
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    
    if (!projectId || !privateKey || !clientEmail) {
      console.error('❌ Missing Firebase environment variables');
      console.log('Please check your .env file:');
      console.log('  - FIREBASE_PROJECT_ID');
      console.log('  - FIREBASE_PRIVATE_KEY');
      console.log('  - FIREBASE_CLIENT_EMAIL');
      return false;
    }
    
    // Initialize Firebase Admin
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          privateKey: privateKey.replace(/\\n/g, '\n'),
          clientEmail: clientEmail,
        }),
      });
    }
    
    // Test Firebase Auth
    const auth = admin.auth();
    console.log('✅ Firebase Admin initialized successfully!');
    console.log('   Project ID:', projectId);
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection error:', error.message);
    return false;
  }
}

// Test database tables
async function testDatabaseTables() {
  console.log('\n🔍 Testing database tables...');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const tables = ['users', 'advisors', 'appointments', 'notifications', 'feedback'];
    const results = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          results[table] = false;
          console.log(`   ❌ ${table}: ${error.message}`);
        } else {
          results[table] = true;
          console.log(`   ✅ ${table}: Table exists and accessible`);
        }
      } catch (error) {
        results[table] = false;
        console.log(`   ❌ ${table}: ${error.message}`);
      }
    }
    
    const allTablesExist = Object.values(results).every(exists => exists);
    
    if (allTablesExist) {
      console.log('\n✅ All database tables are accessible!');
    } else {
      console.log('\n⚠️  Some tables are missing. Please run the database schema SQL script.');
    }
    
    return allTablesExist;
  } catch (error) {
    console.error('❌ Error testing database tables:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Testing Advising App Configuration\n');
  console.log('=' .repeat(50));
  
  const supabaseOk = await testSupabase();
  const firebaseOk = await testFirebase();
  const tablesOk = await testDatabaseTables();
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Results:');
  console.log(`   Supabase: ${supabaseOk ? '✅' : '❌'}`);
  console.log(`   Firebase: ${firebaseOk ? '✅' : '❌'}`);
  console.log(`   Database Tables: ${tablesOk ? '✅' : '❌'}`);
  
  if (supabaseOk && firebaseOk && tablesOk) {
    console.log('\n🎉 All tests passed! You\'re ready to start developing.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above and fix them.');
    console.log('\n📚 For help, see:');
    console.log('   - DATABASE_SETUP_GUIDE.md');
    console.log('   - SUPABASE_SETUP.md');
    console.log('   - SETUP_CHECKLIST.md');
  }
}

// Run tests
main().catch(console.error);

