'use client';

import React from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Activity,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

interface PatientDetailProps {
  patientId: string;
  onBack: () => void;
}

// Mock detail data keyed by id
const PATIENT_DETAILS: Record<
  string,
  {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    birthDate: string;
    address: string;
    diagnosis: string;
    medications: string[];
    allergies: string[];
    appointments: Array<{ date: string; type: string; status: string }>;
    notes: string;
  }
> = {
  'P-001': {
    name: 'Maria Santos Silva',
    email: 'maria.silva@email.com',
    phone: '(71) 99123-4567',
    cpf: '***.***-**1',
    birthDate: '1978-03-15',
    address: 'R. das Flores, 420 — Graça, Salvador',
    diagnosis: 'Insuficiência venosa crônica estágio II',
    medications: ['Diosmina 450mg', 'Hesperidina 50mg'],
    allergies: ['Penicilina'],
    appointments: [
      { date: '2026-10-15', type: 'Retorno — Doppler', status: 'confirmed' },
      { date: '2026-09-28', type: 'Consulta inicial', status: 'completed' },
    ],
    notes: 'Paciente com bom controle. Retornar em 60 dias.',
  },
  'P-002': {
    name: 'João Pereira Costa',
    email: 'joao.costa@email.com',
    phone: '(71) 98765-4321',
    cpf: '***.***-**2',
    birthDate: '1965-07-22',
    address: 'Av. Tancredo Neves, 1200 — Caminho das Árvores',
    diagnosis: 'TVP pós-cirúrgica em tratamento',
    medications: ['Rivaroxabana 20mg'],
    allergies: [],
    appointments: [
      { date: '2026-10-01', type: 'Retorno — Hemograma', status: 'completed' },
    ],
    notes: 'Monitorar INR semanalmente.',
  },
  'P-003': {
    name: 'Ana Paula Oliveira',
    email: 'ana.oliveira@email.com',
    phone: '(71) 99345-6789',
    cpf: '***.***-**3',
    birthDate: '1982-11-08',
    address: 'R. Alagoinhas, 88 — Brotas',
    diagnosis: 'Varizes grau III — aguardando tratamento',
    medications: [],
    allergies: ['Iodo'],
    appointments: [
      { date: '2026-10-20', type: 'Consulta — Escleroterapia', status: 'scheduled' },
    ],
    notes: 'Aguardando confirmação de convênio.',
  },
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-surgical-teal" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-neutral-medium">{label}</p>
        <p className="text-sm text-neutral-light">{value}</p>
      </div>
    </div>
  );
}

export function PatientDetail({ patientId, onBack }: PatientDetailProps) {
  const d = PATIENT_DETAILS[patientId];

  if (!d) {
    return (
      <div className="rounded-xl border border-neutral-dark bg-neutral-dark/60 p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-warning-amber" />
        <p className="mt-3 text-neutral-medium">Paciente não encontrado.</p>
        <Button variant="ghost" size="sm" onClick={onBack} className="mt-3">
          Voltar à lista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Voltar
        </Button>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surgical-teal/15 text-surgical-teal text-lg font-bold">
          {d.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-heading-3 font-heading font-semibold text-neutral-light">
            {d.name}
          </h2>
          <p className="text-xs text-neutral-medium">{patientId}</p>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
        <Card variant="glass">
          <div className="space-y-3">
            <DetailRow icon={Mail} label="E-mail" value={d.email} />
            <DetailRow icon={Phone} label="Telefone" value={d.phone} />
            <DetailRow icon={MapPin} label="Endereço" value={d.address} />
            <DetailRow icon={Calendar} label="Nascimento" value={d.birthDate} />
            <DetailRow icon={User} label="CPF" value={d.cpf} />
          </div>
        </Card>

        <Card variant="glass">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Stethoscope className="mt-0.5 h-4 w-4 flex-shrink-0 text-surgical-teal" />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-neutral-medium">
                  Diagnóstico
                </p>
                <p className="text-sm text-neutral-light">{d.diagnosis}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="mt-0.5 h-4 w-4 flex-shrink-0 text-surgical-teal" />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-neutral-medium">
                  Medicações
                </p>
                {d.medications.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-neutral-light">
                    {d.medications.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-neutral-medium">Nenhuma</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning-amber" />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-neutral-medium">
                  Alergias
                </p>
                {d.allergies.length > 0 ? (
                  <p className="text-sm text-warning-amber">{d.allergies.join(', ')}</p>
                ) : (
                  <p className="text-sm text-neutral-medium">Nenhuma</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Appointments */}
      <Card variant="glass">
        <h3 className="text-heading-3 font-heading font-semibold text-neutral-light mb-3">
          Histórico de Consultas
        </h3>
        <div className="space-y-2">
          {d.appointments.map((a) => (
            <div
              key={a.date}
              className="flex items-center justify-between rounded-lg border border-neutral-dark/60 px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-neutral-medium" />
                <span className="text-sm text-neutral-light">{a.date}</span>
                <span className="text-xs text-neutral-medium">{a.type}</span>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                  a.status === 'confirmed'
                    ? 'border-success-green/30 bg-success-green/15 text-success-green'
                    : a.status === 'completed'
                    ? 'border-neutral-medium/30 bg-neutral-medium/15 text-neutral-medium'
                    : 'border-warning-amber/30 bg-warning-amber/15 text-warning-amber'
                }`}
              >
                {a.status === 'confirmed' && <CheckCircle2 className="h-3 w-3" />}
                {a.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                {a.status === 'scheduled' && <Clock className="h-3 w-3" />}
                {a.status === 'confirmed'
                  ? 'Confirmado'
                  : a.status === 'completed'
                  ? 'Realizado'
                  : 'Agendado'}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Notes */}
      <Card variant="glass">
        <h3 className="text-heading-3 font-heading font-semibold text-neutral-light mb-2">
          Observações
        </h3>
        <p className="text-sm text-neutral-light">{d.notes}</p>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="primary" size="sm">
          Agendar Consulta
        </Button>
        <Button variant="secondary" size="sm">
          <MessageSquare className="mr-1.5 h-4 w-4" /> WhatsApp
        </Button>
      </div>
    </div>
  );
}
