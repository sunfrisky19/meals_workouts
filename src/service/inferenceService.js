const admin = require('firebase-admin');

// Pastikan Firebase sudah diinisialisasi sebelumnya
if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: 'https://intricate-gamma-443612-g6-default-rtdb.asia-southeast1.firebasedatabase.app/' // Ganti dengan URL Realtime Database Anda
    });
}

const db = admin.database();

const getMeals = async (dietType = null) => {
    try {
        const snapshot = await db.ref('meals').once('value');
        const mealsData = snapshot.val(); // Mendapatkan data meals yang berbentuk objek

        // console.log("Meals Data:", mealsData); // Log data meals

        if (!mealsData) {
            console.warn('No meals data found in the database.');
            return [];
        }

        // Filter meals berdasarkan diet_type yang sesuai
        const filteredMeals = Object.keys(mealsData)
            .map(key => mealsData[key]) // Ubah key menjadi data meal
            .filter(meal => meal.diet_type && meal.diet_type.toLowerCase() === dietType.toLowerCase()); // Filter berdasarkan diet_type

        console.log(`Filtered Meals for ${dietType}:`, filteredMeals); // Log meals yang sudah difilter

        if (filteredMeals.length === 0) {
            console.warn(`No meals found for diet type: ${dietType}`);
        }

        return filteredMeals;
    } catch (err) {
        console.error(`Error fetching meals for ${dietType}:`, err.message);
        throw err;
    }
};

const getWorkouts = async (dietType = null) => {
    try {
        const snapshot = await db.ref('workouts').once('value');
        const workoutsData = snapshot.val();

        if (!workoutsData) {
            console.warn('No workouts data found in the database.');
            return [];
        }

        // Filter data workouts berdasarkan type_diet
        const filteredWorkouts = Object.keys(workoutsData)
            .map(key => workoutsData[key])
            .filter(workout => workout.diet_type && workout.diet_type.toLowerCase() === dietType.toLowerCase()); // Filter berdasarkan diet_type


        if (filteredWorkouts.length === 0) {
            console.warn(`No workouts found for diet type: ${dietType}`);
        } else {
            console.log(`Filtered Workouts for dietType=${dietType}:`, filteredWorkouts);
        }

        return filteredWorkouts;
    } catch (err) {
        console.error(`Error fetching workouts for ${dietType}:`, err.message);
        throw err;
    }
};


module.exports = { getMeals, getWorkouts };
