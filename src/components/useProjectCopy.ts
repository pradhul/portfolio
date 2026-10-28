import { useLanguage } from '@/components/LanguageProvider'
import { content } from '@/lib/content'

function hasContentKey(key: string): boolean {
  const parts = key.split('.')
  let value: unknown = content
  for (const part of parts) {
    if (value && typeof value === 'object' && value !== null && part in value) {
      value = (value as Record<string, unknown>)[part]
    } else {
      return false
    }
  }
  return true
}

export function useProjectCopy(id: string) {
  const { t, tString } = useLanguage()
  const asList = (key: string): string[] => {
    if (!hasContentKey(key)) return []
    const value = t(key)
    return Array.isArray(value) ? value : []
  }
  const optionalString = (key: string): string => (hasContentKey(key) ? tString(key) : '')

  const base = `portfolio.${id}`
  return {
    category: optionalString(`${base}.category`),
    title: optionalString(`${base}.title`),
    description: optionalString(`${base}.description`),
    about: asList(`${base}.about`),
    highlights: asList(`${base}.highlights`),
    features: asList(`${base}.features`),
    viewGitHub: optionalString(`${base}.viewGitHub`),
    viewProject: optionalString(`${base}.viewProject`),
    liveDemo: optionalString(`${base}.liveDemo`),
    marketplace: optionalString(`${base}.marketplace`),
    releaseLabel: optionalString(`${base}.releaseLabel`),
    overview: optionalString(`${base}.overview`),
    usageGuide: optionalString(`${base}.usageGuide`),
    knownLimitations: optionalString(`${base}.knownLimitations`),
    futurePlans: optionalString(`${base}.futurePlans`),
    versionLabel: optionalString(`${base}.versionLabel`),
    vscodeRequirement: optionalString(`${base}.vscodeRequirement`),
    limitationMerge: optionalString(`${base}.limitationMerge`),
    aboutLabel: tString('portfolio.labels.about'),
    featuresLabel: tString('portfolio.labels.features'),
    screenshotsLabel: tString('portfolio.labels.screenshots'),
    capabilityTitles: asList(`${base}.capabilityTitles`),
    capabilityBodies: asList(`${base}.capabilityBodies`),
    usageSteps: asList(`${base}.usageSteps`),
    commandLabel: optionalString(`${base}.commandLabel`),
    commandName: optionalString(`${base}.commandName`),
    requirementsHeading: optionalString(`${base}.requirementsHeading`),
    gitRequirement: optionalString(`${base}.gitRequirement`),
    futureIntro: optionalString(`${base}.futureIntro`),
    futureUxHeading: optionalString(`${base}.futureUxHeading`),
    futureUx: asList(`${base}.futureUx`),
    futureTechHeading: optionalString(`${base}.futureTechHeading`),
    futureTech: asList(`${base}.futureTech`),
    installationHeading: optionalString(`${base}.installationHeading`),
    installationSteps: asList(`${base}.installationSteps`),
    technicalHeading: optionalString(`${base}.technicalHeading`),
    technicalIntro: optionalString(`${base}.technicalIntro`),
    coreFunctionsHeading: optionalString(`${base}.coreFunctionsHeading`),
    coreFunctionNames: asList(`${base}.coreFunctionNames`),
    coreFunctionDetails: asList(`${base}.coreFunctionDetails`),
    screenshot1Alt: optionalString(`${base}.screenshot1Alt`),
    screenshot2Alt: optionalString(`${base}.screenshot2Alt`),
    telegramTitle: optionalString(`${base}.telegramTitle`),
    telegramIntro: optionalString(`${base}.telegramIntro`),
    telegramTagCaption: optionalString(`${base}.telegramTagCaption`),
    telegramDigestCaption: optionalString(`${base}.telegramDigestCaption`),
    homeScreenTitle: optionalString(`${base}.homeScreenTitle`),
    homeScreenIntro: optionalString(`${base}.homeScreenIntro`),
    ordersCaption: optionalString(`${base}.ordersCaption`),
  }
}
