import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
    try {

        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const location_id = searchParams.get('location_id');

        if ( location_id === null || location_id === ' ') {
            return NextResponse.json(
                { error: 'No location id given.' }, 
                { status: 400 }
            )
        }

        console.log('Fetching reviews for ', location_id); 

        const {data, error} = await supabase
            .from('reviews')
            .select('*')
            .eq('location_id', location_id)

        if (error) {
            return NextResponse.json({ error: "Error fetching reviews." }, { status: 400 })
        }

        return NextResponse.json({ data }, { status: 200 })
    } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}