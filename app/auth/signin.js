'use server'

import { revalidatePath } from "next/cache";
import { createClient } from "../../utils/supabase/server";
import { redirect } from "next/navigation";

export async function signin (formData){

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (error) {
        console.error("Sign in error:", error);
        return;
    }

    revalidatePath('/search/list');
    redirect('/search/list');
}