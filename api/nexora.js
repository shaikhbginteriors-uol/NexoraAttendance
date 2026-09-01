const ALLOWED_ACTIONS = new Set([
  "teachers",
  "classes",
  "batches",
  "sessions",
  "slots",
  "lookupStudent",
  "verifyEnrollment",
  "submitAttendance",
]);

export default async function handler(req, res) {
  // Simple health test
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      service: "NEXORA Vercel API Proxy",
      configured: Boolean(
        process.env.NEXORA_APPS_SCRIPT_URL &&
        process.env.NEXORA_PORTAL_API_KEY
      ),
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed",
    });
  }

  try {
    const appsScriptUrl =
      process.env.NEXORA_APPS_SCRIPT_URL;

    const apiKey =
      process.env.NEXORA_PORTAL_API_KEY;

    if (!appsScriptUrl) {
      throw new Error(
        "NEXORA_APPS_SCRIPT_URL is not configured."
      );
    }

    if (!apiKey) {
      throw new Error(
        "NEXORA_PORTAL_API_KEY is not configured."
      );
    }

    let body = req.body || {};

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const action =
      String(body.action || "").trim();

    const payload =
      body.payload &&
      typeof body.payload === "object"
        ? body.payload
        : {};

    if (!ALLOWED_ACTIONS.has(action)) {
      return res.status(400).json({
        ok: false,
        error: "Invalid API action.",
      });
    }

    const googleResponse = await fetch(
      appsScriptUrl,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          apiKey: apiKey,
          action: action,
          payload: payload,
        }),

        redirect: "follow",
      }
    );

    const responseText =
      await googleResponse.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch (error) {
      throw new Error(
        "Google Apps Script returned an invalid response."
      );
    }

    return res
      .status(googleResponse.ok ? 200 : 502)
      .json(data);

  } catch (error) {
    console.error(
      "NEXORA API Proxy Error:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Internal server error",
    });
  }
}
