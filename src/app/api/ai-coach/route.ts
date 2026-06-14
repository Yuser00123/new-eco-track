import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
  type: z.enum(['recommendations', 'challenge', 'progress', 'motivation']),
  carbonScore: z
    .object({
      breakdown: z.object({
        transport: z.number(),
        energy: z.number(),
        diet: z.number(),
        shopping: z.number(),
        total: z.number(),
      }),
      percentileVsNational: z.number(),
    })
    .nullable()
    .optional(),
  xp: z.number().optional(),
  streak: z.number().optional(),
  completedActions: z.number().optional(),
  totalCO2Saved: z.number().optional(),
  topCategory: z.string().optional(),
});

function buildPrompt(data: z.infer<typeof RequestSchema>): string {
  const { type, carbonScore, xp, streak, completedActions, totalCO2Saved, topCategory } = data;

  const scoreContext = carbonScore
    ? `Carbon footprint: ${(carbonScore.breakdown.total / 1000).toFixed(1)} tons/year. Breakdown: Transport ${(carbonScore.breakdown.transport / 1000).toFixed(1)}t, Energy ${(carbonScore.breakdown.energy / 1000).toFixed(1)}t, Diet ${(carbonScore.breakdown.diet / 1000).toFixed(1)}t, Shopping ${(carbonScore.breakdown.shopping / 1000).toFixed(1)}t. ${carbonScore.percentileVsNational > 0 ? `${carbonScore.percentileVsNational}% below national average (good!)` : `${Math.abs(carbonScore.percentileVsNational)}% above national average`}.`
    : 'Carbon footprint not yet calculated.';

  const userContext = `User stats: ${xp ?? 0} XP, ${streak ?? 0}-day streak, ${completedActions ?? 0} actions completed, ${(totalCO2Saved ?? 0).toFixed(1)}kg CO₂ saved. Highest emission category: ${topCategory ?? 'unknown'}.`;

  const prompts: Record<string, string> = {
    recommendations: `You are EcoCoach, an AI sustainability advisor. ${scoreContext} ${userContext}

Generate 3 highly personalized, actionable sustainability recommendations. Focus on the user's highest emission category. Be specific, encouraging, and practical. Each recommendation should include a realistic CO₂ saving estimate.

Respond in JSON format:
{
  "insights": [
    { "title": "Brief title", "content": "2-3 sentence actionable tip with CO₂ saving", "category": "transport|energy|diet|shopping", "co2Impact": "X kg/year" },
    ...
  ]
}`,

    challenge: `You are EcoCoach. ${scoreContext} ${userContext}

Create 1 personalized weekly eco-challenge that is achievable but impactful. Make it specific, fun, and motivating.

Respond in JSON format:
{
  "challenge": {
    "title": "Challenge name",
    "content": "Detailed description of the challenge and how to complete it (2-3 sentences)",
    "category": "transport|energy|diet|shopping",
    "co2Impact": "X kg savings",
    "tips": ["tip 1", "tip 2"]
  }
}`,

    progress: `You are EcoCoach. ${scoreContext} ${userContext}

Write a personalized progress report for this user. Celebrate their achievements, acknowledge their streak, and provide forward-looking motivation.

Respond in JSON format:
{
  "report": {
    "title": "Weekly Progress Report",
    "content": "3-4 sentence personalized summary of achievements and progress",
    "highlight": "One key achievement to celebrate",
    "nextGoal": "One specific next goal to work toward"
  }
}`,

    motivation: `You are EcoCoach. ${scoreContext} ${userContext}

Write a short, powerful motivational message about sustainability and this user's journey. Connect their actions to real-world impact.

Respond in JSON format:
{
  "motivation": {
    "message": "2-3 sentence motivational message",
    "impact": "Real-world equivalent of their CO₂ saved (e.g., X trees planted, X car miles offset)",
    "quote": "An inspiring sustainability quote"
  }
}`,
  };

  return prompts[type] ?? prompts['motivation'];
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (limit.count >= 10) return false;

  limit.count++;
  return true;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait a moment.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request data', details: parsed.error.issues },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return mock response if no API key
    return NextResponse.json(getMockResponse(parsed.data.type));
  }

  try {
    const prompt = buildPrompt(parsed.data);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(getMockResponse(parsed.data.type));
    }

    const geminiData = await response.json() as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(getMockResponse(parsed.data.type));
    }

    const aiResponse = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    return NextResponse.json({ success: true, data: aiResponse, source: 'gemini' });
  } catch {
    return NextResponse.json(getMockResponse(parsed.data.type));
  }
}

function getMockResponse(type: string): Record<string, unknown> {
  const mocks: Record<string, Record<string, unknown>> = {
    recommendations: {
      success: true,
      source: 'mock',
      data: {
        insights: [
          {
            title: 'Switch to Public Transport',
            content: 'Replacing just 2 car trips per week with public transport could save up to 500kg of CO₂ annually. Try using buses or trains for your regular commute routes.',
            category: 'transport',
            co2Impact: '500 kg/year',
          },
          {
            title: 'Embrace Plant-Based Meals',
            content: 'Adopting 3 plant-based days per week can cut your diet emissions by up to 30%. Start with Meatless Monday and expand from there.',
            category: 'diet',
            co2Impact: '350 kg/year',
          },
          {
            title: 'Switch to LED Lighting',
            content: 'Replacing all incandescent bulbs with LEDs reduces lighting energy use by 75%. It takes just 30 minutes and saves money on electricity bills too.',
            category: 'energy',
            co2Impact: '40 kg/year',
          },
        ],
      },
    },
    challenge: {
      success: true,
      source: 'mock',
      data: {
        challenge: {
          title: '🥦 Plant-Based Power Week',
          content: 'This week, commit to eating plant-based meals for breakfast and lunch every day. Explore new recipes and discover how delicious eco-friendly eating can be!',
          category: 'diet',
          co2Impact: '15 kg savings',
          tips: ['Try overnight oats for breakfast', 'Explore lentil soups and chickpea curries for lunch'],
        },
      },
    },
    progress: {
      success: true,
      source: 'mock',
      data: {
        report: {
          title: 'Your Weekly Progress Report',
          content: 'You\'re making incredible progress on your sustainability journey! Every eco action you complete brings us closer to a healthier planet.',
          highlight: 'You\'ve been consistently taking eco actions and building great sustainable habits!',
          nextGoal: 'Try completing 3 more eco actions this week to unlock your next badge',
        },
      },
    },
    motivation: {
      success: true,
      source: 'mock',
      data: {
        motivation: {
          message: 'Every small action you take ripples outward, inspiring others and collectively making a massive difference. Your commitment to sustainability is literally changing the world.',
          impact: 'The CO₂ you\'ve saved is equivalent to planting several trees that will grow for decades.',
          quote: '"We do not inherit the earth from our ancestors; we borrow it from our children." — Native American Proverb',
        },
      },
    },
  };

  return mocks[type] ?? mocks['motivation'];
}
