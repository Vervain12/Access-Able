import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');

        if ( user_id === null || user_id.trim() === '') {
            return NextResponse.json(
                { error: 'No user id given.' }, 
                { status: 400 }
            )
        }

        console.log('Fetching profile picture for', user_id); 

        const {data, error} = await supabase
            .from('profiles')
            .select('profile_picture')
            .eq('id', user_id)
            .single()

        if (error) {
            return NextResponse.json({ error: `Error fetching profile picture of ${user_id}.` }, { status: 400 })
        }

        console.log("Profile picture fetched: ", data.profile_picture)
        return NextResponse.json({ data: data.profile_picture || null }, { status: 200 })

    } catch (error){
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
}