'use client'

import { createClient } from "@/utils/supabase/client";

export async function signin(formData) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (error) {
        console.error("Sign in error:", error);
        return error;
    }

    window.location.href = "/search/list";
}
