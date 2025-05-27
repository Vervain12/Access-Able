'use server'

import { createClient } from "../../utils/supabase/server";
import { redirect } from "next/navigation";

export async function signin (formData){

    const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    redirect('/');
}