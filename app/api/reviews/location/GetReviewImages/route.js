import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const review_id = searchParams.get('review_id');

        if ( review_id === null || review_id === ' ') {
            return NextResponse.json(
                { error: 'No review id given.' }, 
                { status: 400 }
            )
        }

        console.log('Fetching review images for ', review_id); 

        const { data: files, error } = await supabase
        .storage
        .from('reviews')
        .list(review_id, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        });

        if (error) {
            return NextResponse.json({ error: "Error fetching reviews." }, { status: 400 })
        }

        const data = await Promise.all(
            files.map(async (file) => {
                const { data: { publicUrl } } = supabase
                .storage
                .from('reviews')
                .getPublicUrl(`${review_id}/${file.name}`);

                return {
                    url: publicUrl
                }
            })
        )

        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
}