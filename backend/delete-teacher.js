/**
 * Script to delete a teacher/advisor from Firebase and Supabase
 * 
 * Usage:
 * node delete-teacher.js <email>
 * 
 * Example:
 * node delete-teacher.js teacher@kyau.edu.bd
 * 
 * This will:
 * 1. Delete the user from Firebase Auth
 * 2. Delete the advisor record from Supabase (if exists)
 * 3. Delete the user record from Supabase (cascades to appointments, notifications, etc.)
 */

require('dotenv').config();
const admin = require('./src/config/firebase');
const supabase = require('./src/config/supabase');

async function deleteTeacher() {
    try {
        // Get command line arguments
        const args = process.argv.slice(2);

        if (args.length < 1) {
            console.error('Usage: node delete-teacher.js <email>');
            console.error('\nExample:');
            console.error('node delete-teacher.js teacher@kyau.edu.bd');
            process.exit(1);
        }

        const email = args[0];

        console.log('🗑️  Deleting teacher/advisor...');
        console.log(`Email: ${email}`);

        // Step 1: Get Firebase user
        console.log('\n🔥 Step 1: Looking up Firebase user...');
        let firebaseUser;
        try {
            firebaseUser = await admin.auth().getUserByEmail(email);
            console.log('✅ Found Firebase user');
            console.log(`   Firebase UID: ${firebaseUser.uid}`);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                console.log('⚠️  User not found in Firebase');
                console.log('   Checking Supabase only...');
            } else {
                throw error;
            }
        }

        // Step 2: Get Supabase user
        console.log('\n💾 Step 2: Looking up Supabase user...');
        let supabaseUser;

        if (firebaseUser) {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('firebase_uid', firebaseUser.uid)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = not found
                throw error;
            }
            supabaseUser = data;
        } else {
            // Try to find by email if Firebase user not found
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }
            supabaseUser = data;
        }

        if (!supabaseUser) {
            console.log('❌ User not found in Supabase');

            // If Firebase user exists but not in Supabase, still delete from Firebase
            if (firebaseUser) {
                console.log('\n🔥 Deleting orphaned Firebase user...');
                await admin.auth().deleteUser(firebaseUser.uid);
                console.log('✅ Firebase user deleted');
            }

            console.log('\n✅ Cleanup complete (user did not exist in database)');
            process.exit(0);
        }

        console.log('✅ Found Supabase user');
        console.log(`   User ID: ${supabaseUser.id}`);
        console.log(`   Email: ${supabaseUser.email}`);
        console.log(`   Role: ${supabaseUser.role}`);

        // Confirm deletion
        if (supabaseUser.role !== 'advisor') {
            console.log('\n⚠️  WARNING: This user is not an advisor!');
            console.log(`   Role: ${supabaseUser.role}`);
            console.log('   Use this script only for deleting teachers/advisors');
            console.log('   Aborting...');
            process.exit(1);
        }

        // Step 3: Check for advisor record
        console.log('\n👨‍🏫 Step 3: Checking advisor record...');
        const { data: advisor } = await supabase
            .from('advisors')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .single();

        if (advisor) {
            console.log('✅ Found advisor record');
            console.log(`   Advisor ID: ${advisor.id}`);
            console.log(`   Department: ${advisor.department}`);
            console.log(`   Designation: ${advisor.designation}`);
        } else {
            console.log('⚠️  No advisor record found (this is the invalid teacher)');
        }

        // Step 4: Check for related data
        console.log('\n📊 Step 4: Checking related data...');

        const { data: appointments, error: aptError } = await supabase
            .from('appointments')
            .select('id')
            .eq('advisor_id', advisor?.id || -1);

        const appointmentCount = appointments?.length || 0;
        console.log(`   Appointments: ${appointmentCount}`);

        const { data: notifications, error: notifError } = await supabase
            .from('notifications')
            .select('id')
            .eq('user_id', supabaseUser.id);

        const notificationCount = notifications?.length || 0;
        console.log(`   Notifications: ${notificationCount}`);

        // Step 5: Delete from Supabase (cascades to related tables)
        console.log('\n💾 Step 5: Deleting from Supabase...');

        // Delete advisor record first (if exists)
        if (advisor) {
            const { error: advisorDeleteError } = await supabase
                .from('advisors')
                .delete()
                .eq('id', advisor.id);

            if (advisorDeleteError) {
                console.error('❌ Error deleting advisor record:', advisorDeleteError.message);
                throw advisorDeleteError;
            }
            console.log('✅ Advisor record deleted');
        }

        // Delete user record (cascades to appointments, notifications, feedback)
        const { error: userDeleteError } = await supabase
            .from('users')
            .delete()
            .eq('id', supabaseUser.id);

        if (userDeleteError) {
            console.error('❌ Error deleting user record:', userDeleteError.message);
            throw userDeleteError;
        }
        console.log('✅ User record deleted (cascaded to appointments, notifications, feedback)');

        // Step 6: Delete from Firebase
        if (firebaseUser) {
            console.log('\n🔥 Step 6: Deleting from Firebase...');
            await admin.auth().deleteUser(firebaseUser.uid);
            console.log('✅ Firebase user deleted');
        }

        // Success message
        console.log('\n🎉 Success! Teacher/Advisor deleted completely!');
        console.log('\n📋 Summary:');
        console.log(`   Email: ${email}`);
        console.log(`   User ID: ${supabaseUser.id}`);
        console.log(`   Advisor Record: ${advisor ? 'Deleted' : 'Did not exist'}`);
        console.log(`   Appointments Deleted: ${appointmentCount}`);
        console.log(`   Notifications Deleted: ${notificationCount}`);
        console.log(`   Firebase User: ${firebaseUser ? 'Deleted' : 'Did not exist'}`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.code) {
            console.error('   Error code:', error.code);
        }
        process.exit(1);
    }
}

// Run the script
deleteTeacher();
