'use client'

import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    window.location.href = "/";
    return error;
}