import { put } from '@vercel/blob';

export async function uploadToVercelBlob(file) {
  try {
    // Use Vercel's Blob API to upload the file directly
    const blob = await put(file.name, file, {
      access: 'public', // Make sure the file is publicly accessible
    });

    return blob.url; // Return the URL of the uploaded image
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    throw error;
  }
}
