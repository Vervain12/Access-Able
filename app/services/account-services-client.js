'use client'

import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    window.location.href = "/";
    return error;
}

export async function getProfilePicture(user_id){
    const response = await fetch(`/api/reviews/user/GetProfilePicture?user_id=${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        console.error('Error fetching profile picture:', response.statusText);
        return null;
    }

    const result = await response.json();
    return result || "";
}

export async function fetchProfilePictureOptions() {
    const response = await fetch('/api/reviews/user/ProfilePictureList');
    if (!response.ok) {
        console.error('Error fetching profile picture options:', response.statusText);
        return [];
    }
    const result = await response.json();

    return result;
}

export async function selectProfilePicture(new_picture) {
    const response = await fetch('/api/reviews/user/ChangeProfilePicture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_picture }),
    });

    const result = await response.json();

    if (response.ok) {
        console.log('Profile Picture Changed Successfully:', result.data);
        return true;
    } else {
        console.error('Profile Picture Error:', result.error);
        return false
    }
}