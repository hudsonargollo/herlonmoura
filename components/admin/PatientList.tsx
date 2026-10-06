'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, UserCheck, Clock, MoreHorizontal, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/Button';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  status: 'active' | 'inactive' | 'pending';
  lastAppointment: string;
  nextAppointment: string | null;
  leadScore: number;
}

const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P-001',
    name: 'Maria Santos Silva',
    email: 'maria.silva@email.com',
    phone: '(71) 99123-4567',
    cpf: '***.***-**1',
    status: 'active',
    lastAppointment: '2026-09-28',
    nextAppointment: '2026-11-15',
    leadScore: 85,
  },
  {
    id: 'P-002',
    name: 'João Pereira Costa',
    email: 'joao.costa@email.com',
    phone: '(71) 98765-4321',
    cpf: '***.***-**2',
    status: 'active',
    lastAppointment: '2026-10-01',
    nextAppointment: null,
    leadScore: 72,
  },
  {
    id: 'P-003',
    name: 'Ana Paula Oliveira',
    email: 'ana.oliveira@email.com',
    phone: '(71) 99345-6789',
    cpf: '***.***-**3',
    status: 'pending',
    lastAppointment: '2026-08-15',
    nextAppointment: '2026-10-20',
    leadScore: 45,
  },
  {
    id: 'P-004',
    name: 'Carlos Eduardo Lima',
    email: 'carlos.lima@email.com',
    phone: '(71) 99456-7890',
    cpf: '***.***-**4',
    status: 'inactive',
    lastAppointment: '2026-05-10',
    nextAppointment: null,
    leadScore: 30,
  },
  {
    id: 'P-005',
    name: 'Fernanda Rezende',
    email: 'fernanda.rez@email.com',
    phone: '(71) 99567-8901',
    cpf: '***.***-**5',
    status: 'active',
    lastAppointment: '2026-09-10',
    nextAppointment: '2026-12-01',
    leadScore: 90,
  },
  {
    id: 'P-006',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@email.com',
    phone: '(71) 99678-9012',
    cpf: '***.***-**6',
    status: 'pending',
    lastAppointment: '2026-07-22',
    nextAppointment: null,
    leadScore: 55,
  },
];

const STATUS_LABELS = {
  active: 'Ativo',
  inactive: 'Inativo',
  pending: 'Pendente',
};

const STATUS_COLORS = {
  active: 'bg-success-green/15 text-success-green border-success-green/30',
  inactive: 'bg-neutral-medium/15 text-neutral-medium border-neutral-medium/30',
  pending: 'bg-warning-amber/15 text-warning-amber border-warning-amber/30',
};

export function PatientList({ onSelectPatient }: { onSelectPatient: (id: string) => void }) {
  const [patients] = useState<Patient[]>(MOCK_PATIENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = patients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-medium" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input pl-10 w-full text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input text-sm py-2"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="pending">Pendente</option>
            <option value="inactive">Inativo</option>
          </select>
          <Button variant="primary" size="sm">
            <Plus className="mr-1.5 h-4 w-4" /> Novo
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-dark bg-neutral-dark/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-dark/60 bg-neutral-dark/40">
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wider">
                Última Consulta
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wider">
                Próxima
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-medium uppercase tracking-wider">
                Score
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-medium uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-dark/40">
            {filtered.map((p) => (
              <tr
                key={p.id}
                className={`cursor-pointer transition-colors hover:bg-surgical-teal/5 ${
                  selectedId === p.id ? 'bg-surgical-teal/10' : ''
                }`}
                onClick={() => { setSelectedId(p.id); onSelectPatient?.(p.id); }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surgical-teal/15 text-surgical-teal text-xs font-bold">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-light">{p.name}</p>
                      <p className="text-[11px] text-neutral-medium">{p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_COLORS[p.status]}`}
                  >
                    {STATUS_LABELS[p.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-medium">{p.lastAppointment}</td>
                <td className="px-4 py-3">
                  {p.nextAppointment ? (
                    <span className="text-neutral-light">{p.nextAppointment}</span>
                  ) : (
                    <span className="text-neutral-medium">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-neutral-dark overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          p.leadScore >= 70
                            ? 'bg-success-green'
                            : p.leadScore >= 40
                            ? 'bg-warning-amber'
                            : 'bg-error-red'
                        }`}
                        style={{ width: `${p.leadScore}%` }}
                      />
                    </div>
                    <span className="text-xs text-neutral-medium">{p.leadScore}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-neutral-medium">
            Nenhum paciente encontrado.
          </div>
        )}
      </div>

      {/* Patient count */}
      <p className="text-[11px] text-neutral-medium">
        {filtered.length} de {patients.length} pacientes
      </p>
    </div>
  );
}
