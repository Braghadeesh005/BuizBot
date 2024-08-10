import React from 'react';
import { loginWithGoogle } from '../api/auth';

function Login() {
  return (
    <div>
      <h1>Login</h1>
      <button onClick={loginWithGoogle}>Login with Google</button>
    </div>
  );
}

export default Login;