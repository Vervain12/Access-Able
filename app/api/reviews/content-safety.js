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

}