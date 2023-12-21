// src/components/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import "./login.css"

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const[error,setError]=useState('')

  const handleLogin = async () => {
    try {
      if(!username||!password){
        setError('Username va Passwork khong duoc de trong')
        return
      }
      const response = await axios.post('http://localhost:5000/login', {
        username: username,
        password: password,
      });

      const { token, role } = response.data;

      // Lưu token và role vào Local Storage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Chuyển hướng đến trang quản lý công việc
      window.location.href = '/tasks';
    } catch (error) {
      console.error('loi login:', error);
    }
  };

  return (
    <div className='container'>
      <h2>Login Page</h2>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
     
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
     
      {error&& <p style={{color:"red"}}>{error}</p>}
      <button onClick={handleLogin}>Login</button>
    
    </div>
  );
  };
  


export default LoginPage
