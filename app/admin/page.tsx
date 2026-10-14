'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { PatientList } from '@/components/admin/PatientList';
import { PatientDetail } from '@/components/admin/PatientDetail';
import { AppointmentScheduler } from '@/components/admin/AppointmentScheduler';
import { LeadStatusTracker } from '@/components/admin/LeadStatusTracker';
import { BlogEditorList } from '@/components/admin/BlogEditorList';
import AnalyticsFunnels from './analytics/page';
import { Users, Calendar, ClipboardList, FileText, BarChart3 } from 'lucide-react';

type Section = 'crm' | 'appointments' | 'leads' | 'blog' | 'analytics';

interface CRMPageProps {
  activeSection: Section;
  onNavigate: (section: Section) => void;
}

function CRMPage({ activeSection, onNavigate }: CRMPageProps) {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  if (selectedPatient) {
    return (
      <PatientDetail
        patientId={selectedPatient}
        onBack={() => setSelectedPatient(null)}
      />
    );
  }

  switch (activeSection) {
    case 'crm':
      return <PatientList onSelectLead={setSelectedPatient} />;
    case 'appointments':
      return <AppointmentScheduler />;
    case 'leads':
      return <LeadStatusTracker />;
    default:
      return <PatientList onSelectLead={setSelectedPatient} />;
  }
}

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>('crm');

  return (
    <ProtectedRoute requiredRole="editor">
      <div className="flex min-h-screen bg-dark-elevated">
        <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

        <main className="flex-1 p-6 tablet:p-8 overflow-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              {activeSection === 'crm' && <Users className="h-6 w-6 text-surgical-teal" />}
              {activeSection === 'appointments' && <Calendar className="h-6 w-6 text-surgical-teal" />}
              {activeSection === 'leads' && <ClipboardList className="h-6 w-6 text-surgical-teal" />}
              {activeSection === 'blog' && <FileText className="h-6 w-6 text-surgical-teal" />}
              {activeSection === 'analytics' && <BarChart3 className="h-6 w-6 text-surgical-teal" />}
              <h1 className="text-display-md font-heading font-semibold text-neutral-light">
                {activeSection === 'crm'
                  ? 'CRM — Pacientes'
                  : activeSection === 'appointments'
                  ? 'Agendamentos'
                  : activeSection === 'leads'
                  ? 'Leads'
                  : activeSection === 'analytics'
                  ? 'Analytics'
                  : 'Blog Editor'}
              </h1>
            </div>
            <p className="text-sm text-neutral-medium">
              {activeSection === 'crm'
                ? 'Gerencie pacientes, status e histórico clínico.'
                : activeSection === 'appointments'
                ? 'Agende e acompanhe consultas.'
                : activeSection === 'leads'
                ? 'Acompanhe o pipeline de leads e taxas de conversão.'
                : activeSection === 'analytics'
                ? 'Funis de conversão, análise de coortes e engajamento por procedimento.'
                : 'Crie e gerencie artigos do blog com preview em tempo real.'}
            </p>
          </header>

          {/* Content */}
          {activeSection === 'blog' ? (
            <BlogEditorList />
          ) : activeSection === 'analytics' ? (
            <AnalyticsFunnels />
          ) : (
            <CRMPage activeSection={activeSection} onNavigate={setActiveSection} />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}