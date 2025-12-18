import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Resume content
const RESUME_TEXT = `PRADHUL DEV pradhuldev.1990@gmail.com | +91-9986981757
Web and Mobile Developer with 8+ years of experience in developing single page web
applications, mobile applications using Android, web technologies like react, angular and backend
technologies like Java.
WORK EXPERIENCE
HashedIn Technologies. Software Engineering Master May 2015 – June 2023
HashedIn by Deloitte specializes in cloud-native development and high-end software
engineering.
● Led multi-skilled teams of up to 4 developers on mobile and web projects across Android,
React Native, React, and Angular.
● Played a role in architecturing and delivering high-performing, scalable applications on
GCP.
● Improved team efficiency and code quality through code reviews, technical mentoring,
and implementation of development best practices.
● Streamlined development processes by introducing CI/CD pipelines and automated
testing frameworks.
● Mentored and coached junior developers to foster their growth and skill development.
● Liaised with clients and stakeholders to ensure project deliverables met expectations.
● Developed multiple web and mobile applications.(HIway, Sotera, GroupNexus, Buzztime,
KP(Kaiser Permanente)).
● Web: Angular, React, React-redux, JavaScript(ES6), Jquery, REST APIs, HTML5, CSS3, SASS,
Git
● Mobile: React-native , Android native
● Backend: Spring boot, NodeJs
● Other Tools: Git, Firebase, Jenkins, Google analytics, Sentry, RabbitMQ
Brainistic Technologies. Software developer July 2014 – May 2015
Brainistic Technologies is a startup delivering world-class web, mobile & Clout IT services
and SaaS products to businesses.
● Developed Joomla Component for HealEz from scratch using PHP, MySQL.
● Developed QuizByte android app in native Android.
● Web: PHP, Joomla, JavaScript
● Mobile: Android, Cordova
EDUCATION
● B.E, Computer Science, Annamalai University June 2013
● Diploma, Computer Science, Department of Technical Education, Kerala May 2010
OTHER INTERESTS
Football, Video Games, Reading books, Movies`

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json()

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a valid question' },
        { status: 400 }
      )
    }

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set')
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      )
    }

    // Use the resume text directly
    const resumeText = RESUME_TEXT

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey)
    // Using gemini-2.5-flash for free tier (10 RPM, 250 RPD)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Create the prompt with resume context
    const prompt = `You are a helpful assistant answering questions about Pradhul Dev, a web and mobile developer. 

Here is Pradhul's resume information:
${resumeText}

Based ONLY on the information provided in the resume above, answer the following question about Pradhul. If the information is not available in the resume, politely say that you don't have that information. Keep your response concise, friendly, and professional.

Question: ${question.trim()}

Answer:`

    // Generate response
    const result = await model.generateContent(prompt)
    const response = await result.response
    const answer = response.text()

    return NextResponse.json({ answer })
  } catch (error) {
    console.error('Error in chat API:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your configuration.' },
          { status: 500 }
        )
      }
      if (error.message.includes('QUOTA') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'An error occurred while processing your question. Please try again.' },
      { status: 500 }
    )
  }
}
