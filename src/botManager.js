const TelegramBot = require('node-telegram-bot-api');
const { Bot } = require('./models/Bot');

async function initializeBots() {
    try {
        const bots = await Bot.find();
        bots.forEach(botData => {
            const bot = new TelegramBot(botData.token, { polling: true });

            bot.on('polling_error', (error) => {
                console.error(`Polling error for bot ${botData.token}:`, error);
            });

            bot.on('message', (msg) => {
                console.log(`Received message from ${msg.from.id}: ${msg.text}`);
            });

            bot.onText(/\/start/, async (msg) => {
                console.log(`Received /start command from ${msg.from.id}`);
                const referrerId = msg.text.split(' ')[1];
                if (referrerId) {
                    try {
                        const referrerBot = await Bot.findOne({ 'referrals.userId': referrerId });
                        if (referrerBot) {
                            referrerBot.referrals.push({ userId: msg.from.id });
                            await referrerBot.save();
                            console.log(`Referral saved for user ${msg.from.id}`);
                        } else {
                            console.log(`Referrer bot not found for user ${referrerId}`);
                        }
                    } catch (error) {
                        console.error(`Error processing referral for user ${msg.from.id}:`, error);
                    }
                }
                bot.sendMessage(msg.chat.id, botData.settings.referralMessage)
                    .then(() => console.log(`Sent referral message to ${msg.chat.id}`))
                    .catch(error => console.error(`Error sending message to ${msg.chat.id}:`, error));
            });

            bot.onText(/\/referral/, (msg) => {
                console.log(`Received /referral command from ${msg.from.id}`);
                const referralLink = `https://t.me/your_bot?start=${msg.from.id}`;
                bot.sendMessage(msg.chat.id, `Your referral link: ${referralLink}`)
                    .then(() => console.log(`Sent referral link to ${msg.chat.id}`))
                    .catch(error => console.error(`Error sending message to ${msg.chat.id}:`, error));
            });

            bot.onText(/\/stats/, async (msg) => {
                console.log(`Received /stats command from ${msg.from.id}`);
                try {
                    const userBot = await Bot.findOne({ 'referrals.userId': msg.from.id });
                    if (userBot) {
                        const userReferrals = userBot.referrals.filter(ref => ref.userId === msg.from.id);
                        bot.sendMessage(msg.chat.id, `You have ${userReferrals.length} referrals.`)
                            .then(() => console.log(`Sent stats to ${msg.chat.id}`))
                            .catch(error => console.error(`Error sending message to ${msg.chat.id}:`, error));
                    } else {
                        bot.sendMessage(msg.chat.id, 'No referrals found.')
                            .then(() => console.log(`Sent no referrals message to ${msg.chat.id}`))
                            .catch(error => console.error(`Error sending message to ${msg.chat.id}:`, error));
                    }
                } catch (error) {
                    console.error(`Error fetching stats for user ${msg.from.id}:`, error);
                }
            });

            console.log(`Bot initialized with token: ${botData.token}`);
        });
    } catch (error) {
        console.error('Error initializing bots:', error);
    }
}

module.exports = { initializeBots };