import { NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
    const {ocrText} = await req.json();

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
                    content: `You are an academic assistant helping L2 English learners understand their lecture slides. Given the following text extracted from a lecture slide, return a JSON object with exactly 3 fields:
                                - "key_concepts": an array of 1-3 bullet point objects of the main takeaways from this slide
                                - "vocabulary": an array of objects with "word", "definition", and "partOfSpeech"
                                - "included": boolean that specifies whether the slide contains course content or is a filler slide such as an introduction, table of contents, heading, or something similar
                                
                            Focus on academic vocabulary and core concepts. Keep explanations simple and clear.
                            Return only valid JSON, no markdown, no extra text.

                            Slide text:
                            ${ocrText}`
                }]
            })
    });

    const data = await response.json();
    console.log("Full Claude response:", JSON.stringify(data));

    if (!data.content || !data.content[0]) {
        return NextResponse.json({error: "No content returned", raw: data}, {status: 500});
    }
    const text = data.content[0].text;
    console.log("Claude text:", text);
    try {
        const cleanText = text.replace(/```json|```/g, "").trim(); //added to fix API response to only contain JSON text
        return NextResponse.json(JSON.parse(cleanText));
    } catch (e) {
        console.error("JSON parse failed:", text);
        return NextResponse.json({error: "Parse failed", raw: text}, {status: 500});
    }
}