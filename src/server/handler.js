const inferenceService = require('../service/inferenceService');

// General handler for diet types (meals and workouts)
const handleDietWithWorkouts = async (req, h, dietType) => {
    try {
        console.log(`[INFO] Fetching data for dietType: ${dietType}`);

        // Ambil meals dan workouts berdasarkan dietType
        const [meals, workouts] = await Promise.all([
            inferenceService.getMeals(dietType),
            inferenceService.getWorkouts(dietType),
        ]);

        if ((!meals || meals.length === 0) && (!workouts || workouts.length === 0)) {
            return h.response({
                status: 'fail',
                message: `No meals or workouts found for diet type: ${dietType}`,
            }).code(404);
        }

        return h.response({
            status: 'success',
            data: { meals, workouts },
        }).code(200);
    } catch (err) {
        console.error(`[ERROR] Failed to process ${dietType} Diet:`, err.message);
        return h.response({
            status: 'error',
            message: `Failed to process ${dietType} Diet`,
        }).code(500);
    }
};

// General handler for meals or workouts only
const handleMealsOrWorkouts = async (req, h, dietType, dataType) => {
    try {
        console.log(`[INFO] Fetching ${dataType} for dietType: ${dietType}`);

        const data = dataType === 'meals'
            ? await inferenceService.getMeals(dietType)
            : await inferenceService.getWorkouts(dietType);

        if (!data || data.length === 0) {
            return h.response({
                status: 'fail',
                message: `No ${dataType} found for diet type: ${dietType}`,
            }).code(404);
        }

        return h.response({
            status: 'success',
            data: { [dataType]: data },
        }).code(200);
    } catch (err) {
        console.error(`[ERROR] Failed to fetch ${dataType} for ${dietType}:`, err.message);
        return h.response({
            status: 'error',
            message: `Failed to fetch ${dataType} for ${dietType}`,
        }).code(500);
    }
};

// Handlers for specific diet types (meals and workouts)
const handleCutting = (req, h) => handleDietWithWorkouts(req, h, 'Cutting');
const handleBulking = (req, h) => handleDietWithWorkouts(req, h, 'Bulking');
const handleMaintaining = (req, h) => handleDietWithWorkouts(req, h, 'Maintaining');

// Handlers for specific data types (meals or workouts)
const handleMealsByType = (req, h) => {
    const { dietType } = req.params;
    return handleMealsOrWorkouts(req, h, dietType, 'meals');
};

const handleWorkoutsByType = (req, h) => {
    const { dietType } = req.params;
    return handleMealsOrWorkouts(req, h, dietType, 'workouts');
};

module.exports = {
    handleCutting,
    handleBulking,
    handleMaintaining,
    handleMealsByType,
    handleWorkoutsByType,
};
