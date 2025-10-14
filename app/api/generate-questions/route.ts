// app/api/generate-questions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface GenerationRequest {
  subject: string
  topic: string
  subTopic?: string
  className: string
  numberOfQuestions: number
  difficulty: 'easy' | 'medium' | 'hard'
  questionType: 'factual' | 'conceptual' | 'analytical' | 'mixed'
}

interface MCQQuestion {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: 'A' | 'B' | 'C' | 'D'
}

// ⏱️ Timeout constant (30 seconds)
const TIMEOUT_SECONDS = 30

// config
const API_KEY_1 = process.env.GEMINI_API_KEY
const API_KEY_2 = process.env.GEMINI_API_KEY_2
const MODEL_1 = 'gemini-2.5-flash'
const MODEL_2 = 'gemini-2.5-flash'

// Timeout wrapper function
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, apiName: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`⏰ Timeout: ${apiName} exceeded ${timeoutMs / 1000}s`)), timeoutMs)
    )
  ])
}

// Try to generate with a specific API
async function tryGenerate(apiKey: string, model: string, prompt: string, apiName: string) {
  console.log(`🔄 Trying ${apiName} with model ${model}...`)
  
  const genAI = new GoogleGenerativeAI(apiKey)
  const modelInstance = genAI.getGenerativeModel({ model })
  
  const result = await withTimeout(
    modelInstance.generateContent(prompt),
    TIMEOUT_SECONDS * 1000,
    apiName
  )
  
  const response = await result.response
  const text = response.text()
  
  console.log(`✅ Success with ${apiName}!`)
  
  return { text, apiUsed: apiName, modelUsed: model }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json()
    
    const { 
      subject, 
      topic, 
      subTopic, 
      className, 
      numberOfQuestions, 
      difficulty, 
      questionType 
    } = body

    // Validate required fields
    if (!subject || !topic || !className || !numberOfQuestions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prompt engineering
    const prompt = `
Create ${numberOfQuestions} multiple choice questions (MCQ) for the following specifications:

Subject: ${subject}
Topic: ${topic}
${subTopic ? `Sub-topic: ${subTopic}` : ''}
Class/Level: ${className}
Difficulty: ${difficulty}
Question Type: ${questionType}

Requirements:
1. Each question should have exactly 4 options (A, B, C, D)
2. Only one option should be correct
3. Questions should be appropriate for ${className} level
4. Difficulty should be ${difficulty}
5. Questions should be ${questionType === 'mixed' ? 'a mix of factual, conceptual, and analytical' : questionType}
6. Options should be plausible and not obviously wrong
7. Questions should be clear and unambiguous

Format your response as a valid JSON array with the following structure:
[
  {
    "question": "Question text here?",
    "optionA": "First option",
    "optionB": "Second option", 
    "optionC": "Third option",
    "optionD": "Fourth option",
    "correctOption": "A"
  }
]

Important: 
- Return ONLY the JSON array, no additional text before or after
- Ensure the JSON is properly formatted
- Make sure correctOption is one of: "A", "B", "C", or "D"
- Each question should be educational and test understanding of ${topic}
`

    console.log(`🚀 Starting question generation with ${TIMEOUT_SECONDS}s timeout per API...`)

    let text: string = ''
    let apiUsed: string = ''
    let modelUsed: string = ''
    let success = false

    
    // Try API 1
    if (API_KEY_1) {
      try {
        const result = await tryGenerate(API_KEY_1, MODEL_1, prompt, 'API_1')
        text = result.text
        apiUsed = result.apiUsed
        modelUsed = result.modelUsed
        success = true
      } catch (error) {
        console.log(`❌ API_1 failed: ${error instanceof Error ? error.message : error}`)
        
        // Try API 2
        if (API_KEY_2) {
          try {
            const result = await tryGenerate(API_KEY_2, MODEL_2, prompt, 'API_2')
            text = result.text
            apiUsed = result.apiUsed
            modelUsed = result.modelUsed
            success = true
          } catch (error) {
            console.log(`❌ API_2 failed: ${error instanceof Error ? error.message : error}`)
            throw new Error('Both API_1 and API_2 failed or timed out')
          }
        } else {
          throw new Error('API_1 failed and API_2 not configured')
        }
      }
    } else {
      return NextResponse.json(
        { error: 'No API keys configured. Please add GEMINI_API_KEY to .env' },
        { status: 500 }
      )
    }


    // Check if any API succeeded
    if (!success || !text) {
      return NextResponse.json(
        { error: 'All APIs failed or timed out. Please check your API keys and try again.' },
        { status: 500 }
      )
    }

    let questions: MCQQuestion[]
    try {
      // Remove markdown code blocks if present
      let cleanedText = text.trim()
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\n?/, '').replace(/```\s*$/, '')
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```\n?/, '').replace(/```\s*$/, '')
      }

      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        console.error('📦 Raw response:', text)
        throw new Error('No JSON array found in response')
      }

      questions = JSON.parse(jsonMatch[0])

      // Validate and clean questions
      questions = questions.map((q, index) => {
        if (!q.question || !q.optionA || !q.optionB || !q.optionC || !q.optionD || !q.correctOption) {
          throw new Error(`Invalid question structure at index ${index}`)
        }

        if (!['A', 'B', 'C', 'D'].includes(q.correctOption)) {
          throw new Error(`Invalid correctOption at index ${index}: ${q.correctOption}`)
        }

        return {
          question: q.question.trim(),
          optionA: q.optionA.trim(),
          optionB: q.optionB.trim(),
          optionC: q.optionC.trim(),
          optionD: q.optionD.trim(),
          correctOption: q.correctOption as 'A' | 'B' | 'C' | 'D'
        }
      })

    } catch (parseError) {
      console.error('❌ Failed to parse Gemini response:', parseError)
      console.error('📦 Raw response:', text)

      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      )
    }

    if (questions.length !== numberOfQuestions) {
      console.warn(`⚠️ Expected ${numberOfQuestions} questions, got ${questions.length}`)
    }

    console.log(`✨ Successfully generated ${questions.length} questions using ${apiUsed}`)

    return NextResponse.json({
      success: true,
      questions,
      metadata: {
        subject,
        topic,
        subTopic,
        className,
        difficulty,
        questionType,
        generatedCount: questions.length,
        apiUsed: apiUsed,
        modelUsed: modelUsed
      }
    })

  } catch (error) {
    console.error('💥 Error generating questions:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate questions. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
