import { getAnalyticsInstance } from './firebaseClient'
import { logEvent, EventParams } from 'firebase/analytics'

export async function trackEvent(eventName: string, params?: EventParams) {
  try {
    const analytics = await getAnalyticsInstance()
    if (!analytics) return

    if (!/^[a-zA-Z0-9_]+$/.test(eventName) || eventName.length > 40) {
      return
    }

    logEvent(analytics, eventName, params)
  } catch (error) {
    console.error(`Error tracking event ${eventName}:`, error)
  }
}

export async function trackChatQuestion(question: string) {
  const truncatedQuestion = question.length > 100 ? question.substring(0, 100) + '...' : question

  await trackEvent('chat_question', {
    question: truncatedQuestion,
    question_length: question.length,
    timestamp: new Date().toISOString(),
  })
}

export async function trackChatResponse(question: string, success: boolean) {
  const truncatedQuestion = question.length > 100 ? question.substring(0, 100) + '...' : question

  await trackEvent('chat_response', {
    question: truncatedQuestion,
    success,
    timestamp: new Date().toISOString(),
  })
}
