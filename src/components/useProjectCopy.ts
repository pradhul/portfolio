import { useLanguage } from '@/components/LanguageProvider'

export function useProjectCopy(id: string) {
  const { t, tString } = useLanguage()
  const asList = (key: string): string[] => {
    const value = t(key)
    return Array.isArray(value) ? value : []
  }

  const base = `portfolio.${id}`
  return {
    category: tString(`${base}.category`),
    title: tString(`${base}.title`),
    description: tString(`${base}.description`),
    about: asList(`${base}.about`),
    highlights: asList(`${base}.highlights`),
    features: asList(`${base}.features`),
    viewGitHub: tString(`${base}.viewGitHub`),
    viewProject: tString(`${base}.viewProject`),
    liveDemo: tString(`${base}.liveDemo`),
    marketplace: tString(`${base}.marketplace`),
    releaseLabel: tString(`${base}.releaseLabel`),
    overview: tString(`${base}.overview`),
    usageGuide: tString(`${base}.usageGuide`),
    knownLimitations: tString(`${base}.knownLimitations`),
    futurePlans: tString(`${base}.futurePlans`),
    versionLabel: tString(`${base}.versionLabel`),
    vscodeRequirement: tString(`${base}.vscodeRequirement`),
    limitationMerge: tString(`${base}.limitationMerge`),
    aboutLabel: tString('portfolio.labels.about'),
    featuresLabel: tString('portfolio.labels.features'),
    screenshotsLabel: tString('portfolio.labels.screenshots'),
    capabilityTitles: asList(`${base}.capabilityTitles`),
    capabilityBodies: asList(`${base}.capabilityBodies`),
    usageSteps: asList(`${base}.usageSteps`),
    commandLabel: tString(`${base}.commandLabel`),
    commandName: tString(`${base}.commandName`),
    requirementsHeading: tString(`${base}.requirementsHeading`),
    gitRequirement: tString(`${base}.gitRequirement`),
    futureIntro: tString(`${base}.futureIntro`),
    futureUxHeading: tString(`${base}.futureUxHeading`),
    futureUx: asList(`${base}.futureUx`),
    futureTechHeading: tString(`${base}.futureTechHeading`),
    futureTech: asList(`${base}.futureTech`),
    installationHeading: tString(`${base}.installationHeading`),
    installationSteps: asList(`${base}.installationSteps`),
    technicalHeading: tString(`${base}.technicalHeading`),
    technicalIntro: tString(`${base}.technicalIntro`),
    coreFunctionsHeading: tString(`${base}.coreFunctionsHeading`),
    coreFunctionNames: asList(`${base}.coreFunctionNames`),
    coreFunctionDetails: asList(`${base}.coreFunctionDetails`),
    screenshot1Alt: tString(`${base}.screenshot1Alt`),
    screenshot2Alt: tString(`${base}.screenshot2Alt`),
    telegramTitle: tString(`${base}.telegramTitle`),
    telegramIntro: tString(`${base}.telegramIntro`),
    telegramTagCaption: tString(`${base}.telegramTagCaption`),
    telegramDigestCaption: tString(`${base}.telegramDigestCaption`),
    homeScreenTitle: tString(`${base}.homeScreenTitle`),
    homeScreenIntro: tString(`${base}.homeScreenIntro`),
    ordersCaption: tString(`${base}.ordersCaption`),
  }
}
