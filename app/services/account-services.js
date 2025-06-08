'use server'

import { createClient } from "@/utils/supabase/server"

// Disability info editing + profile editing
// TODO: Move this to api

export async function updateDisabilityInfo(userId, disabilities) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
        .from('profiles')
        .update({ disability_info: disabilities})
        .eq('id', userId);

    console.log('Update result:', { data, error, user });

    if (error) {
        console.error('Error updating disability info:', error);
    }

}