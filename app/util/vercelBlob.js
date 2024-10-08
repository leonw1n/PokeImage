// /utils/vercelBlob.js

export async function uploadToVercelBlob(file) {
    const vercelBlobApiKey = process.env.VERCEL_BLOB_API_KEY;
    const vercelBlobEndpoint = 'https://vercel-blob-upload-endpoint'; // Replace with the actual endpoint
  
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch(vercelBlobEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vercelBlobApiKey}`,
          'Content-Type': file.type,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload the image to Vercel Blob storage');
      }
  
      const blobData = await response.json();
      return blobData.url; // Return the URL of the uploaded image
    } catch (error) {
      console.error('Error uploading to Vercel Blob:', error);
      throw error;
    }
  }
  