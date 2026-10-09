'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';
import { api } from '@/lib/admin/api';

interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  completed: 'Realizado',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-warning-amber/15 text-warning-amber border-warning-amber/30',
  confirmed: 'bg-primary/15 text-primaryborder-primary/30',
  completed: ' bg-muted/50/15 text-muted-foreground border-neutral-medium/30',
  cancelled: 'bg-error-red/15 text-error-red border-error-red/30',
};

export function AppointmentScheduler() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ date: '', time: '', patient: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Try real API first; fallback to mock
      const data = await api.get<{ appointments?: Appointment[] }>('/api/crm/appointments');
      if (data.appointments) {
        setAppointments(data.appointments);
      } else {
        throw new Error('no data');
      }
    } catch {
      // Fallback mock data
      setAppointments([
        { id: 'A-001', date: '2026-10-15', time: '09:00', patientName: 'Maria Santos Silva', type: 'Retorno — Doppler', status: 'scheduled' },
        { id: 'A-002', date: '2026-10-15', time: '14:30', patientName: 'Ana Paula Oliveira', type: 'Escleroterapia', status: 'confirmed' },
        { id: 'A-003', date: '2026-10-14', time: '10:00', patientName: 'João Pereira Costa', type: 'Retorno — Hemograma', status: 'completed' },
        { id: 'A-004', date: '2026-10-18', time: '11:00', patientName: 'Fernanda Rezende', type: 'Consulta inicial', status: 'scheduled' },
      ]);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleAdd = () => {
    if (!formData.date || !formData.time || !formData.patient) return;
    const newAppt: Appointment = {
      id: `A-${String(appointments.length + 1).padStart(3, '0')}`,
      date: formData.date,
      time: formData.time,
      patientName: formData.patient,
      type: formData.type || 'Consulta',
      status: 'scheduled',
    };
    setAppointments((prev) => [newAppt, ...prev]);
    setFormData({ date: '', time: '', patient: '', type: '' });
    setShowForm(false);
  };

  const updateStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const removeAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const grouped: Record<string, Appointment[]> = {};
  for (const a of appointments) {
    if (!grouped[a.date]) grouped[a.date] = [];
    grouped[a.date].push(a);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-heading-3 font-heading font-semibold text-foreground">Agendamentos</h3>
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}><Plus className="mr-1.5 h-4 w-4" /> Novo Agendamento</Button>
      </div>

      {error && (
        <div className="rounded-xl border border-error-red/30 bg-error-red/5 p-4 text-center">
          <p className="text-sm text-error-red">{error}</p>
          <Button variant="primary" size="sm" onClick={fetchAppointments} className="mt-2">Tentar novamente</Button>
        </div>
      )}

      {showForm && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <h4 className="text-sm font-semibold text-primary">Novo Agendamento</h4>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Data" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            <FormInput label="Hora" type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
          </div>
          <FormInput label="Paciente" type="text" value={formData.patient} onChange={(e) => setFormData({ ...formData, patient: e.target.value })} placeholder="Nome do paciente" />
          <FormInput label="Tipo" type="text" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} placeholder="Tipo de consulta" />
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleAdd}>Salvar</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center text-muted-foreground py-8">Carregando...</div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([date, apps]) => (
            <div key={date}>
              <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" /> {date}
              </h4>
              <div className="space-y-2">
                {apps.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 px-4 py-3">
                    <div className="flex items-center gap-4">
                      <Clock className="h-4 w-4 text-primaryflex-shrink-0" />
                      <span className="text-sm font-mono text-foreground">{a.time}</span>
                      <div>
                        <p className="text-sm text-foreground">{a.patientName}</p>
                        <p className="text-xs text-muted-foreground">{a.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_COLORS[a.status]}`}>{STATUS_LABELS[a.status]}</span>
                      {a.status === 'scheduled' && (
                        <>
                          <button onClick={() => updateStatus(a.id, 'confirmed')} className="rounded p-1 text-success-green hover:bg-success-green/10" title="Confirmar"><CheckCircle2 className="h-4 w-4" /></button>
                          <button onClick={() => updateStatus(a.id, 'cancelled')} className="rounded p-1 text-error-red hover:bg-error-red/10" title="Cancelar"><XCircle className="h-4 w-4" /></button>
                        </>
                      )}
                      <button onClick={() => removeAppointment(a.id)} className="rounded p-1 text-muted-foreground hover:bg-error-red/10 hover:text-error-red" title="Remover"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {appointments.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhum agendamento.</p>}
        </div>
      )}
    </div>
  );
}