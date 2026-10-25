# MedWillow

Your health story, rooted and growing.

MedWillow is a caregiver-first family health product at the concept and prototype stage. The immediate priority is validating an understandable, trustworthy experience with fictional data.

## First deliverable

[Open the Figma Theme Comparison Board](https://www.figma.com/design/wdjOkn0vZNTXSyenPefxAT?node-id=1-261)

Twelve editable designs compare Willow Aura, Modern Iris, and Coastal Vitality. Each direction includes Home and Records in light and dark appearances. The same content, dimensions, spacing and typography are used throughout.

This deliverable is a visual comparison, not a functioning application or clickable end-to-end prototype. No backend, authentication, upload processing, OCR, permission enforcement or sharing service has been implemented.

## Project continuity

- [Original master brief](docs/MASTER_CONTEXT.md)
- [Current decisions and next steps](docs/PROJECT_STATUS.md)
- [Color definitions](design/themes.json)
- [Figma file/session ledger](design/figma-state.json)
- [Foundations ledger](design/foundation-state.json)
- [Screen and component ledger](design/build-state.json)
- [Theme component ledger](design/theme-fix-state.json)
- [Validation](design/validation.json)

The scripts in `design/` record the Figma construction workflow. They execute inside the Figma Plugin API, not directly in Node.js. They depend on this file's recorded node IDs. Do not rerun creation scripts against a populated board; inspect the ledger and update specific nodes instead.

## Working principles

Keep the prototype first. Use fictional records. Treat extraction as unverified until reviewed. Keep adult family access permission-based. Do not make diagnostic claims or invent clinical follow-up schedules. Treat the brand, stack, pricing and launch date as unconfirmed until explicitly decided.
