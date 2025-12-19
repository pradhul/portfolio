import { NextRequest, NextResponse } from 'next/server'
import { translate } from 'google-translate-api-x'
import { getFirestoreInstance } from '@/lib/firebase'
import crypto from 'crypto'

// Helper to create hash of text
function createHash(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex')
}

// Helper to recursively extract all strings from content object
function extractStrings(obj: any, prefix = ''): Array<{ key: string; value: string }> {
  const strings: Array<{ key: string; value: string }> = []
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof value === 'string') {
      strings.push({ key: fullKey, value })
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      strings.push(...extractStrings(value, fullKey))
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'string') {
          strings.push({ key: `${fullKey}.${index}`, value: item })
        } else if (typeof item === 'object' && item !== null) {
          strings.push(...extractStrings(item, `${fullKey}.${index}`))
        }
      })
    }
  }
  
  return strings
}

// Helper to set nested value in object
function setNestedValue(obj: any, path: string, value: string) {
  const keys = path.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    const nextKey = keys[i + 1]
    const isNextArrayIndex = !isNaN(Number(nextKey))
    
    if (!current[key]) {
      current[key] = isNextArrayIndex ? [] : {}
    }
    current = current[key]
  }
  
  const lastKey = keys[keys.length - 1]
  if (!isNaN(Number(lastKey))) {
    if (!Array.isArray(current)) {
      // Convert to array if needed
      const temp = { ...current }
      current.length = 0
      Object.keys(temp).forEach(k => {
        const idx = Number(k)
        if (!isNaN(idx)) {
          current[idx] = temp[k]
        }
      })
    }
    current[Number(lastKey)] = value
  } else {
    current[lastKey] = value
  }
}

// Helper to reconstruct object from translated strings
function reconstructObject(strings: Array<{ key: string; value: string }>, original: any): any {
  // Deep clone the original structure
  const result = JSON.parse(JSON.stringify(original))
  
  // Set translated values
  for (const { key, value } of strings) {
    setNestedValue(result, key, value)
  }
  
  return result
}

export async function POST(request: NextRequest) {
  let content: any
  let targetLanguage: string
  
  try {
    const body = await request.json()
    content = body.content
    targetLanguage = body.targetLanguage

    if (!content || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing content or targetLanguage' },
        { status: 400 }
      )
    }

    // If target is English, return original content
    if (targetLanguage === 'en') {
      return NextResponse.json({ translatedContent: content })
    }

    const db = getFirestoreInstance()
    const contentHash = createHash(JSON.stringify(content))
    const cacheKey = `translatedContent/${contentHash}/${targetLanguage}`

    // Check Firebase cache first
    try {
      const cacheDoc = await db.collection('translatedContent').doc(`${contentHash}_${targetLanguage}`).get()
      
      if (cacheDoc.exists) {
        const cached = cacheDoc.data()
        if (cached && cached.content) {
          return NextResponse.json({ translatedContent: cached.content })
        }
      }
    } catch (error) {
      console.error('Error checking cache:', error)
      // Continue to translation if cache check fails
    }

    // Extract all strings from content
    const strings = extractStrings(content)
    
    // Translate all strings
    const translatedStrings = await Promise.all(
      strings.map(async ({ key, value }) => {
        // Check individual string cache
        const stringHash = createHash(value)
        const stringCacheKey = `translations/${stringHash}/${targetLanguage}`
        
        try {
          const stringCacheDoc = await db.collection('translations').doc(`${stringHash}_${targetLanguage}`).get()
          if (stringCacheDoc.exists) {
            const cached = stringCacheDoc.data()
            if (cached && cached.translatedText) {
              return { key, value: cached.translatedText }
            }
          }
        } catch (error) {
          // Continue to translation
        }

        try {
          // Translate using google-translate-api-x
          const result = await translate(value, { to: targetLanguage })
          const translatedText = result.text

          // Cache the translation
          try {
            await db.collection('translations').doc(`${stringHash}_${targetLanguage}`).set({
              sourceText: value,
              translatedText,
              language: targetLanguage,
              lastUpdated: new Date(),
            })
          } catch (error) {
            console.error('Error caching translation:', error)
          }

          return { key, value: translatedText }
        } catch (error) {
          console.error(`Error translating "${value}":`, error)
          // Return original if translation fails
          return { key, value }
        }
      })
    )

    // Reconstruct translated content object
    let translatedContent
    try {
      translatedContent = reconstructObject(translatedStrings, content)
    } catch (error) {
      console.error('Error reconstructing content:', error)
      // Fallback to original content if reconstruction fails
      translatedContent = content
    }

    // Cache the full translated content
    try {
      await db.collection('translatedContent').doc(`${contentHash}_${targetLanguage}`).set({
        content: translatedContent,
        language: targetLanguage,
        lastUpdated: new Date(),
      })
    } catch (error) {
      console.error('Error caching translated content:', error)
      // Continue even if caching fails
    }

    return NextResponse.json({ translatedContent })
  } catch (error) {
    console.error('Error in translate API:', error)
    // Return original content as fallback if we have it
    if (content) {
      return NextResponse.json({ translatedContent: content })
    }
    return NextResponse.json(
      { error: 'Translation failed', translatedContent: null },
      { status: 500 }
    )
  }
}
