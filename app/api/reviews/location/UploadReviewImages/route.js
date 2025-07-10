import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { imageCheck } from "@/app/api/api-components/content-safety";

export async function POST(request) {
    try {
        const supabase = await createClient();
        const data = await request.formData();
        const files = data.getAll('images');
        const reviewId = data.get('review_id');

        const contentResults = await imageCheck({files});

        const failedChecks = contentResults.filter(result => !result.success);
        if (failedChecks.length > 0) {
            return NextResponse.json({ 
                error: 'CONTENT_POLICY_VIOLATION',
                message: 'Image content check failed.'
            }, { status: 400 });
        }

        const unsafeImages = contentResults.filter(result => 
            result.analysis?.some(category => category.severity >= 2)
        );
        unsafeImages.forEach((image, index) => {
          console.log(`Unsafe Image ${index + 1} (${image.fileName}):`, image.analysis);
        });
        
        if (unsafeImages.length > 0) {
            return NextResponse.json({ 
                error: 'CONTENT_POLICY_VIOLATION',
                message: 'One or more images violate content safety guidelines'
            }, { status: 400 });
        }

        const results = await Promise.all(files.map(async (file, index) => {

          const fileName = file.name.split(" ");
          
          const { data, error } = await supabase
            .storage
            .from('reviews')
            .upload(`${reviewId}/${reviewId}-${fileName[0]}`, file);
          
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
