'use server'

import { revalidatePath } from "next/cache";
import { createClient } from "../../utils/supabase/server";
import { redirect } from "next/navigation";

export async function signup (formData){
    const supabase = await createClient();

    const userData = {
        email: formData.get('email'),
        password: formData.get('password'),
        options: {
            data: {
                display_name: formData.get('username'),
            }
        }
    }

    const { data, error } = await supabase.auth.signUp(userData);

    if (error) {
        redirect('/error');
    }

    if (data.user) {
        return true;
    }

    revalidatePath('/', 'layout');
}