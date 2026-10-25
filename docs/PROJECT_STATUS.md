# Project status · 25 October 2026

## Confirmed working direction

- Product: MedWillow, a caregiver-first family health companion.
- Immediate deliverable: a fair visual theme comparison before expanding the interactive prototype.
- Navigation: Home, Records, Trends, Care, Profile.
- Demonstration content only; no real patient information.
- Prototype first; production architecture and commercial assumptions remain open.

## Completed

Created a separate [Figma Theme Comparison Board](https://www.figma.com/design/wdjOkn0vZNTXSyenPefxAT?node-id=1-261). Existing prototype work was not accessed or overwritten.

- 12 designs: three directions × light/dark × Home/Records.
- Identical Home copy and identical Records copy in all six appearances.
- 390 × 1040 full-content mobile design frames.
- Editable text, vectors, auto-layout frames and component instances; no flattened UI images.
- Inter type styles, spacing/radius variables, semantic color aliases, component sources and screen variants.
- Verification states explicitly labeled Reviewed and Needs review. These describe document verification, not clinical risk.
- Light/dark colors use named semantic token sets in a single-mode collection for Starter compatibility. They are not native Figma mode toggles. System-default selection remains an interaction requirement for the later prototype.

## Validation evidence and limits

The board has 1,341 editable descendants: 569 frames, 400 text nodes, 96 instances and 276 vectors. All text uses Inter. Automated bounds checks detected no overflowing children. All six copies of each view have matching text.

372 text/background combinations within the phone designs were checked, with a minimum measured contrast of approximately 4.76:1. A rendered visual review caught and corrected inherited light-theme component colors and stale badge overrides. The final rendered board was reviewed after correction.

This is not a complete WCAG audit. Screen-reader behavior, keyboard navigation, text scaling, reduced motion and device responsiveness require the interactive prototype and eventual implementation. Search, filtering, uploads, family switching and the five tabs are visual controls at this stage.

## Open decisions

The founder has not selected a palette. Willow Aura is the assistant's initial design preference, not a finalized brand decision. Logo, trademark availability, product stack, pricing, scope of the MVP, regulatory assessment and launch date remain open.

## Next sequence

1. Review all three directions at full scale and select a direction or request refinements.
2. Refine the chosen light/dark pair and define the Light / Dark / System interaction.
3. Prototype the core caregiver journey: choose family member → upload sample report → review extraction → find the original → prepare a visit.
4. Add the remaining journeys, including empty, error, retry, permissions and revocation states.
5. Test comprehension and task completion with caregivers and clinicians before production development.

User research, legal checks, competitor testing, market assumptions and willingness to pay have not yet been independently validated in this workspace.
