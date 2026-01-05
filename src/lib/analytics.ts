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
      // Validate event name (Firebase requires alphanumeric + underscore, max 40 chars)
      if (!/^[a-zA-Z0-9_]+$/.test(eventName)) {
        console.error(`[Analytics Debug] Invalid event name: ${eventName} - must be alphanumeric and underscores only`)
        return
      }
      if (eventName.length > 40) {
        console.error(`[Analytics Debug] Event name too long: ${eventName} - max 40 characters`)
        return
      }
      
      // Validate and log parameters
      if (params) {
        const paramKeys = Object.keys(params)
        console.log(`[Analytics Debug] Event ${eventName} parameters:`, paramKeys)
        paramKeys.forEach(key => {
          if (!/^[a-zA-Z0-9_]+$/.test(key)) {
            console.warn(`[Analytics Debug] Invalid parameter name: ${key} - will be ignored by Firebase`)
          }
        })
      }
      
      logEvent(analytics, eventName, params)
      console.log(`[Analytics Debug] ✅ Event ${eventName} logged successfully to Firebase`)
      console.log(`[Analytics Debug] Check Firebase Console → Analytics → Realtime to see this event`)
    } else {
      console.warn(`[Analytics Debug] ❌ Cannot track ${eventName} - Analytics instance is null`)
    }
  } catch (error) {
    console.error(`[Analytics Debug] ❌ Error tracking event ${eventName}:`, error)
    if (error instanceof Error) {
      console.error(`[Analytics Debug] Error details:`, error.message)
      console.error(`[Analytics Debug] Error stack:`, error.stack)
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

