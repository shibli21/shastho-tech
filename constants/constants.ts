
import { LabTest, HealthPackage } from './types';

export const LAB_TESTS: LabTest[] = [
  { id: '1', name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 450, description: 'Evaluation of overall health and detection of disorders like anemia.', turnaroundTime: '24 Hours' },
  { id: '2', name: 'HbA1c', category: 'Diabetic', price: 800, description: 'Measures average blood sugar levels over the past 3 months.', turnaroundTime: '24 Hours' },
  { id: '3', name: 'Lipid Profile', category: 'Cardiac', price: 1200, description: 'Checks cholesterol levels to assess risk of cardiovascular disease.', turnaroundTime: '24 Hours' },
  { id: '4', name: 'Liver Function Test (LFT)', category: 'Biochemistry', price: 1500, description: 'Tests for liver enzymes, proteins, and bilirubin.', turnaroundTime: '24 Hours' },
  { id: '5', name: 'Thyroid Panel (T3, T4, TSH)', category: 'Hormone', price: 1800, description: 'Evaluates how well your thyroid gland is working.', turnaroundTime: '24 Hours' },
  { id: '6', name: 'Vitamin D (25-OH)', category: 'Vitamins', price: 2500, description: 'Assesses vitamin D levels for bone and immune health.', turnaroundTime: '48 Hours' },
  { id: '7', name: 'Creatinine (Serum)', category: 'Kidney', price: 400, description: 'Basic screening for kidney function.', turnaroundTime: '24 Hours' },
];

export const HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: 'p1',
    name: 'Basic Wellness Check',
    price: 3500,
    discountPrice: 2499,
    testsCount: 25,
    testList: ['CBC', 'Blood Sugar', 'Urine R/E', 'Creatinine', 'SGPT'],
    recommendedFor: 'Routine checkups for adults',
    isPopular: false
  },
  {
    id: 'p2',
    name: 'Executive Health Screening',
    price: 8500,
    discountPrice: 5999,
    testsCount: 65,
    testList: ['Lipid Profile', 'LFT', 'Thyroid Panel', 'HbA1c', 'Vitamin B12', 'ECG'],
    recommendedFor: 'Comprehensive review for age 35+',
    isPopular: true
  },
  {
    id: 'p3',
    name: 'Cardiac Risk Profile',
    price: 6000,
    discountPrice: 4500,
    testsCount: 15,
    testList: ['High Sensitivity CRP', 'Lipid Profile', 'Lp(a)', 'Homocysteine'],
    recommendedFor: 'Individuals with history of heart issues',
    isPopular: false
  }
];

export const SERVICE_AREAS = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Gazipur', 'Narayanganj'
];
