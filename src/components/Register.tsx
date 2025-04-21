import { useState } from 'react';
import API from '../api';

export default function Register({ onSuccess, switchToLogin }: { onSuccess: () => void; switchToLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleRegister = async () => {
    try {
      await API.post('/auth/register', { username, password });
      onSuccess(); // switch to login
    } catch (e) {
      setErr('User already exists');
    }
  };

  return (
    <div className="space-y-2 max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-bold">Register</h2>
      {err && <p className="text-red-500">{err}</p>}
      <input className="border p-2 w-full" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={handleRegister}>Register</button>
      <p className="text-sm text-center mt-2">
        Already have an account?{' '}
        <button className="text-blue-500 underline" onClick={switchToLogin}>
          Login here
        </button>
      </p>
    </div>
  );
}
