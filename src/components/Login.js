import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', { email, password });
            localStorage.setItem('token', response.data.token);
            alert('Login successful!');
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
            <a href="/signup">Signup</a>
        </div>
    );
}

export default Login;