const handlers = require('../server/handler');

const routes = [
    { method: 'GET', path: '/api/cutting', handler: handlers.handleCutting },
    { method: 'GET', path: '/api/bulking', handler: handlers.handleBulking },
    { method: 'GET', path: '/api/maintaining', handler: handlers.handleMaintaining },
    { method: 'GET', path: '/api/{dietType}/meals', handler: handlers.handleMealsByType },
    { method: 'GET', path: '/api/{dietType}/workouts', handler: handlers.handleWorkoutsByType },
];

module.exports = routes;
