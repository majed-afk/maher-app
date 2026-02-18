import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { openai } from "@/lib/openai";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Types ────────────────────────────────────────────────
interface QuizOption {
  ar: string;
  en: string;
}

interface QuizQuestion {
  id: string;
  questionAr: string;
  questionEn: string;
  options: QuizOption[];
  correctIndex: number;
  explanation?: { ar: string; en: string };
}

interface Flashcard {
  id: string;
  frontAr: string;
  frontEn: string;
  backAr: string;
  backEn: string;
  emoji?: string;
}

interface GenerateRequest {
  imageUrl: string;
  ageGroup: "3-6" | "6-9" | "9-12";
  locale?: "ar" | "en";
  type?: "quiz" | "flashcards" | "both";
  parentId?: string;
  childId?: string;
}

// ─── Age-specific prompt config ───────────────────────────
const ageConfig = {
  "3-6": {
    questionCount: 5,
    flashcardCount: 5,
    difficulty: "بسيطة جداً وسهلة",
    difficultyEn: "very simple and easy",
    style: "استخدم كلمات بسيطة وجمل قصيرة مع رموز تعبيرية",
    styleEn: "use simple words, short sentences, and emojis",
  },
  "6-9": {
    questionCount: 7,
    flashcardCount: 6,
    difficulty: "متوسطة الصعوبة",
    difficultyEn: "moderate difficulty",
    style: "استخدم لغة واضحة مع شرح بسيط",
    styleEn: "use clear language with simple explanations",
  },
  "9-12": {
    questionCount: 10,
    flashcardCount: 8,
    difficulty: "متقدمة قليلاً",
    difficultyEn: "slightly advanced",
    style: "استخدم مصطلحات علمية مبسطة مع تفسيرات",
    styleEn: "use simplified scientific terms with explanations",
  },
};

// ─── Build the AI prompt ──────────────────────────────────
function buildPrompt(ageGroup: "3-6" | "6-9" | "9-12", type: string) {
  const config = ageConfig[ageGroup];

  const quizSchema = `{
  "id": "q1",
  "questionAr": "السؤال بالعربي",
  "questionEn": "Question in English",
  "options": [
    { "ar": "الخيار ١", "en": "Option 1" },
    { "ar": "الخيار ٢", "en": "Option 2" },
    { "ar": "الخيار ٣", "en": "Option 3" },
    { "ar": "الخيار ٤", "en": "Option 4" }
  ],
  "correctIndex": 0,
  "explanation": { "ar": "شرح الإجابة", "en": "Answer explanation" }
}`;

  const flashcardSchema = `{
  "id": "f1",
  "frontAr": "السؤال أو المفهوم بالعربي",
  "frontEn": "Question or concept in English",
  "backAr": "الإجابة بالعربي",
  "backEn": "Answer in English",
  "emoji": "📚"
}`;

  let prompt = `أنت معلم متخصص في إنشاء محتوى تعليمي للأطفال من عمر ${ageGroup} سنوات.

انظر لهذه الصورة من كتاب مدرسي وقم بتحليل المحتوى بعناية.

القواعد المهمة:
- الصعوبة: ${config.difficulty}
- ${config.style}
- كل المحتوى يجب أن يكون باللغتين العربية والإنجليزية
- الأسئلة يجب أن تكون مبنية على محتوى الصورة فقط
- تدرج في الصعوبة من السهل للصعب
- أضف شرح بسيط لكل إجابة صحيحة

`;

  if (type === "quiz" || type === "both") {
    prompt += `أنشئ ${config.questionCount} أسئلة اختيار من متعدد (4 خيارات لكل سؤال).
كل سؤال بهذا الشكل:
${quizSchema}

`;
  }

  if (type === "flashcards" || type === "both") {
    prompt += `أنشئ ${config.flashcardCount} بطاقات تعليمية.
كل بطاقة بهذا الشكل:
${flashcardSchema}

`;
  }

  prompt += `أرجع النتيجة كـ JSON بهذا التنسيق:
{
  "quiz": [... مصفوفة الأسئلة ...],
  "flashcards": [... مصفوفة البطاقات ...],
  "topicAr": "عنوان الموضوع بالعربي",
  "topicEn": "Topic title in English"
}

مهم: أرجع JSON صالح فقط بدون أي نص إضافي.`;

  return prompt;
}

// ─── POST /api/ai/generate ────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const {
      imageUrl,
      ageGroup = "6-9",
      type = "both",
      parentId,
      childId,
    } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing imageUrl" },
        { status: 400 }
      );
    }

    // Validate ageGroup
    if (!["3-6", "6-9", "9-12"].includes(ageGroup)) {
      return NextResponse.json(
        { error: "Invalid ageGroup. Must be '3-6', '6-9', or '9-12'" },
        { status: 400 }
      );
    }

    // Create a pending record in DB
    let scanId: string | null = null;
    if (parentId) {
      const { data: scan } = await supabaseAdmin
        .from("textbook_scans")
        .insert({
          parent_id: parentId,
          child_id: childId || null,
          image_url: imageUrl,
          age_group: ageGroup,
          status: "processing",
        })
        .select("id")
        .single();
      scanId = scan?.id || null;
    }

    // Build the prompt
    const prompt = buildPrompt(ageGroup as "3-6" | "6-9" | "9-12", type);

    // Call OpenAI GPT-4o with vision
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: imageUrl, detail: "high" },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 4096,
      temperature: 0.7,
    });

    const rawContent = response.choices[0]?.message?.content || "{}";
    const tokensUsed =
      (response.usage?.prompt_tokens || 0) +
      (response.usage?.completion_tokens || 0);

    // Parse the AI response
    let parsed: {
      quiz?: QuizQuestion[];
      flashcards?: Flashcard[];
      topicAr?: string;
      topicEn?: string;
    };

    try {
      parsed = JSON.parse(rawContent);
    } catch {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    // Validate and ensure IDs
    const quiz = (parsed.quiz || []).map((q, i) => ({
      ...q,
      id: q.id || `q${i + 1}`,
    }));

    const flashcards = (parsed.flashcards || []).map((f, i) => ({
      ...f,
      id: f.id || `f${i + 1}`,
    }));

    // Update the DB record
    if (scanId) {
      await supabaseAdmin
        .from("textbook_scans")
        .update({
          generated_quiz: quiz.length > 0 ? quiz : null,
          generated_flashcards: flashcards.length > 0 ? flashcards : null,
          subject_hint: parsed.topicAr || parsed.topicEn || null,
          ai_model: "gpt-4o",
          tokens_used: tokensUsed,
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", scanId);
    }

    return NextResponse.json({
      quiz,
      flashcards,
      topicAr: parsed.topicAr || "",
      topicEn: parsed.topicEn || "",
      scanId,
      metadata: {
        model: "gpt-4o",
        tokensUsed,
        questionsCount: quiz.length,
        flashcardsCount: flashcards.length,
      },
    });
  } catch (error: unknown) {
    console.error("AI Generation error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate questions";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
