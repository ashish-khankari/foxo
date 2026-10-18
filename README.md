# FOXO (demo)

A small React Native + TypeScript app that makes lab results easier to understand,
and helps a patient walk into a doctor's appointment knowing what to ask.

> **Independent demo.** Built as a personal project, not affiliated with any company.
> All data is made up. **Not medical advice.**

**Demo video:** [Watch the walkthrough on Loom](https://www.loom.com/share/f7a4e80eb8d24994ad4c947552d04818)

## The problem

Lab reports are lists of numbers. Patients who test regularly are left asking:

- Is this value fine, or should I worry?
- Is it getting better or worse over time?
- When did it first go out of range?
- What should I actually ask my doctor?

## What the app does

| Feature | What the user sees |
| --- | --- |
| **Status at a glance** | Each result has a coloured dot: green = normal, yellow = keep an eye on it, red = needs attention. A trend arrow (↑ ↓ →) shows direction. |
| **Filter sheet** | A filter icon opens a bottom sheet to filter by **category** (Metabolic, Heart, Nutrients, Other) and **complexity** (Basic, Intermediate, Advanced). The icon shows a dot and a summary line when filters are active. |
| **History chart** | Tap a result to see past values as bars. Readings outside the usual range are coloured. |
| **Plain-language insight** | A one-line trend summary ("Your HbA1c has been rising over 4 tests"), what the marker means, and when it first left its usual range. |
| **Questions for your doctor** | Each result has numbered, tailored questions based on its value and trend, with a button to share them. |
| **Flag for doctor** | Flag any result. Flags are saved on the device, shared across screens and work offline. |

## Run it

Requirements: Node >= 22.11, the React Native [Android/iOS environment setup](https://reactnative.dev/docs/set-up-your-development-environment), and a device or emulator.

```bash
npm install
npm start            # Metro bundler
npm run android      # or: npm run ios
```

Checks:

```bash
npm test             # unit tests
npx tsc --noEmit     # type check
npm run lint
```

## Project structure

```
App.tsx                      Navigation (List -> Detail), dark theme
src/
  data.ts                    Sample biomarkers and test dates
  types.ts                   Biomarker, Status, Complexity, route types
  theme.ts                   Colours and font names
  utils.ts                   Trend, range and question logic (unit tested)
  useFlags.ts                Flag store: shared in memory + AsyncStorage
  screens/
    ListScreen.tsx           Results list, filter icon and bottom sheet
    DetailScreen.tsx         Chart, insight, questions, flag button
  __tests__/utils.test.ts    Unit tests for the logic
```

## How it works

**Trend** (`getTrend`): compares the first and last reading. A change under 3% counts as steady.

**Range parsing** (`parseRange`, `rangeState`): understands `4.0-5.6`, `<100` and `>40`, so each reading can be classified as low, in range or high. `outOfRangeSince` finds the first reading where a result left range and stayed out.

**Questions** (`doctorQuestions`, `questionsFor`): results that need attention get questions that include the latest value, the usual range and the trend. Normal results get one general question. `buildSummary` combines questions for several results into one message.

**Flags** (`useFlags`): a tiny in-memory store with subscribers, so flagging on the detail screen updates the star on the list screen immediately. It is persisted with AsyncStorage and falls back to empty if storage fails.

## Decisions

- **No backend or login.** The point is the experience, not infrastructure.
- **Charts built with Views.** Avoids adding a chart dependency for four bars.
- **Filter icon drawn with Views.** No icon-library dependency.
- **Offline first.** Flags live on the device.
- **Logic is separate from UI.** Everything testable is in `src/utils.ts`.
- **Accessibility basics.** Buttons have roles and labels, and the chart has a text description of its values.

## Known limitations

- Status (normal / watch / high) is hard-coded in the sample data rather than derived from the range.
- The fonts named in `src/theme.ts` (Cormorant Garamond, Outfit) are not bundled yet, so the app falls back to system fonts.
- No real chart library, reference-range bands or dark/light toggle.
- Sample data only. There is no lab report upload or parsing yet.

## Next, with more time

- Bundle the custom fonts on Android and iOS
- Derive status from the reference range and the user's age and sex
- Reference-range bands on the chart, using a real chart library
- Upload or scan a lab report (PDF or photo) and parse it
- Accessibility audit and localisation (Marathi/Hindi)
- Android + iOS builds for easy sharing

## Tech

React Native 0.88, React 19, TypeScript, React Navigation (native stack), AsyncStorage, Jest.

## Author

Ashish Khankari, React Native engineer.
