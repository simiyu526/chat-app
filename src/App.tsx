import { useState } from 'react';
import { getToken } from './auth';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';

function App() {
  const [view, setView] = useState(getToken() ? 'chat' : 'login');

  if (view === 'login') return (
    <Login onLogin={() => setView('chat')} switchToRegister={() => setView('register')} />
  );
  if (view === 'register') return (
    <Register onSuccess={() => setView('login')} switchToLogin={() => setView('login')} />
  );
  if (view === 'chat') return (
    <Chat onLogout={() => setView('login')} />
  );

  return null;
}

export default App;
