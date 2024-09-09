import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [botToken, setBotToken] = useState('');
    const [referralMessage, setReferralMessage] = useState('');
    const [rewardStructure, setRewardStructure] = useState('');
    const [stats, setStats] = useState([]);

    const handleTokenSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/bot', {
                token: botToken,
                settings: {
                    referralMessage,
                    rewardStructure,
                },
            }, {
                headers: { Authorization: localStorage.getItem('token') }
            });
            alert('Bot token submitted successfully!');
            fetchStats(); // Refresh stats after submission
        } catch (error) {
            console.error('Error submitting bot token:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/stats', {
                headers: { Authorization: localStorage.getItem('token') }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleDeleteBot = async (botId) => {
        try {
            await axios.delete(`/api/bot/${botId}`, {
                headers: { Authorization: localStorage.getItem('token') }
            });
            alert('Bot token deleted successfully!');
            fetchStats(); // Refresh stats after deletion
        } catch (error) {
            console.error('Error deleting bot token:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div>
            <h1>Dashboard123</h1>
            <form onSubmit={handleTokenSubmit}>
                <input
                    type="text"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="Enter your bot token"
                    required
                />
                <input
                    type="text"
                    value={referralMessage}
                    onChange={(e) => setReferralMessage(e.target.value)}
                    placeholder="Enter referral message"
                    required
                />
                <input
                    type="text"
                    value={rewardStructure}
                    onChange={(e) => setRewardStructure(e.target.value)}
                    placeholder="Enter reward structure"
                    required
                />
                <button type="submit">Submit</button>
            </form>
            <h2>Referral Statistics</h2>
            <ul>
                {stats.map((stat, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                        Bot Token hello: {stat.token}, Referrals: {stat.referrals.length}
                        <button 
    onClick={() => handleDeleteBot(stat._id)} 
    style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
>
    Delete
</button>

                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;