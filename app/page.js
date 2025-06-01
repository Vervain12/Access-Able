'use client'
import { redirect } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { createClient } from '@/utils/supabase/client';
import Button from '@mui/material/Button';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default function Home() {

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={headingStyle}>Access Able</h1>
        
        <div style={buttonContainerStyle}>
          <Button 
            onClick={() => {redirect('/auth')}}
            variant="contained"
            style={buttonStyle}
          >
            Signup / Login
          </Button>
          
          <Button 
            onClick={() => {redirect('/search/map')}}
            variant="contained"
            style={buttonStyle}
          >
            Continue as Guest
          </Button>
          {/*
          <Button 
            onClick={() => {redirect('/search/list')}}
            variant="contained"
            style={buttonStyle}
          >
            Testing: Go to search (list)
          </Button>

          <Button 
            onClick={() => {redirect('/search/map')}}
            variant="contained"
            style={buttonStyle}
          >
            Testing: Go to search (map)
          </Button>*/}
        </div>
      </div>
    </div>
  );
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
  marginBottom: '16px', 
  fontWeight: '600',
  margin: '0 0 16px 0'
};

const paragraphStyle = {
  color: 'black',
  fontSize: '1rem', 
  lineHeight: '1.5', 
  marginBottom: '24px',
  margin: '0 0 24px 0'
};

const buttonContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%'
};

const buttonStyle = {
  width: '100%',
  padding: '12px 24px'
};