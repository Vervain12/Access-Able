import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { disabilities } = body;
        console.log("Changing disabilities to:", disabilities);

        const { data, error } = await supabase
            .from('profiles')
            .update({ disability_info: disabilities})
            .eq('id', user.id);

        if (error) throw error;

        return NextResponse.json({ data }, { status: 201 })
    } catch (error) {
        console.log("Error when updating disabilities: ", error)
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
}
