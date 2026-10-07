-- Seed email sequences — run after schema migration
-- npx wrangler d1 execute herlonmoura_crm --file=seed.sql

-- 1. Welcome sequence (trigger on new lead / welcome event, immediate)
INSERT OR REPLACE INTO email_sequences (id, name, trigger, delay_hours, subject, body, is_active) VALUES
('seq-welcome', 'Bem-vindo ao Consultório', 'welcome', 0,
 'Bem-vindo, {{nome}} — sua jornada começa aqui',
 'Olá {{nome}},\n\nSeja muito bem-vindo ao consultório do Dr. Herlon Moura.\n\nAqui você terá acesso a conteúdos exclusivos sobre saúde vascular, dicas de prevenção e acompanhamento personalizado.\n\nPróximos passos:\n- Confirme seu cadastro clicando no link abaixo\n- Baixe nosso guia gratuito de prevenção\n\nAcesse: {{site_url}}/boas-vindas\n\nEquipe Dr. Herlon Moura',
 1);

-- 2. DVT risk follow-up (after freebie download, 24h delay)
INSERT OR REPLACE INTO email_sequences (id, name, trigger, delay_hours, subject, body, is_active) VALUES
('seq-dvt-followup', 'Acompanhamento — Risco TVP', 'freebie_download', 24,
 '{{nome}}, vamos entender melhor o seu risco de TVP?',
 'Olá {{nome}},\n\nBaixamos seu material sobre prevenção de Trombose Venosa Profunda.\n\nCom base no seu perfil, alguns pontos merecem atenção:\n- Tempo immóbilidade prolongada?\n- Histórico familiar de coagulação?\n- Cirurgias recentes?\n\nFaça nossa avaliação rápida e gratuita: {{site_url}}/calculadora-dvt\n\nSe tiver dúvidas, estamos aqui.\n\nDr. Herlon Moura',
 1);

-- 3. Appointment booking nudge (48h after appointment scheduled)
INSERT OR REPLACE INTO email_sequences (id, name, trigger, delay_hours, subject, body, is_active) VALUES
('seq-appointment-nudge', 'Lembrete de Consulta', 'appointment_nudge', 48,
 'Consulta agendada — {{data}} — Confirme sua presença',
 'Olá {{nome}},\n\nLembramos que sua consulta está agendada para:\n\n📅 {{data}}\n📍 {{clinica}}\n\nCaso precise reagendar, responda este e-mail ou chame no WhatsApp: {{whatsapp}}\n\nCompareça com:\n- Documento com foto\n- Exames recentes (se houver)\n\nAté breve,\nEquipe Dr. Herlon Moura',
 1);

-- 4. Weekly blog digest (168h = 7 days)
INSERT OR REPLACE INTO email_sequences (id, name, trigger, delay_hours, subject, body, is_active) VALUES
('seq-weekly-digest', 'Resumo Semanal — Artigos', 'weekly_digest', 168,
 'Resumo da semana: {{nome}}, veja o que publicamos',
 'Olá {{nome}},\n\nConfira os artigos que publicamos esta semana:\n\n{{artigos_semana}}\n\nCada um traz orientações práticas sobre saúde vascular.\n\nLeia mais: {{site_url}}/blog\n\nAté a próxima,\nDr. Herlon Moura',
 1);

-- 5. Re-engagement (72h after last interaction)
INSERT OR REPLACE INTO email_sequences (id, name, trigger, delay_hours, subject, body, is_active) VALUES
('seq-reengagement', 'Sentimos sua falta', 'reengagement', 72,
 '{{nome}}, faz tempo — estamos com novidades',
 'Olá {{nome}},\n\nNão visita nosso site há algum tempo e queríamos saber como está.\n\nPublicamos conteúdos novos esta semana:\n- {{ultimo_artigo}}\n\nAlém disso, nosso avaliador de risco de TVP está atualizado.\n\n{{site_url}}/calculadora-dvt\n\nCaso queira retomar o acompanhamento, é só responder este e-mail.\n\nUm abraço,\nEquipe Dr. Herlon Moura',
 1);