import path from "path";
import fs from "fs";

export async function GET() {
    try {
        const pfpDirectory = path.join(process.cwd(), "public", "pfp");
        const fileNames = fs.readdirSync(pfpDirectory);
        const pfps = fileNames.map((fileName) => ({
            pfp: `/pfp/${fileName}`,
        }));
        
        console.log("All profile pictures: ", pfps)
        return Response.json(pfps);
    } catch (error) {
        return Response.json({ error: "Failed to fetch profile pictures" }, { status: 500 });
    }
}