import axios from 'axios';

export async function getGitHubRepoContents(token: string, dirPath: string, branch: string, owner: string, repo: string) {
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}`, {
            headers: { Authorization: `token ${token}` },
        });

        const pyFiles = response.data.filter((item: any) => item.type === 'file' && item.name.endsWith('.py'));

        const fileContentsPromises = pyFiles.map((file: any) =>
            axios.get(file.download_url, {
                headers: { Authorization: `token ${token}` },
                responseType: 'text',
            }).then((res: { data: string }) => ({ path: file.path, content: res.data })))

        const fileContents = await Promise.all(fileContentsPromises);
        return fileContents;
    } catch (error: any) {
        console.error('Error fetching GitHub directory content:', error.response?.data || error.message);
        return [];
    }
}

export async function getGitLabProjectContents(token: string, dirPath: string, branch: string, projectId: number) {
    try {
        const encodedDirPath = encodeURIComponent(dirPath);
        const response = await axios.get(`https://gitlab.com/api/v4/projects/${projectId}/repository/tree`, {
            headers: { 'PRIVATE-TOKEN': token },
            params: {
                path: encodedDirPath,
                ref: branch,
            },
        });

        const files = response.data.filter((item: any) => item.type === 'blob' && item.path.startsWith(dirPath) && item.path.endsWith('.py'));

        const fileContentsPromises = files.map((file: any) =>
            axios.get(`https://gitlab.com/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(file.path)}/raw`, {
                headers: { 'PRIVATE-TOKEN': token },
                params: { ref: branch },
            }).then((res: { data: string }) => ({ path: file.path, content: res.data }))
        );

        const fileContents = await Promise.all(fileContentsPromises);
        return fileContents;
    } catch (error: any) {
        console.error('Error fetching GitLab directory content:', error.response?.data || error.message);
        return [];
    }
}



export async function getBitbucketRepoContents(token: string, dirPath: string, branch: string, owner: string, repo: string, ) {
    try {
        const response = await axios.get(`https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/src/${branch}/${dirPath}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const files = response.data.values.filter((item: any) => item.type === 'commit_file' && item.path.startsWith(dirPath) && item.path.endsWith('.py'));

        const fileContentsPromises = files.map((file: any) =>
            axios.get(`https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/src/${branch}/${file.path}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'text',
            }).then((res: { data: string }) => ({ path: file.path, content: res.data }))
        );

        const fileContents = await Promise.all(fileContentsPromises);
        return fileContents;
    } catch (error: any) {
        console.error('Error fetching Bitbucket directory content:', error.response?.data || error.message);
        return [];
    }
}
