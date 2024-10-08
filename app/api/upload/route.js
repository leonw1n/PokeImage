import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { uploadToVercelBlob } from '../../utils/vercelBlob';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const openAiApiKey = process.env.OPENAI_API_KEY;

  try {
    // Step 1: Upload the image to Vercel Blob storage using the utility function
    const imageUrl = await uploadToVercelBlob(file);

    // Step 2: Pass the image URL directly to GPT-4 with vision capabilities
    const openai = new OpenAI({
      apiKey: openAiApiKey,
    });

    const messages = [
      {
        role: 'system',
        content: 'You are a Pokedex AI from the Pokémon universe. Based on the appearance of the Pokémon in the image I provide, generate a Pokedex-style description in the tone of Pokémon Black and White.',
      },
      {
        role: 'user',
        content: `Please analyze the following image URL and generate a description for the Pokémon as if you were analyzing it directly: ${imageUrl}`,
      },
    ];

    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    const pokedexDescription = gptResponse.choices[0].message.content.trim();

    return NextResponse.json({ description: pokedexDescription });
  } catch (error) {
    console.error('Error processing the request:', error);
    return NextResponse.json({ error: 'Failed to get a description' }, { status: 500 });
  }
}
