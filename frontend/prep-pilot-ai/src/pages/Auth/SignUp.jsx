import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input.jsx';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector.jsx';
import { validateEmail } from '../../utils/helper.js';

const SignUp = ({setCurrentPage}) => {
  const [profilePic, setProfilePic] = React.useState(null);
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
 
  const [error, setError] = React.useState(null);

  const naigarte = useNavigate();

  // lets handle sign up form submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profilePicUrl = "";
    if(!fullName || fullName.length < 3) {
      setError("Full name must be at least 3 characters long.");
      return;
    }

    if(!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if(!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError("");

    try {
      // Simulate successful login
      
    } catch (err) {
      if(err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      } 
    }
    

  };
  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center" >
      <h3 className="text-lg font-semibold text-black"> Create an account </h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">Get started today by entering your details below!</p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input 
            value={fullName}
            onChange={(target) => {setFullName(target.value)}}
            label="Full Name"
            placeholder="e.g Sanjana "
            type="text"
          />

          <Input 
            value={email}
            onChange={(target) => {setEmail(target.value)}}
            label="Enail Address"
            placeholder="saiyedk@gmail.com "
            type="text"
          />
          <Input 
            value={password}
            onChange={(target) => {setPassword(target.value)}}
            label="Password"
            placeholder="Min. 8 characters "
            type="password"
          />
        </div>

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          Sign Up
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Already have an account? {" "}
          <button 
            className="font-medium underline text-primary cursor-pointer" 
            onClick={() => {
              setCurrentPage("login");
            }}
          >
            Login
          </button>
        </p>

      </form>
    </div>
  )
}

export default SignUp
