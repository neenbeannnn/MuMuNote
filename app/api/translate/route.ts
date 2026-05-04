import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
    const {imageBase64, language} = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY!,
            "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1000,
            messages: [{
                role: "user",
                content: [
                    {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: "image/png",
                            data: imageBase64,
                        }
                    },
                    {
                        type: "text",
                        text: `Translate all the text visible in this image into ${language}. Return only the translated text and don't add on any additional information.`
                    }
                ]
            }]
        })
    });
    
    const data = await response.json();
    console.log("Claude translate response:", JSON.stringify(data));

    if (!data.content?.[0]?.text) {
        return NextResponse.json({error: "No translation returned", raw: data}, {status: 500});
    }

    return NextResponse.json({translate: data.content[0].text});
}