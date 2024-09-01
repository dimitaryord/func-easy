import { Storage } from '@google-cloud/storage';
import * as crypto from 'crypto';
import JSZip from 'jszip';

import dotenv from 'dotenv';
dotenv.config();

let storage: Storage;

try {
    const credentials = {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n')
    };

    if (!credentials.client_email) {
        throw new Error('GOOGLE_STORAGE_EMAIL environment variable is not set');
    }

    if (!credentials.private_key) {
        throw new Error('GOOGLE_STORAGE_PRIVATE_KEY environment variable is not set');
    }

    storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        credentials: credentials
    });
} catch (error) {
    console.error('Error initializing Google Cloud Storage:', error);
    throw error;
}

const bucketName = process.env.GCS_BUCKET_NAME;

if (!bucketName) {
    throw new Error('GCS_BUCKET_NAME environment variable is not set');
}

export async function deployToGCS(functionName: string, code: string): Promise<{ bucketName: string | undefined; filename: string }> {
    const folderName = 'deployments';
    const bucketName = process.env.GCS_BUCKET_NAME || '';

    if (bucketName === '') {
        throw new Error('GCS_BUCKET_NAME environment variable is not set');
    }
    
    console.log(`Uploading ${functionName} to GCS bucket ${bucketName} in folder ${folderName}...`);
    const hash = crypto.createHash('md5').update(code).digest('hex');
    const filename = `${folderName}/${functionName}_${hash}.zip`;

    const bucket = storage.bucket(bucketName || '');
    const blob = bucket.file(filename);

    try {
        const zip = new JSZip();
        zip.file(`${functionName}.py`, code);
        const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

        await blob.save(zipContent, {
            contentType: 'application/zip',
        });

        console.log(`${filename} uploaded to ${bucketName}.`);

        return { bucketName, filename };
    } catch (error) {
        console.error('ERROR:', error);
        throw error;
    }
}