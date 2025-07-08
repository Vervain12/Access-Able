import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(request) {
    try {
        const supabase = await createClient();
        const { images } = await request.json();
        
        if (!images || images.length === 0) {
            return NextResponse.json({ message: "No images provided" }, { status: 400 });
        }

        const filePaths = images.map(image => {
            const fullUrl = image.url;
            const parts = fullUrl.split("/object/public/reviews/");
            return parts[1];
        });
            
        const { data: deleteData, error: deleteError } = await supabase
            .storage
            .from('reviews')
            .remove(filePaths);

        if (deleteError) {
            console.error('Error deleting files:', deleteError);
            return NextResponse.json({ error: "Failed to delete images" }, { status: 500 });
        }

        return NextResponse.json({ deleteData }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

}
