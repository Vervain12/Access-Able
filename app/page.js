'use client'

import { redirect } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { createClient } from '@/utils/supabase/client';

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
      <h1>Hello {currentUser?.email}</h1>
      <button onClick={()=>{redirect('/auth')}}>
        Signup
      </button>
   </div>
  );
}
