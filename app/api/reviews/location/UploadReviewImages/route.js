import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
    try {
        const supabase = await createClient();
        const data = await request.formData();
        const files = data.getAll('images');
        const reviewId = data.get('review_id');

        const results = await Promise.all(files.map(async (file) => {
          const { data, error } = await supabase
            .storage
            .from('reviews')
            .upload(`${reviewId}/${file.name}`, file);
          
          if (error) throw error;
          return data;
        }));

        return NextResponse.json({ 
            success: true, 
            data: results 
        });

    } catch (error) {
    return NextResponse.json({ error: `Image upload unsuccessful. ${error.message}` }, { status: 400 })
  }

}
