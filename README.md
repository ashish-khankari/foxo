# LabSense (demo)

Small React Native + TypeScript demo: lab results made easier to understand.
Sample data is made up. Not medical advice.

## Why this exists
Lab reports are lists of numbers. This demo shows status, trend over time,
when a result first left its usual range, a one-line plain-language
explanation, and a shareable list of questions for a doctor.

## Run
```
npm install
npm start
npm run android   # or: npm run ios
```
Test: `npm test`

## Decisions
- No backend or login: the point is the experience, not infrastructure.
- Bar chart built with Views to avoid a chart dependency.
- Flagged results saved with AsyncStorage so they work offline.
- Logic (trend, questions) lives in `src/utils.ts` and is unit tested.

## Next, with more time
- Android + iOS EAS builds / EAS Update for easy sharing
- Real chart library, reference-range bands
- Accessibility audit, dark mode, localisation (Marathi/Hindi)
