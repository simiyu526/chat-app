import { useState } from 'react';
import API from '../api';
import { setToken } from '../auth';

export default function Login({ onLogin, switchToRegister }: { onLogin: () => void; switchToRegister: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { username, password });
      setToken(res.data.token);
      onLogin();
    } catch {
      setErr('Invalid credentials');
    }
  };

  return (
    <div className="space-y-2 max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-bold">Login</h2>
      {err && <p className="text-red-500">{err}</p>}
      <input className="border p-2 w-full" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-green-500 text-white px-4 py-2 rounded w-full" onClick={handleLogin}>Login</button>
      <p className="text-sm text-center mt-2">
        Don't have an account?{' '}
        <button className="text-blue-500 underline" onClick={switchToRegister}>
          Register here
        </button>
      </p>
    </div>
  );
}
