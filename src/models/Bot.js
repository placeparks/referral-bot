const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
    token: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    settings: {
        referralMessage: { type: String, default: 'Join using my referral link!' },
        rewardStructure: { type: String, default: 'points' },
    },
    referrals: [
        {
            userId: { type: String },
            date: { type: Date, default: Date.now },
        }
    ],
});

const Bot = mongoose.model('Bot', botSchema);
module.exports = { Bot };