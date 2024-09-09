import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            await axios.post('/api/signup', { email, password });
            alert('Signup successful!');
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    return (
        <div>
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                />
                <button type="submit">Signup</button>
            </form>
            <a href="/login">Login</a>
        </div>
    );
}

export default Signup;