import type { APIRoute } from "astro"

export const POST: APIRoute = async ({ request }) => {
  try {
    const { repo, accessToken, webhookUrl } = await request.json()

    if (!repo || !accessToken || !webhookUrl) {
      return new Response(
        JSON.stringify({ error: "Missing repo, accessToken, or webhookUrl" }),
        { status: 400 },
      )
    }

    const response = await createGitHubWebhook(repo, accessToken, webhookUrl)

    if (response.status === 201) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Webhook created successfully.",
        }),
        { status: 201 },
      )
    } else {
      const error = await response.json()
      return new Response(JSON.stringify({ success: false, error }), {
        status: response.status,
      })
    }
  } catch (error) {
    console.error("Error creating webhook:", error)
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500 },
    )
  }
}

async function createGitHubWebhook(
  repo: string,
  accessToken: string,
  webhookUrl: string,
) {
  const response = await fetch(`https://api.github.com/repos/${repo}/hooks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "web",
      active: true,
      events: ["push"], 
      config: {
        url: webhookUrl, 
        content_type: "json",
        insecure_ssl: "0",
      },
    }),
  })

  return response
}
