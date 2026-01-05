import { getAnalyticsInstance } from './firebaseClient'
import { logEvent, EventParams } from 'firebase/analytics'

/**
 * Track a custom event in Firebase Analytics
 */
export async function trackEvent(eventName: string, params?: EventParams) {
  console.log(`[Analytics Debug] trackEvent called: ${eventName}`, params)
  try {
    const analytics = await getAnalyticsInstance()
    console.log(`[Analytics Debug] Analytics instance for ${eventName}:`, !!analytics)
    if (analytics) {
      logEvent(analytics, eventName, params)
      console.log(`[Analytics Debug] Event ${eventName} logged successfully`)
    } else {
      console.warn(`[Analytics Debug] Cannot track ${eventName} - Analytics instance is null`)
    }
  } catch (error) {
    console.error(`[Analytics Debug] Error tracking event ${eventName}:`, error)
    if (error instanceof Error) {
      console.error(`[Analytics Debug] Error details:`, error.message)
    }
  }
}

/**
 * Track when a user asks a question in the chat
 */
export async function trackChatQuestion(question: string) {
  // Truncate question if too long (Firebase has limits)
  const truncatedQuestion = question.length > 100 ? question.substring(0, 100) + '...' : question
  
  await trackEvent('chat_question', {
    question: truncatedQuestion,
    question_length: question.length,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track when a chat response is received
 */
export async function trackChatResponse(question: string, success: boolean) {
  const truncatedQuestion = question.length > 100 ? question.substring(0, 100) + '...' : question
  
  await trackEvent('chat_response', {
    question: truncatedQuestion,
    success,
    timestamp: new Date().toISOString(),
  })
}

