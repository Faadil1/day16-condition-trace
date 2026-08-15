import { useEffect } from 'react'
import type { RefObject } from 'react'
import { animate, createScope, createTimeline, stagger } from 'animejs'
import type { WorkflowStep } from '../types/evidence'

export function useEditorialMotion(rootRef: RefObject<HTMLElement | null>, step: WorkflowStep) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const scope = createScope({
      root,
      mediaQueries: {
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
    }).add(self => {
      if (self?.matches.reduceMotion) return

      const reveal = (targets: string, y = 14, delay = 0) => {
        animate(targets, {
          opacity: [0, 1],
          y: [y, 0],
          delay,
          duration: 560,
          ease: 'out(3)',
        })
      }

      if (step === 'open') {
        createTimeline({ defaults: { ease: 'out(3)' } })
          .add('.open-stage-hero > *', {
            opacity: [0, 1],
            y: [18, 0],
            duration: 620,
            delay: stagger(70),
          })
          .add('.object-caption', {
            opacity: [0, 1],
            y: [12, 0],
            duration: 520,
          }, '<-=260')
          .add('.step-open .panel-content > *', {
            opacity: [0, 1],
            x: [12, 0],
            duration: 520,
            delay: stagger(42),
          }, '<-=220')
      }

      if (step === 'records') {
        createTimeline({ defaults: { ease: 'out(3)' } })
          .add('.records-stage-header > *', {
            opacity: [0, 1],
            y: [12, 0],
            duration: 480,
            delay: stagger(70),
          })
          .add('.records-stage-rule i', {
            scaleX: [0, 1],
            transformOrigin: 'left center',
            duration: 520,
          }, '<-=220')
          .add('.records-folio', {
            opacity: [0, 1],
            y: [22, 0],
            rotate: [-0.35, 0],
            duration: 620,
            delay: stagger(72),
          }, '<-=260')
          .add('.records-stage-footer > *', {
            opacity: [0, 1],
            y: [8, 0],
            duration: 430,
            delay: stagger(55),
          }, '<-=240')

        reveal('.step-records .selected-record', 10, 180)
      }

      if (step === 'inspect') {
        createTimeline({ defaults: { ease: 'out(3)' } })
          .add('.inspection-mode-card', {
            opacity: [0, 1],
            x: [-12, 0],
            duration: 520,
          })
          .add('.annotation-marker', {
            opacity: [0, 1],
            scale: [0.96, 1],
            duration: 460,
          }, '<+=100')
          .add('.light-console', {
            opacity: [0, 1],
            y: [18, 0],
            duration: 560,
          }, '<-=160')
          .add('.step-inspect .panel-content > *', {
            opacity: [0, 1],
            x: [12, 0],
            duration: 500,
            delay: stagger(38),
          }, '<-=220')
      }

      if (step === 'compare') {
        createTimeline({ defaults: { ease: 'out(3)' } })
          .add('.comparison-frame.prior', {
            opacity: [0, 1],
            x: [-18, 0],
            duration: 600,
          })
          .add('.comparison-frame.current', {
            opacity: [0, 1],
            x: [18, 0],
            duration: 600,
          }, '<+=70')
          .add('.comparison-sync-rail', {
            opacity: [0, 1],
            scaleY: [0.55, 1],
            duration: 460,
          }, '<-=320')
          .add('.comparison-limit, .comparison-finding', {
            opacity: [0, 1],
            y: [12, 0],
            duration: 520,
            delay: stagger(90),
          }, '<-=160')
      }

      if (step === 'finding') {
        createTimeline({ defaults: { ease: 'out(3)' } })
          .add('.step-finding .panel-content > .section-kicker, .step-finding .panel-content > h2, .step-finding .finding-lead', {
            opacity: [0, 1],
            y: [12, 0],
            duration: 500,
            delay: stagger(60),
          })
          .add('.lineage-node', {
            opacity: [0, 1],
            y: [16, 0],
            scale: [0.985, 1],
            duration: 520,
            delay: stagger(95),
          }, '<+=90')
          .add('.finding-verdict', {
            opacity: [0, 1],
            y: [18, 0],
            scale: [0.985, 1],
            duration: 650,
          }, '<+=40')
          .add('.step-finding .primary-action', {
            opacity: [0, 1],
            y: [8, 0],
            duration: 420,
          }, '<-=220')
      }

      if (step === 'record') {
        createTimeline({ defaults: { ease: 'out(3)' } })
          .add('.document-header > *', {
            opacity: [0, 1],
            y: [10, 0],
            duration: 480,
            delay: stagger(55),
          })
          .add('.doc-meta > div', {
            opacity: [0, 1],
            y: [8, 0],
            duration: 430,
            delay: stagger(45),
          }, '<-=170')
          .add('.doc-observation, .finding-copy, .doc-lineage, .records-reviewed, .doc-gap, .document-body > footer', {
            opacity: [0, 1],
            y: [14, 0],
            duration: 520,
            delay: stagger(85),
          }, '<-=100')
          .add('.drawer-actions > *', {
            opacity: [0, 1],
            y: [8, 0],
            duration: 420,
            delay: stagger(70),
          }, '<-=220')
      }
    })

    return () => scope.revert()
  }, [rootRef, step])
}
