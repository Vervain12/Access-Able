import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { new_picture } = body;
        console.log("Changing profile picture to:", new_picture);

        if (!new_picture) {
            return NextResponse.json(
                { error: 'You must select a valid image to change your profile picture.' }, 
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('profiles')
            .update({ 
                profile_picture: new_picture
            })
            .eq('id', user.id) 
            .select();
            
        if (error) throw error;

        return NextResponse.json({ data }, { status: 201 })
    } catch (error) {
        console.log("Error when changing profile picture: ", error)
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
}