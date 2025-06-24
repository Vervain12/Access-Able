import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const review_id = searchParams.get('review_id');

        console.log("Review to delete: ", review_id);

        if (!review_id) {
            return NextResponse.json(
                { error: 'Review id is necessary to delete a review.' }, 
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('reviews')
            .delete()
            .eq('review_id', review_id)
            .select();
            
        if (error) throw error;

        return NextResponse.json({ data }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

}
