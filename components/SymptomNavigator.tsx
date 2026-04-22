'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Heart, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface Symptom {
  id: string;
  name: string;
  icon: string;
}

interface Condition {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  riskFactors: string[];
  treatmentOptions: string[];
}

interface SymptomToConditionMap {
  [symptomId: string]: string[];
}

const SYMPTOMS: Symptom[] = [
  { id: 'leg-swelling', name: 'Leg Swelling', icon: '🦵' },
  { id: 'pain-discomfort', name: 'Pain/Discomfort', icon: '⚡' },
  { id: 'skin-changes', name: 'Skin Changes', icon: '🔴' },
  { id: 'heaviness', name: 'Heaviness', icon: '⬇️' },
  { id: 'other', name: 'Other Symptoms', icon: '❓' },
];

const CONDITIONS: { [key: string]: Condition } = {
  dvt: {
    id: 'dvt',
    name: 'Deep Vein Thrombosis (DVT)',
    description: 'A blood clot that forms in a deep vein, usually in the legs. DVT can be serious if the clot breaks loose and travels to the lungs.',
    symptoms: ['Swelling in one leg', 'Pain or tenderness', 'Warmth in the affected area', 'Redness or discoloration'],
    riskFactors: ['Prolonged immobility', 'Recent surgery', 'Family history of clots', 'Pregnancy', 'Oral contraceptives'],
    treatmentOptions: ['Anticoagulant medications', 'Compression therapy', 'Leg elevation', 'Thrombolytic therapy in severe cases'],
  },
  varicose: {
    id: 'varicose',
    name: 'Varicose Veins',
    description: 'Enlarged, twisted veins that usually appear on the legs. They occur when valves in veins fail, causing blood to pool.',
    symptoms: ['Visible twisted veins', 'Leg heaviness', 'Aching or burning sensation', 'Swelling in legs and ankles'],
    riskFactors: ['Family history', 'Prolonged standing', 'Pregnancy', 'Obesity', 'Age'],
    treatmentOptions: ['Compression stockings', 'Sclerotherapy', 'Laser treatment', 'Surgical removal'],
  },
  venous: {
    id: 'venous',
    name: 'Venous Insufficiency',
    description: 'A condition where veins have difficulty sending blood from the legs back to the heart, causing blood to pool.',
    symptoms: ['Leg swelling', 'Skin discoloration', 'Leg ulcers', 'Heaviness and fatigue'],
    riskFactors: ['DVT history', 'Varicose veins', 'Prolonged standing', 'Obesity', 'Pregnancy'],
    treatmentOptions: ['Compression therapy', 'Leg elevation', 'Exercise', 'Medications', 'Surgical intervention'],
  },
  arterial: {
    id: 'arterial',
    name: 'Arterial Disease',
    description: 'A condition where arteries narrow due to plaque buildup, reducing blood flow to the limbs.',
    symptoms: ['Leg pain during walking', 'Numbness or weakness', 'Pale or cool skin', 'Slow-healing wounds'],
    riskFactors: ['Smoking', 'High cholesterol', 'Diabetes', 'High blood pressure', 'Age'],
    treatmentOptions: ['Lifestyle modifications', 'Medications', 'Angioplasty', 'Bypass surgery'],
  },
};

const SYMPTOM_TO_CONDITIONS: SymptomToConditionMap = {
  'leg-swelling': ['dvt', 'varicose', 'venous'],
  'pain-discomfort': ['dvt', 'varicose', 'arterial'],
  'skin-changes': ['venous', 'arterial'],
  'heaviness': ['varicose', 'venous'],
  'other': ['dvt', 'varicose', 'venous', 'arterial'],
};

type NavigatorStep = 'symptoms' | 'conditions' | 'details' | 'action';

interface NavigatorState {
  step: NavigatorStep;
  selectedSymptom: string | null;
  selectedCondition: string | null;
  scrollPosition: number;
}

export function SymptomNavigator() {
  const [state, setState] = useState<NavigatorState>({
    step: 'symptoms',
    selectedSymptom: null,
    selectedCondition: null,
    scrollPosition: 0,
  });

  const handleSymptomSelect = (symptomId: string) => {
    setState((prev) => ({
      ...prev,
      step: 'conditions',
      selectedSymptom: symptomId,
      scrollPosition: window.scrollY,
    }));
    window.scrollTo(0, 0);
  };

  const handleConditionSelect = (conditionId: string) => {
    setState((prev) => ({
      ...prev,
      step: 'details',
      selectedCondition: conditionId,
      scrollPosition: window.scrollY,
    }));
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (state.step === 'conditions') {
      setState((prev) => ({
        ...prev,
        step: 'symptoms',
        selectedSymptom: null,
      }));
    } else if (state.step === 'details') {
      setState((prev) => ({
        ...prev,
        step: 'conditions',
        selectedCondition: null,
      }));
    } else if (state.step === 'action') {
      setState((prev) => ({
        ...prev,
        step: 'details',
      }));
    }
    window.scrollTo(0, 0);
  };

  const handleLearnMore = () => {
    setState((prev) => ({
      ...prev,
      step: 'action',
    }));
  };

  const relatedConditions =
    state.selectedSymptom && SYMPTOM_TO_CONDITIONS[state.selectedSymptom]
      ? SYMPTOM_TO_CONDITIONS[state.selectedSymptom].map((id) => CONDITIONS[id])
      : [];

  const selectedConditionData = state.selectedCondition ? CONDITIONS[state.selectedCondition] : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Step 1: Symptom Selection */}
      {state.step === 'symptoms' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-100 mb-2">Symptom Navigator</h2>
            <p className="text-slate-300">Select a symptom to explore related conditions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SYMPTOMS.map((symptom) => (
              <button
                key={symptom.id}
                onClick={() => handleSymptomSelect(symptom.id)}
                className="p-6 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-teal-500 transition-all text-left group"
              >
                <div className="text-4xl mb-3">{symptom.icon}</div>
                <h3 className="text-lg font-semibold text-slate-100 group-hover:text-teal-400 transition-colors">
                  {symptom.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Condition Selection */}
      {state.step === 'conditions' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-slate-100">Related Conditions</h2>
              <p className="text-slate-400">
                Conditions associated with {SYMPTOMS.find((s) => s.id === state.selectedSymptom)?.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedConditions.map((condition) => (
              <Card
                key={condition.id}
                className="p-6 cursor-pointer hover:border-teal-500 transition-colors group"
                onClick={() => handleConditionSelect(condition.id)}
              >
                <h3 className="text-xl font-semibold text-slate-100 mb-2 group-hover:text-teal-400 transition-colors">
                  {condition.name}
                </h3>
                <p className="text-slate-300 text-sm mb-4">{condition.description}</p>
                <div className="flex items-center gap-2 text-teal-400 text-sm">
                  Learn more
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Condition Details */}
      {state.step === 'details' && selectedConditionData && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-slate-100">{selectedConditionData.name}</h2>
            </div>
          </div>

          <Card className="p-8 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Overview</h3>
              <p className="text-slate-300">{selectedConditionData.description}</p>
            </div>

            {/* Symptoms */}
            <div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Common Symptoms</h3>
              <ul className="space-y-2">
                {selectedConditionData.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-teal-500 mt-1">•</span>
                    <span className="text-slate-300">{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Factors */}
            <div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Risk Factors</h3>
              <ul className="space-y-2">
                {selectedConditionData.riskFactors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatment Options */}
            <div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">Treatment Options</h3>
              <ul className="space-y-2">
                {selectedConditionData.treatmentOptions.map((option, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{option}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button onClick={handleLearnMore} className="w-full">
                Learn More About {selectedConditionData.name}
              </Button>
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                Book Consultation
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Step 4: Action */}
      {state.step === 'action' && selectedConditionData && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-slate-100">Next Steps</h2>
            </div>
          </div>

          <Card className="p-8 space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-slate-100 mb-4">
                Ready to address your {selectedConditionData.name}?
              </h3>
              <p className="text-slate-300 mb-6">
                Dr. Herlon Moura specializes in treating {selectedConditionData.name} with proven, evidence-based approaches. Schedule a consultation to discuss your specific situation and treatment options.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 bg-slate-800 border-teal-500/30">
                <h4 className="font-semibold text-slate-100 mb-3">Schedule a Consultation</h4>
                <p className="text-sm text-slate-300 mb-4">
                  Book an appointment with Dr. Herlon Moura to discuss your symptoms and treatment options.
                </p>
                <Button className="w-full">Book Now</Button>
              </Card>

              <Card className="p-6 bg-slate-800 border-slate-600">
                <h4 className="font-semibold text-slate-100 mb-3">Contact Us</h4>
                <p className="text-sm text-slate-300 mb-4">
                  Have questions? Contact our office to speak with a team member about your concerns.
                </p>
                <Button variant="secondary" className="w-full">
                  Contact
                </Button>
              </Card>
            </div>

            <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
              <p className="text-sm text-slate-300">
                <strong>Important:</strong> This information is for educational purposes only and should not replace professional medical advice. Please consult with Dr. Herlon Moura for personalized diagnosis and treatment recommendations.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
