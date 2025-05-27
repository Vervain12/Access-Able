'use server'

import { createClient } from "@/utils/supabase/client"

// Disability info editing + profile editing
// May be moved to /api later

export async function updateDisabilityInfo(userId, disabilities) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('profiles')
        .update({ disability_info: disabilities})
        .eq('id', userId);

    if (error) {
        console.error('Error updating disability info:', error);
    }

}