'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface DVTCalculatorState {
  currentStep: number;
  responses: {
    ageRange: string;
    immobilityDuration: string;
    recentSurgery: boolean | null;
    familyHistory: boolean | null;
    pregnancyStatus: string;
    additionalFactors: string[];
  };
  riskScore: number | null;
  riskCategory: 'low' | 'moderate' | 'high' | 'critical' | null;
}

const RISK_FACTOR_WEIGHTS = {
  ageRange: {
    '18-40': 0,
    '41-60': 1,
    '61-80': 2,
    '80+': 3,
  },
  immobilityDuration: {
    '0-3': 0,
    '4-7': 1,
    '8-14': 2,
    '15+': 3,
  },
  recentSurgery: { true: 2, false: 0 },
  familyHistory: { true: 1, false: 0 },
  pregnancyStatus: {
    'not-applicable': 0,
    'not-pregnant': 0,
    'pregnant': 2,
    'postpartum-6weeks': 2,
    'postpartum-6months': 1,
  },
};

export function DVTRiskCalculator() {
  const [state, setState] = useState<DVTCalculatorState>({
    currentStep: 0,
    responses: {
      ageRange: '',
      immobilityDuration: '',
      recentSurgery: null,
      familyHistory: null,
      pregnancyStatus: '',
      additionalFactors: [],
    },
    riskScore: null,
    riskCategory: null,
  });

  const computeRiskScore = (responses: DVTCalculatorState['responses']): { score: number; category: 'low' | 'moderate' | 'high' | 'critical' } => {
    let score = 0;

    if (responses.ageRange) {
      score += RISK_FACTOR_WEIGHTS.ageRange[responses.ageRange as keyof typeof RISK_FACTOR_WEIGHTS.ageRange] || 0;
    }
    if (responses.immobilityDuration) {
      score += RISK_FACTOR_WEIGHTS.immobilityDuration[responses.immobilityDuration as keyof typeof RISK_FACTOR_WEIGHTS.immobilityDuration] || 0;
    }
    if (responses.recentSurgery !== null) {
      score += RISK_FACTOR_WEIGHTS.recentSurgery[responses.recentSurgery ? 'true' : 'false'];
    }
    if (responses.familyHistory !== null) {
      score += RISK_FACTOR_WEIGHTS.familyHistory[responses.familyHistory ? 'true' : 'false'];
    }
    if (responses.pregnancyStatus) {
      score += RISK_FACTOR_WEIGHTS.pregnancyStatus[responses.pregnancyStatus as keyof typeof RISK_FACTOR_WEIGHTS.pregnancyStatus] || 0;
    }
    score += responses.additionalFactors.length;

    let category: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (score >= 9) category = 'critical';
    else if (score >= 6) category = 'high';
    else if (score >= 3) category = 'moderate';

    return { score, category };
  };

  const handleNext = () => {
    if (state.currentStep < 6) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
    } else {
      const { score, category } = computeRiskScore(state.responses);
      setState((prev) => ({
        ...prev,
        currentStep: 7,
        riskScore: score,
        riskCategory: category,
      }));
    }
  };

  const handleBack = () => {
    if (state.currentStep > 0) {
      setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const handleResponseChange = (field: keyof DVTCalculatorState['responses'], value: any) => {
    setState((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        [field]: value,
      },
    }));
  };

  const handleAdditionalFactorToggle = (factor: string) => {
    setState((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        additionalFactors: prev.responses.additionalFactors.includes(factor)
          ? prev.responses.additionalFactors.filter((f) => f !== factor)
          : [...prev.responses.additionalFactors, factor],
      },
    }));
  };

  const handleReset = () => {
    setState({
      currentStep: 0,
      responses: {
        ageRange: '',
        immobilityDuration: '',
        recentSurgery: null,
        familyHistory: null,
        pregnancyStatus: '',
        additionalFactors: [],
      },
      riskScore: null,
      riskCategory: null,
    });
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'low':
        return 'bg-green-900 text-green-100';
      case 'moderate':
        return 'bg-yellow-900 text-yellow-100';
      case 'high':
        return 'bg-orange-900 text-orange-100';
      case 'critical':
        return 'bg-red-900 text-red-100';
      default:
        return 'bg-slate-700 text-slate-100';
    }
  };

  const getRiskRecommendation = (category: string) => {
    switch (category) {
      case 'low':
        return 'Your risk is low. Continue with healthy lifestyle habits and regular check-ups.';
      case 'moderate':
        return 'Your risk is moderate. Consider scheduling a consultation with Dr. Herlon Moura for personalized advice.';
      case 'high':
        return 'Your risk is high. We recommend scheduling a consultation with Dr. Herlon Moura as soon as possible.';
      case 'critical':
        return 'Your risk is critical. Please contact Dr. Herlon Moura immediately for urgent evaluation.';
      default:
        return '';
    }
  };

  const progressPercentage = ((state.currentStep + 1) / 8) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <Card className="p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-slate-100">DVT Risk Assessment</h2>
            <span className="text-sm text-slate-400">
              {state.currentStep === 7 ? 'Results' : `Step ${state.currentStep + 1} of 7`}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Step 0: Introduction */}
        {state.currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-100 mb-4">Assess Your DVT Risk</h3>
              <p className="text-slate-300 mb-4">
                Deep Vein Thrombosis (DVT) is a serious condition where blood clots form in deep veins. This assessment helps identify your personal risk factors.
              </p>
              <div className="bg-slate-800 border border-teal-500/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-300">
                  <strong>Privacy Notice:</strong> Your responses are processed locally on your device and are not stored or transmitted to any server. This assessment is for educational purposes only and does not replace professional medical advice.
                </p>
              </div>
            </div>
            <Button onClick={handleNext} className="w-full">
              Start Assessment
            </Button>
          </div>
        )}

        {/* Step 1: Age Range */}
        {state.currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-100 mb-4">What is your age range?</h3>
              <div className="space-y-3">
                {['18-40', '41-60', '61-80', '80+'].map((range) => (
                  <label key={range} className="flex items-center p-4 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <input
                      type="radio"
                      name="ageRange"
                      value={range}
                      checked={state.responses.ageRange === range}
                      onChange={(e) => handleResponseChange('ageRange', e.target.value)}
                      className="w-4 h-4 text-teal-500"
                    />
                    <span className="ml-3 text-slate-100">{range} years</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleBack} variant="secondary" className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!state.responses.ageRange} className="flex-1">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Immobility Duration */}
        {state.currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-100 mb-4">How long have you been immobile recently?</h3>
              <p className="text-sm text-slate-400 mb-4">Consider bed rest, long flights, or prolonged sitting</p>
              <div className="space-y-3">
                {['0-3', '4-7', '8-14', '15+'].map((duration) => (
                  <label key={duration} className="flex items-center p-4 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <input
                      type="radio"
                      name="immobilityDuration"
                      value={duration}
                      checked={state.responses.immobilityDuration === duration}
                      onChange={(e) => handleResponseChange('immobilityDuration', e.target.value)}
                      className="w-4 h-4 text-teal-500"
                    />
                    <span className="ml-3 text-slate-100">{duration} days</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleBack} variant="secondary" className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!state.responses.immobilityDuration} className="flex-1">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Recent Surgery */}
        {state.currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Have you had surgery in the past 3 months?</h3>
              <div className="space-y-3">
                {[
                  { value: true, label: 'Yes' },
                  { value: false, label: 'No' },
                ].map(({ value, label }) => (
                  <label key={String(value)} className="flex items-center p-4 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <input
                      type="radio"
                      name="recentSurgery"
                      value={String(value)}
                      checked={state.responses.recentSurgery === value}
                      onChange={(e) => handleResponseChange('recentSurgery', e.target.value === 'true')}
                      className="w-4 h-4 text-teal-500"
                    />
                    <span className="ml-3 text-slate-100">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleBack} variant="secondary" className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={state.responses.recentSurgery === null} className="flex-1">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Family History */}
        {state.currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Do you have a family history of blood clots?</h3>
              <div className="space-y-3">
                {[
                  { value: true, label: 'Yes' },
                  { value: false, label: 'No' },
                ].map(({ value, label }) => (
                  <label key={String(value)} className="flex items-center p-4 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <input
                      type="radio"
                      name="familyHistory"
                      value={String(value)}
                      checked={state.responses.familyHistory === value}
                      onChange={(e) => handleResponseChange('familyHistory', e.target.value === 'true')}
                      className="w-4 h-4 text-teal-500"
                    />
                    <span className="ml-3 text-slate-100">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleBack} variant="secondary" className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={state.responses.familyHistory === null} className="flex-1">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Pregnancy Status */}
        {state.currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-100 mb-4">What is your pregnancy status?</h3>
              <div className="space-y-3">
                {[
                  { value: 'not-applicable', label: 'Not applicable' },
                  { value: 'not-pregnant', label: 'Not pregnant' },
                  { value: 'pregnant', label: 'Currently pregnant' },
                  { value: 'postpartum-6weeks', label: 'Postpartum (within 6 weeks)' },
                  { value: 'postpartum-6months', label: 'Postpartum (6 weeks to 6 months)' },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center p-4 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <input
                      type="radio"
                      name="pregnancyStatus"
                      value={value}
                      checked={state.responses.pregnancyStatus === value}
                      onChange={(e) => handleResponseChange('pregnancyStatus', e.target.value)}
                      className="w-4 h-4 text-teal-500"
                    />
                    <span className="ml-3 text-slate-100">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleBack} variant="secondary" className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!state.responses.pregnancyStatus} className="flex-1">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 6: Additional Factors */}
        {state.currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Do any of these apply to you?</h3>
              <div className="space-y-3">
                {[
                  'Oral contraceptives or hormone therapy',
                  'Smoking',
                  'Obesity',
                  'Cancer or cancer treatment',
                  'Heart disease',
                  'Varicose veins',
                ].map((factor) => (
                  <label key={factor} className="flex items-center p-4 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={state.responses.additionalFactors.includes(factor)}
                      onChange={() => handleAdditionalFactorToggle(factor)}
                      className="w-4 h-4 text-teal-500 rounded"
                    />
                    <span className="ml-3 text-slate-100">{factor}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleBack} variant="secondary" className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                View Results
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 7: Results */}
        {state.currentStep === 7 && state.riskCategory && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-100 mb-6">Your DVT Risk Assessment</h3>

              {/* Risk Category Display */}
              <div className={`${getRiskColor(state.riskCategory)} rounded-lg p-6 mb-6`}>
                <div className="flex items-center gap-3 mb-2">
                  {state.riskCategory === 'low' || state.riskCategory === 'moderate' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <AlertCircle className="w-6 h-6" />
                  )}
                  <h4 className="text-2xl font-bold capitalize">{state.riskCategory} Risk</h4>
                </div>
                <p className="text-sm opacity-90">Risk Score: {state.riskScore}/10</p>
              </div>

              {/* Recommendation */}
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 mb-6">
                <p className="text-slate-100">{getRiskRecommendation(state.riskCategory)}</p>
              </div>

              {/* Educational Content */}
              <div className="bg-slate-800 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-slate-100 mb-3">About Your Risk Factors</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Age and immobility are significant risk factors for DVT</li>
                  <li>• Recent surgery increases clot formation risk</li>
                  <li>• Family history suggests genetic predisposition</li>
                  <li>• Pregnancy and postpartum period increase risk</li>
                  <li>• Additional factors compound your overall risk</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {(state.riskCategory === 'high' || state.riskCategory === 'critical') && (
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Schedule Urgent Consultation
                </Button>
              )}
              <Button className="w-full">Book Appointment with Dr. Herlon Moura</Button>
              <Button onClick={handleReset} variant="secondary" className="w-full">
                Take Assessment Again
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
