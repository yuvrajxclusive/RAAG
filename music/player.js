const queues = require('./queue');

function createQueue(guildId) {
    if (!queues.has(guildId)) {
        queues.set(guildId, {
            songs: [],
            loop: false
        });
    }

    return queues.get(guildId);
}

module.exports = {
    createQueue
};
