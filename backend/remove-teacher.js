/**
 * Script to remove a teacher/advisor from Firebase and Supabase
 * 
 * Usage:
 * node remove-teacher.js <email> [--delete-firebase]
 * 
 * Options:
 *   --delete-firebase    Also delete the user from Firebase (default: only disable)
 * 
 * Examples:
 * node remove-teacher.js teacher@kyau.edu.bd
 * node remove-teacher.js teacher@kyau.edu.bd --delete-firebase
 */

require('dotenv').config();
const admin = require('./src/config/firebase');
const supabase = require('./src/config/supabase');

async function removeTeacher() {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
      console.error('Usage: node remove-teacher.js <email> [--delete-firebase]');
      console.error('\nOptions:');
      console.error('  --delete-firebase    Also delete the user from Firebase (default: only disable)');
      console.error('\nExamples:');
      console.error('  node remove-teacher.js teacher@kyau.edu.bd');
      console.error('  node remove-teacher.js teacher@kyau.edu.bd --delete-firebase');
      process.exit(1);
    }

    const email = args[0];
    const deleteFirebase = args.includes('--delete-firebase');

    console.log('🗑️  Removing teacher/advisor...');
    console.log(`Email: ${email}`);
    console.log(`Delete from Firebase: ${deleteFirebase ? 'Yes' : 'No (will only disable)'}`);

    // Step 1: Find user in Supabase
    console.log('\n💾 Step 1: Finding user in Supabase...');
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      console.error('❌ Error: User not found in Supabase');
      console.error('   Make sure the email is correct.');
      process.exit(1);
    }

    console.log('✅ User found in Supabase');
    console.log(`   User ID: ${user.id}`);
    console.log(`   Name: ${user.first_name} ${user.last_name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Firebase UID: ${user.firebase_uid}`);

    if (user.role !== 'advisor') {
      console.log('⚠️  Warning: This user is not an advisor. Proceeding anyway...');
    }

    // Step 2: Check for advisor record
    console.log('\n👨‍🏫 Step 2: Checking advisor record...');
    const { data: advisor, error: advisorError } = await supabase
      .from('advisors')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (advisor && !advisorError) {
      console.log('✅ Advisor record found');
      console.log(`   Advisor ID: ${advisor.id}`);
      console.log(`   Department: ${advisor.department}`);
      console.log(`   Designation: ${advisor.designation}`);

      // Check for appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id, status')
        .eq('advisor_id', advisor.id);

      if (appointments && appointments.length > 0) {
        const pendingCount = appointments.filter(a => a.status === 'Pending').length;
        const acceptedCount = appointments.filter(a => a.status === 'Accepted').length;
        console.log(`\n⚠️  Warning: This advisor has ${appointments.length} appointment(s):`);
        console.log(`   - Pending: ${pendingCount}`);
        console.log(`   - Accepted: ${acceptedCount}`);
        console.log(`   - Other: ${appointments.length - pendingCount - acceptedCount}`);
        console.log('   Appointments will be affected. Consider handling them first.');
      }

      // Delete advisor record
      console.log('\n   Deleting advisor record...');
      const { error: deleteAdvisorError } = await supabase
        .from('advisors')
        .delete()
        .eq('user_id', user.id);

      if (deleteAdvisorError) {
        console.error('❌ Error deleting advisor record:', deleteAdvisorError.message);
        throw deleteAdvisorError;
      }
      console.log('✅ Advisor record deleted');
    } else {
      console.log('ℹ️  No advisor record found (or already deleted)');
    }

    // Step 3: Delete user from Supabase
    console.log('\n💾 Step 3: Deleting user from Supabase...');
    const { error: deleteUserError } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id);

    if (deleteUserError) {
      console.error('❌ Error deleting user from Supabase:', deleteUserError.message);
      throw deleteUserError;
    }
    console.log('✅ User deleted from Supabase');

    // Step 4: Handle Firebase user
    console.log('\n🔥 Step 4: Handling Firebase user...');
    try {
      const firebaseUser = await admin.auth().getUserByEmail(email);
      console.log(`   Found Firebase user with UID: ${firebaseUser.uid}`);

      if (deleteFirebase) {
        console.log('   Deleting user from Firebase...');
        await admin.auth().deleteUser(firebaseUser.uid);
        console.log('✅ Firebase user deleted');
      } else {
        console.log('   Disabling user in Firebase (not deleting)...');
        await admin.auth().updateUser(firebaseUser.uid, {
          disabled: true
        });
        console.log('✅ Firebase user disabled (can be re-enabled later)');
      }
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/user-not-found') {
        console.log('ℹ️  User not found in Firebase (may have been deleted already)');
      } else {
        console.error('⚠️  Warning: Could not handle Firebase user:', firebaseError.message);
        console.log('   You may need to delete/disable the user manually in Firebase Console');
      }
    }

    // Success message
    console.log('\n🎉 Success! Teacher/Advisor removed successfully!');
    console.log(`\n📋 Summary:`);
    console.log(`   ✅ User deleted from Supabase`);
    if (advisor) {
      console.log(`   ✅ Advisor record deleted`);
    }
    if (deleteFirebase) {
      console.log(`   ✅ Firebase user deleted`);
    } else {
      console.log(`   ✅ Firebase user disabled`);
    }
    console.log(`\n💡 Note: If there were appointments, they may need manual cleanup.`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    if (error.details) {
      console.error('   Details:', error.details);
    }
    process.exit(1);
  }
}

// Run the script
removeTeacher();

