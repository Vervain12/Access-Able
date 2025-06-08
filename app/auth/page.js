'use client'

import { signup } from "./signup";
import { signin } from "./signin";
import { useState } from "react";
import Button from '@mui/material/Button';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import SignupMessage from "../components/signup-message";

export default function LoginPage (){

    const [toggleSignup, setToggleSignup] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
    const handleAuthToggle = () => {
        setToggleSignup(!toggleSignup);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        if (toggleSignup) {
            const result = await signup(formData);
            if (result) {
                setShowMessage(true);
            }
        } else {
            await signin(formData);
        }
    }

    return (
        <div style={containerStyle}>
            <div style={contentStyle}>
                <h1 style={headingStyle}>Access Able</h1>
                
                <form style={formStyle} onSubmit={handleSubmit}>
                    {toggleSignup ?
                    <div style={inputContainerStyle}>
                        <label htmlFor="username" style={labelStyle}>Username:</label>
                        <input id="username" name="username" type="username" style={inputStyle} />
                    </div>
                    : <></>}
                    
                    <div style={inputContainerStyle}>
                        <label htmlFor="email" style={labelStyle}>Email:</label>
                        <input id="email" name="email" type="email" required style={inputStyle} />
                    </div>
                    
                    <div style={inputContainerStyle}>
                        <label htmlFor="password" style={labelStyle}>Password:</label>
                        <input id="password" name="password" type="password" required style={inputStyle} />
                    </div>
                    
                    <Button 
                        variant="contained"
                        style={buttonStyle}
                        type="submit"
                    >
                        {toggleSignup ? "Sign Up" : "Sign In"}
                    </Button>
                </form>
                
                <div style={toggleTextStyle} onClick={handleAuthToggle}>
                    {toggleSignup ? "Already have an account? Sign in" : "No account? Sign up"}
                </div>
            </div>
            {showMessage && (
                <SignupMessage />
            )}
        </div>
    )
}

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
};

const contentStyle = {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%'
};

const headingStyle = {
    color: 'black',
    fontSize: '1.5rem',
    marginBottom: '24px',
    fontWeight: '600',
    margin: '0 0 24px 0'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '16px'
};

const inputContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%'
};

const labelStyle = {
    color: 'black',
    fontSize: '0.9rem',
    marginBottom: '8px',
    fontWeight: '500'
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    color: 'black'
};

const toggleTextStyle = {
    color: '#1976d2',
    fontSize: '0.9rem',
    marginTop: '16px',
    cursor: 'pointer',
    textDecoration: 'underline'
};

const buttonStyle = {
    width: '100%',
    padding: '12px 24px',
    marginTop: '8px'
};
