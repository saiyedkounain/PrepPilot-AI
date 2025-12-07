import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input.jsx';
import { validateEmail } from '../../utils/helper.js';

const Login = ({setCurrentPage}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  //handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)) {
      
      setError("Please enter a valid email address.");
      return;
    }

    if(!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    //login api call
    try {
      // Simulate successful login
      
    } catch (err) {
      if(err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      } 
    }
  }
  
  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center" >
      <h3 className="text-lg font-semibold text-black">Welcome Back!</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Please enter your details to login to your account.
      </p>

      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={(target) => setEmail(target.value)}
          label="Email Address"
          placeholder="saiyedk@example.com"
          type="text"
        />

        <Input
          value={password}
          onChange={(target) => setPassword(target.value)}
          label="Password"
          placeholder="*********"
          type="password"
        />

        {error && <p className='text-red-500 text-xs pb-2.5'> {error}</p>}

        <button type='submit' className='btn-primary'>
          Login
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          New User? Register now! {" "}
          <button 
            className="font-medium underline text-primary cursor-pointer" 
            onClick={() => {
              setCurrentPage("signup");
            }}
          >
            SignUp
          </button>
        </p>

      </form>
    </div>
  )
}

export default Login
