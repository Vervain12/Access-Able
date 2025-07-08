const ContentSafetyClient = require("@azure-rest/ai-content-safety").default;
const { isUnexpected } = require("@azure-rest/ai-content-safety");
const { AzureKeyCredential } = require("@azure/core-auth");

export async function textCheck({text}) {
    const endpoint = process.env.CONTENT_SAFETY_ENDPOINT;
    const key = process.env.CONTENT_SAFETY_KEY;

    const credential = new AzureKeyCredential(key);
    const client = ContentSafetyClient(endpoint, credential);

    const analyzeTextOption = { text: text };
    const analyzeTextParameters = { body: analyzeTextOption };
    const result = await client.path("/text:analyze").post(analyzeTextParameters);

    if (isUnexpected(result)) {
        throw result;
    }
    
    return result.body.categoriesAnalysis;
}

export async function imageCheck({files}) {
    const endpoint = process.env.CONTENT_SAFETY_ENDPOINT;
    const key = process.env.CONTENT_SAFETY_KEY;

    const credential = new AzureKeyCredential(key);
    const client = ContentSafetyClient(endpoint, credential);

    const imageResult = await Promise.all(files.map(async (file) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const analyzeImage = {
                image: {
                    content: buffer.toString('base64')
                }
            };
            const analyzeImageParameters = { body: analyzeImage };
            const result = await client.path("/image:analyze").post(analyzeImageParameters);

            if (isUnexpected(result)) {
                throw new Error(`Content Safety API error: ${result.status} - ${result.body?.error?.message || 'Unknown error'}`);
            }

            return {
                fileName: file.name,
                analysis: result.body.categoriesAnalysis,
                success: true
            };

        } catch (error) {
            return {
                fileName: file.name,
                error: error.message,
                success: false
            };
        }
    }));
    return imageResult;
}