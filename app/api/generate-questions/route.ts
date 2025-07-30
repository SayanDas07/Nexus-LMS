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

    // ✅ Check if API key is present
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not set in environment' },
        { status: 500 }
      )
    }

    // ✅ Use gemini-1.5-flash (free and fast)
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

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
- Return ONLY the JSON array, no additional text
- Ensure the JSON is properly formatted
- Make sure correctOption is one of: "A", "B", "C", or "D"
- Each question should be educational and test understanding of ${topic}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    let questions: MCQQuestion[]
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('No JSON array found in response')

      questions = JSON.parse(jsonMatch[0])

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
        generatedCount: questions.length
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
