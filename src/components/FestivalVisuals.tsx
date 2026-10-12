'use client'

import type { FestivalConfig } from '@/lib/festivalConfig'
import {
  SnowEffect,
  ConfettiEffect,
  PetalsEffect,
  LightsEffect,
  FireworksEffect,
  ColorPowderEffect,
} from './FestivalEffects'
import { Snowman, GroundSnow } from './FestivalDecorations'

export default function FestivalVisuals({ festival }: { festival: FestivalConfig }) {
  return (
    <>
      {festival.effects.map((effect, index) => {
        switch (effect.type) {
          case 'snow':
            return <SnowEffect key={index} enabled intensity={effect.intensity || 'high'} />
          case 'confetti':
            return (
              <ConfettiEffect
                key={index}
                enabled
                intensity={effect.intensity || 'high'}
                colors={[
                  festival.colors.primary,
                  festival.colors.secondary,
                  festival.colors.accent,
                  festival.colors.tertiary,
                  festival.colors.quaternary,
                ].filter(Boolean) as string[]}
              />
            )
          case 'petals':
            return (
              <PetalsEffect
                key={index}
                enabled
                intensity={effect.intensity || 'high'}
                colors={[festival.colors.primary, festival.colors.secondary, festival.colors.accent]}
              />
            )
          case 'lights':
            return (
              <LightsEffect
                key={index}
                enabled
                intensity={effect.intensity || 'medium'}
                colors={[festival.colors.primary, festival.colors.secondary, festival.colors.accent]}
              />
            )
          case 'fireworks':
            return <FireworksEffect key={index} enabled intensity={effect.intensity || 'high'} />
          case 'colorPowder':
            return (
              <ColorPowderEffect
                key={index}
                enabled
                intensity={effect.intensity || 'high'}
                colors={[
                  festival.colors.primary,
                  festival.colors.secondary,
                  festival.colors.accent,
                  festival.colors.tertiary,
                  festival.colors.quaternary,
                ].filter(Boolean) as string[]}
              />
            )
          default:
            return null
        }
      })}
      {festival.id === 'christmas' && (
        <>
          <Snowman />
          <GroundSnow />
        </>
      )}
    </>
  )
}
