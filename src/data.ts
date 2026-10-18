import { Biomarker } from './types';

export const TEST_DATES = ['Oct 25', 'Jan 26', 'Apr 26', 'Jul 26'];

export const BIOMARKERS: Biomarker[] = [
  { id: 'hba1c', name: 'HbA1c', category: 'Metabolic', complexity: 'Basic', unit: '%', range: '4.0-5.6', status: 'high', history: [5.4, 5.6, 5.8, 5.9], meaning: 'Average blood sugar over about 3 months.' },
  { id: 'fglu', name: 'Fasting glucose', category: 'Metabolic', complexity: 'Basic', unit: 'mg/dL', range: '70-99', status: 'watch', history: [92, 96, 101, 104], meaning: 'Blood sugar after not eating overnight.' },
  { id: 'insulin', name: 'Fasting insulin', category: 'Metabolic', complexity: 'Advanced', unit: 'µIU/mL', range: '2-20', status: 'normal', history: [9, 8, 10, 9], meaning: 'Shows how hard the body works to manage sugar.' },
  { id: 'ldl', name: 'LDL cholesterol', category: 'Heart', complexity: 'Basic', unit: 'mg/dL', range: '<100', status: 'watch', history: [104, 112, 118, 121], meaning: 'The "bad" cholesterol linked to heart health.' },
  { id: 'hdl', name: 'HDL cholesterol', category: 'Heart', complexity: 'Basic', unit: 'mg/dL', range: '>40', status: 'normal', history: [48, 50, 51, 52], meaning: 'The "good" cholesterol.' },
  { id: 'trig', name: 'Triglycerides', category: 'Heart', complexity: 'Basic', unit: 'mg/dL', range: '<150', status: 'high', history: [138, 152, 171, 186], meaning: 'A type of fat in the blood.' },
  { id: 'crp', name: 'hs-CRP', category: 'Heart', complexity: 'Advanced', unit: 'mg/L', range: '<1.0', status: 'normal', history: [0.8, 0.7, 0.9, 0.8], meaning: 'A marker of inflammation in the body.' },
  { id: 'vitd', name: 'Vitamin D', category: 'Nutrients', complexity: 'Basic', unit: 'ng/mL', range: '30-100', status: 'watch', history: [32, 28, 24, 21], meaning: 'Supports bones and immunity.' },
  { id: 'b12', name: 'Vitamin B12', category: 'Nutrients', complexity: 'Basic', unit: 'pg/mL', range: '200-900', status: 'normal', history: [340, 355, 360, 372], meaning: 'Needed for nerves and blood cells.' },
  { id: 'ferritin', name: 'Ferritin', category: 'Nutrients', complexity: 'Intermediate', unit: 'ng/mL', range: '30-300', status: 'watch', history: [48, 41, 35, 31], meaning: 'Shows how much iron the body has stored.' },
  { id: 'tsh', name: 'TSH', category: 'Other', complexity: 'Intermediate', unit: 'mIU/L', range: '0.4-4.0', status: 'normal', history: [2.1, 2.0, 2.2, 2.1], meaning: 'Shows how well the thyroid is working.' },
  { id: 'creat', name: 'Creatinine', category: 'Other', complexity: 'Intermediate', unit: 'mg/dL', range: '0.7-1.3', status: 'normal', history: [0.9, 0.9, 1.0, 0.9], meaning: 'A waste product that shows kidney function.' },
];