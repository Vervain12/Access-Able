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
  const [currentUser, setCurrentUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user);      
    }
    fetchUser();
  }, [supabase]);


  return (
   <div>
     <Button variant="outlined">Text</Button>
      <h1>Hello {currentUser?.email}</h1>
      <button onClick={()=>{redirect('/auth')}}>
        Signup
      </button>

      <button onClick={()=>{redirect('/search')}}>
        Go To Map
      </button>
   </div>
  );
}
