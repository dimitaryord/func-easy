import { deployToGCS } from '../../utils/storage-deployment';
import { getGitHubRepoContents, getGitLabProjectContents, getBitbucketRepoContents } from '../../utils/get-repo';
import type { APIRoute } from 'astro';
import { deployFunctionFromBucket } from '../../utils/function-deployment';

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('Request received:', request);
    const { owner, repo, provider, project_id, branch = 'main', token } = await request.json();
    let files;
    const srcFunctionsPath = 'src/functions';

    console.log('Request data:', { owner, repo, provider, project_id, branch, token });

    switch (provider) {
      case 'github':
        console.log('Fetching GitHub repo contents');
        files = await getGitHubRepoContents(token, srcFunctionsPath, branch, owner, repo);
        break;
      case 'gitlab':
        files = await getGitLabProjectContents(token, srcFunctionsPath, branch, project_id);
        break;
      case 'bitbucket':
        files = await getBitbucketRepoContents(token, srcFunctionsPath, branch, owner, repo);
        break;
      default:
        throw new Error('Invalid provider');
    }

    const deploymentPromises = files.map(async (file) => {
      const functionName = file.path.replace(/^.*[\\\/]/, '').replace('.py', '');
      console.log('Preparing to deploy function:', functionName);

      const url = await deployToGCS(functionName, file.content);

      const entryPointMatch = file.content.match(/def (\w+)\(/);
      if (!entryPointMatch) {
        throw new Error(`Unable to find the entry point for function in file: ${file.path}`);
      }
      const entryPoint = entryPointMatch[1];

      try {
        const functionPath = await deployFunctionFromBucket(
          'easy_func_' + functionName + '_http',
          'easy-func',
          url.filename,
          entryPoint
        );
        return {
          name: functionName,
          url,
          functionPath
        };
      } catch (deployError) {
        console.error(`Error deploying function ${functionName}:`, deployError);
        throw deployError; 
      }
    });

    const deployedFunctions = await Promise.all(deploymentPromises);

    console.log('Deployed functions:', deployedFunctions);

    return new Response(JSON.stringify({
      message: 'All functions deployed successfully',
      functions: deployedFunctions
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('Deployment error:', error);
    let errorMessage = error.message;
    if (error.code === 3 && error.details === 'Invalid resource field value in the request.') {
      errorMessage = 'Deployment error: Invalid resource field value in the request. Please check your project settings and ensure all resources are correctly configured.';
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
