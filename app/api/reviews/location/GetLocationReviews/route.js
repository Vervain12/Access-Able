import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const location_id = searchParams.get('location_id');
        
        if (!location_id) {
            return NextResponse.json(
                { error: 'No location id given.' }, 
                { status: 400 }
            );
        }
        
        console.log('Fetching reviews for ', location_id); 
        
        const { data: reviews, error: reviewsError } = await supabase
            .from('reviews')
            .select('*')
            .eq('location_id', location_id);
            
        if (reviewsError) {
            console.error('Reviews error:', reviewsError);
            return NextResponse.json({ 
                error: "Error fetching reviews.",
                details: reviewsError.message 
            }, { status: 400 });
        }
      
        const userIds = [reviews.map(review => review.user_id)];

        if (userIds.length > 0) {
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, profile_picture')
                .in('id', userIds)
               
            if (profilesError) {
                console.error('Error fetching profiles for pfps:', profilesError);
                return NextResponse.json({ error: profilesError}, { status: 400 });
            }

            const profilesMap = new Map(profiles?.map(profile => [profile.id, profile.profile_picture]));

            const reviewsWithPfp = reviews.map(review => ({
                ...review,
                profile_picture: profilesMap.get(review.user_id)
            }));

            return NextResponse.json({ data: reviewsWithPfp }, { status: 200 });
        }

        //If no reviews/profiles
        return NextResponse.json({ data: [] }, { status: 200 });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ 
            error: 'Invalid request',
            details: error.message 
        }, { status: 500 });
    }
}