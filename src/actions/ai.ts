"use server";

export interface GenerateDescriptionInput {
  serviceNames: string[];
  location: string;
  notes?: string;
  urgency: "normal" | "urgent";
  packageName?: string;
}

function buildTemplateDescription(input: GenerateDescriptionInput): string {
  const services =
    input.serviceNames.length > 0
      ? input.serviceNames.join(", ")
      : "engineering services";
  const location = input.location.trim() || "the project site";
  const urgencyLine =
    input.urgency === "urgent"
      ? "This is an urgent request and timely delivery is essential."
      : "Standard delivery timelines apply.";

  const scopeIntro = input.packageName
    ? `We are requesting ${input.packageName} services covering ${services}.`
    : `We are requesting the following engineering services: ${services}.`;

  const notesBlock = input.notes?.trim()
    ? `\n\nAdditional requirements:\n${input.notes.trim()}`
    : "";

  return `${scopeIntro}

Project location: ${location}.

${urgencyLine}

We seek a licensed engineering office to deliver complete scope documentation, coordinate with relevant authorities where required, and provide clear milestones for review and approval.${notesBlock}

Please include your proposed timeline, deliverables, and payment terms in your quotation.`;
}

async function generateWithOpenAI(input: GenerateDescriptionInput): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const services = input.serviceNames.join(", ") || "engineering services";
  const prompt = `Write a professional project request description for a Saudi engineering marketplace.
Services: ${services}
Location: ${input.location || "not specified"}
Urgency: ${input.urgency}
${input.packageName ? `Package: ${input.packageName}` : ""}
Client notes: ${input.notes || "none"}

Write 2-3 concise paragraphs covering scope, location context, and expectations. Do not include pricing.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You write clear, professional engineering project request descriptions for clients in Saudi Arabia.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    return content || null;
  } catch {
    return null;
  }
}

export async function generateRequestDescription(
  input: GenerateDescriptionInput
): Promise<{ description: string; source: "ai" | "template" }> {
  const aiResult = await generateWithOpenAI(input);
  if (aiResult) {
    return { description: aiResult, source: "ai" };
  }
  return { description: buildTemplateDescription(input), source: "template" };
}

export interface GenerateScopeInput {
  requestTitle: string;
  requestDescription?: string;
  serviceNames: string[];
  location: string;
  packageName?: string;
  agencyName?: string;
}

function buildTemplateScope(input: GenerateScopeInput): string {
  const services =
    input.serviceNames.length > 0
      ? input.serviceNames.join(", ")
      : "the requested engineering services";
  const location = input.location.trim() || "the project location";
  const office = input.agencyName?.trim() || "Our engineering office";

  return `${office} proposes to deliver ${services} for "${input.requestTitle}" at ${location}.

Scope includes site review, technical coordination, preparation of required documentation, authority submissions where applicable, and structured client review cycles for each deliverable stage.

${input.requestDescription?.trim() ? `Client requirements summary:\n${input.requestDescription.trim()}\n\n` : ""}We will align deliverables, milestones, and payment stages with the project schedule and Saudi Building Code requirements.`;
}

async function generateScopeWithOpenAI(input: GenerateScopeInput): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const prompt = `Write a professional "Scope of Work" section for an engineering office quotation in Saudi Arabia.
Project: ${input.requestTitle}
Location: ${input.location}
Services: ${input.serviceNames.join(", ") || "engineering services"}
${input.packageName ? `Package: ${input.packageName}` : ""}
Client request notes: ${input.requestDescription || "none"}
Office: ${input.agencyName || "Engineering office"}

Write 2-3 paragraphs covering methodology, deliverables approach, coordination, and compliance. Do not include pricing or payment terms.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You write precise engineering scope-of-work sections for licensed offices in Saudi Arabia.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!response.ok) return null;
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export async function generateQuotationScope(
  input: GenerateScopeInput
): Promise<{ scope: string; source: "ai" | "template" }> {
  const aiResult = await generateScopeWithOpenAI(input);
  if (aiResult) return { scope: aiResult, source: "ai" };
  return { scope: buildTemplateScope(input), source: "template" };
}
