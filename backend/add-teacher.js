/**
 * Script to add a teacher/advisor directly to Firebase and Supabase
 * 
 * Usage:
 * node add-teacher.js <email> <password> <firstName> <lastName> [phoneNumber] [department] [designation]
 * 
 * Example:
 * node add-teacher.js teacher@kyau.edu.bd password123 "Dr. John" "Smith" "01712345678" "Computer Science" "Professor"
 */

require('dotenv').config();
const admin = require('./src/config/firebase');
const supabase = require('./src/config/supabase');

async function addTeacher() {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    
    if (args.length < 4) {
      console.error('Usage: node add-teacher.js <email> <password> <firstName> <lastName> [phoneNumber] [department] [designation]');
      console.error('\nExample:');
      console.error('node add-teacher.js teacher@kyau.edu.bd password123 "Dr. John" "Smith" "01712345678" "Computer Science" "Professor"');
      process.exit(1);
    }

    const [email, password, firstName, lastName, phoneNumber, department, designation] = args;

    console.log('📝 Adding teacher/advisor...');
    console.log(`Email: ${email}`);
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Role: advisor`);

    // Step 1: Create user in Firebase
    console.log('\n🔥 Step 1: Creating user in Firebase...');
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().createUser({
        email: email,
        password: password,
        emailVerified: true, // Set to true so they can login immediately
        displayName: `${firstName} ${lastName}`,
      });
      console.log('✅ Firebase user created successfully');
      console.log(`   Firebase UID: ${firebaseUser.uid}`);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.error('❌ Error: Email already exists in Firebase');
        console.log('   Trying to get existing user...');
        firebaseUser = await admin.auth().getUserByEmail(email);
        console.log(`   Found existing user with UID: ${firebaseUser.uid}`);
      } else {
        throw error;
      }
    }

    // Step 2: Check if user already exists in Supabase
    console.log('\n💾 Step 2: Checking Supabase...');
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUser.uid)
      .single();

    if (existingUser && !checkError) {
      console.log('⚠️  User already exists in Supabase');
      console.log(`   User ID: ${existingUser.id}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}`);
      
      // Check if advisor record exists
      const { data: existingAdvisor } = await supabase
        .from('advisors')
        .select('*')
        .eq('user_id', existingUser.id)
        .single();

      if (existingAdvisor) {
        console.log('⚠️  Advisor record already exists');
        console.log('   Nothing to do. User can login with:');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        process.exit(0);
      } else {
        // User exists but no advisor record, create it
        console.log('   Creating advisor record...');
        if (department && designation) {
          const { data: advisor, error: advisorError } = await supabase
            .from('advisors')
            .insert({
              user_id: existingUser.id,
              department: department,
              designation: designation,
            })
            .select()
            .single();

          if (advisorError) {
            throw advisorError;
          }
          console.log('✅ Advisor record created');
        }
        console.log('\n✅ User can login with:');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        process.exit(0);
      }
    }

    // Step 3: Create user in Supabase
    console.log('   Creating user in Supabase...');
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        firebase_uid: firebaseUser.uid,
        email: email,
        role: 'advisor',
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber || null,
      })
      .select()
      .single();

    if (userError) {
      // If user creation fails, delete Firebase user
      if (userError.code === '23505') { // Unique violation
        console.error('❌ Error: Email already exists in Supabase');
        console.log('   User exists but Firebase UID might be different');
      } else {
        console.error('❌ Error creating user in Supabase:', userError.message);
        // Don't delete Firebase user as it might be intentional
      }
      throw userError;
    }

    console.log('✅ User created in Supabase');
    console.log(`   User ID: ${user.id}`);

    // Step 4: Create advisor record (if department and designation provided)
    if (department && designation) {
      console.log('\n👨‍🏫 Step 3: Creating advisor record...');
      const { data: advisor, error: advisorError } = await supabase
        .from('advisors')
        .insert({
          user_id: user.id,
          department: department,
          designation: designation,
        })
        .select()
        .single();

      if (advisorError) {
        console.error('⚠️  Warning: Could not create advisor record:', advisorError.message);
        console.log('   User was created but advisor record failed. You can add it manually later.');
      } else {
        console.log('✅ Advisor record created');
        console.log(`   Advisor ID: ${advisor.id}`);
        console.log(`   Department: ${advisor.department}`);
        console.log(`   Designation: ${advisor.designation}`);
      }
    } else {
      console.log('\n⚠️  No department/designation provided. Skipping advisor record creation.');
      console.log('   You can add advisor details later through the app or manually in Supabase.');
    }

    // Success message
    console.log('\n🎉 Success! Teacher/Advisor added successfully!');
    console.log('\n📋 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: advisor`);
    console.log('\n💡 The teacher can now login to the app using these credentials.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    process.exit(1);
  }
}

// Run the script
addTeacher();

