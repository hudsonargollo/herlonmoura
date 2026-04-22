'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Pause, Play } from 'lucide-react';
import Card from './Card';

interface Testimonial {
  id: string;
  patientName: string;
  condition: string;
  outcome: string;
  rating: number;
  quote: string;
}

interface Credentials {
  licenseNumber: string;
  certifications: string[];
  yearsOfExperience: number;
  specializations: string[];
}

interface SocialProofTickerProps {
  testimonials?: Testimonial[];
  credentials?: Credentials;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    patientName: 'Maria S.',
    condition: 'Varicose Veins',
    outcome: 'Successful treatment with minimal downtime',
    rating: 5,
    quote: 'Dr. Herlon provided excellent care and clear explanations throughout my treatment.',
  },
  {
    id: '2',
    patientName: 'João P.',
    condition: 'DVT',
    outcome: 'Complete recovery with preventive care',
    rating: 5,
    quote: 'The expertise and professionalism were outstanding. Highly recommended.',
  },
  {
    id: '3',
    patientName: 'Ana C.',
    condition: 'Venous Insufficiency',
    outcome: 'Improved circulation and symptom relief',
    rating: 5,
    quote: 'Dr. Herlon took time to understand my concerns and provided the best solution.',
  },
  {
    id: '4',
    patientName: 'Carlos M.',
    condition: 'Arterial Disease',
    outcome: 'Successful intervention and recovery',
    rating: 5,
    quote: 'Professional, knowledgeable, and caring. I trust Dr. Herlon completely.',
  },
];

const DEFAULT_CREDENTIALS: Credentials = {
  licenseNumber: 'CRM-BA 12345',
  certifications: ['Board Certified in Angiology', 'Specialist in Vascular Surgery', 'Fellow of the Brazilian Society of Angiology'],
  yearsOfExperience: 20,
  specializations: ['Deep Vein Thrombosis', 'Varicose Veins', 'Arterial Disease', 'Venous Insufficiency'],
};

export default function SocialProofTicker({
  testimonials = DEFAULT_TESTIMONIALS,
  credentials = DEFAULT_CREDENTIALS,
}: SocialProofTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isAutoRotating || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotating, isPaused, testimonials.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsPaused(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsPaused(true);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="w-full space-y-8">
      {/* Testimonial Ticker */}
      <Card className="p-8">
        <div
          className="group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Testimonial Content */}
          <div className="min-h-[280px] flex flex-col justify-between">
            {/* Quote */}
            <div className="mb-6">
              <p className="text-lg text-slate-100 italic mb-4">"{currentTestimonial.quote}"</p>
            </div>

            {/* Patient Info */}
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-slate-100">{currentTestimonial.patientName}</p>
                <p className="text-sm text-slate-400">{currentTestimonial.condition}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-slate-400">{currentTestimonial.rating}/5</span>
              </div>

              {/* Outcome */}
              <p className="text-sm text-teal-400">{currentTestimonial.outcome}</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Pause/Play Button */}
            <button
              onClick={togglePause}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 transition-colors"
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>

            {/* Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsPaused(true);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-teal-500 w-6' : 'bg-slate-600 w-2 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Credentials Display */}
      <Card className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: License and Certifications */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">Medical License</h3>
              <p className="text-lg font-semibold text-slate-100">{credentials.licenseNumber}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Board Certifications</h3>
              <ul className="space-y-2">
                {credentials.certifications.map((cert, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">✓</span>
                    <span className="text-slate-100">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Experience and Specializations */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">Years of Experience</h3>
              <p className="text-lg font-semibold text-slate-100">{credentials.yearsOfExperience}+ years</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Specializations</h3>
              <ul className="space-y-2">
                {credentials.specializations.map((spec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span className="text-slate-100">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Social Proof Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-teal-500 mb-2">500+</p>
          <p className="text-slate-300">Patients Treated</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-teal-500 mb-2">98%</p>
          <p className="text-slate-300">Patient Satisfaction</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-teal-500 mb-2">1000+</p>
          <p className="text-slate-300">Successful Procedures</p>
        </Card>
      </div>
    </div>
  );
}
