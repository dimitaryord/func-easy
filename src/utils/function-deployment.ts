import { CloudFunctionsServiceClient } from '@google-cloud/functions';

const functionsClient = new CloudFunctionsServiceClient({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }
});

const region = process.env.GOOGLE_CLOUD_REGION || 'us-central1';

export async function deployFunctionFromBucket(
    functionName: string,
    bucketName: string,
    objectName: string,
    entryPoint: string
): Promise<string> {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    if (!projectId) {
        throw new Error('GOOGLE_CLOUD_PROJECT_ID environment variable is not set');
    }

    // Sanitize function name
    const sanitizedFunctionName = functionName.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 63);

    const location = `projects/${projectId}/locations/${region}`;
    console.log(`Deploying function ${sanitizedFunctionName} from bucket ${bucketName}...`);
    const functionPath = `${location}/functions/${sanitizedFunctionName}`;
    console.log(`Function path: ${functionPath}`);
    const sourceArchiveUrl = `gs://${bucketName}/${objectName}`;

    const functionObj = {
        name: functionPath,
        entryPoint: entryPoint,
        runtime: 'python39',
        sourceArchiveUrl: sourceArchiveUrl,
        httpsTrigger: {},
        serviceAccountEmail: process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_EMAIL,
    };

    console.log('Function object:', JSON.stringify(functionObj, null, 2));

    try {
        await functionsClient.getFunction({ name: functionPath });

        console.log(`Function ${sanitizedFunctionName} already exists. Updating...`);

        const [operation] = await functionsClient.updateFunction({
            function: functionObj,
        });
        console.log(`Waiting for function ${sanitizedFunctionName} update to complete...`);
        await operation.promise();
    } catch (error: any) {
        if (error.code === 5) { 
            console.log(`Function ${sanitizedFunctionName} doesn't exist. Creating...`);
            const [operation] = await functionsClient.createFunction({
                location: location,
                function: functionObj,
            });
            console.log(`Waiting for function ${sanitizedFunctionName} creation to complete...`);
            await operation.promise();
        } else if (error.code === 3 && error.details === 'Invalid resource field value in the request.') {
            console.error('Deployment error: Invalid resource field value in the request. Please check your project settings and ensure all resources are correctly configured.', error);
            throw new Error('Deployment error: Invalid resource field value in the request. Please check your project settings and ensure all resources are correctly configured.');
        } else {
            console.error(`Error deploying function ${sanitizedFunctionName}:`, error);
            throw error;
        }
    }

    console.log(`Function ${sanitizedFunctionName} deployed successfully.`);
    return functionPath;
}