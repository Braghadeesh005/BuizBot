import React from 'react';
import { loginWithGoogle } from '../api/auth';
import "./Login.css"

function Login() {
  return (
    <div className='Login-container'>
      <h1 className='heading'>Buiz.ai</h1>
      <button onClick={loginWithGoogle} className='button'>Login with Google</button>
    </div>
  );
}

export default Login;