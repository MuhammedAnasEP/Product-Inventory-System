import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login_page/Login';
import Register from './pages/register_page/Register';

function App() {
  return (
    <Routes>
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
    </Routes>
  );
}

export default App;
