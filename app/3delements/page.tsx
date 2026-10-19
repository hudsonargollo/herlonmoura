'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Header, Footer, EdgeButton } from '@/components';
import { Image as ImageIcon, ExternalLink, Zap, Calendar } from 'lucide-react';
import { initSectionTracking, trackCtaClick } from '@/lib/analytics';
import { buildWhatsappLink } from '@/lib/contact';
import * as THREE from 'three';

// Configuration for each support image
const SUPPORT_IMAGES = [
  {
    name: 'body-vascular-network',
    alt: 'Rede vascular do corpo humano',
    description: 'Ilustração do sistema circulatório completo',
    color: '#1D3C73',
  },
  {
    name: 'consultorio-recepcao',
    alt: 'Recepção do consultório médico',
    description: 'Ambiente profissional de atendimento',
    color: '#F97316',
  },
  {
    name: 'ultrasound-patient-scan',
    alt: 'Escâner ultrassônico em execução',
    description: 'Procedimento de diagnóstico por imagem',
    color: '#10B981',
  },
  {
    name: 'stent-vessel-intervention',
    alt: 'Stent colocado em vaso sanguíneo',
    description: 'Intervenção endovascular minimamente invasiva',
    color: '#8B5CF6',
  },
  {
    name: 'medical-device-tubing',
    alt: 'Equipamento médico com tubulação',
    description: 'Dispositivos de suporte e monitoramento',
    color: '#EC4899',
  },
  {
    name: 'surgical-instruments-tray',
    alt: 'Kit cirúrgico organizado',
    description: 'Instrumentação para procedimentos vascular',
    color: '#F43F5E',
  }
] as const;

// 3D Animated Object - must be inside Canvas
function Animated3DModel({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null!);
  const colorObj = new THREE.Color(color);
  
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.5;
      group.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <torusKnotGeometry args={[1.2, 0.35, 64, 8]} />
        <meshStandardMaterial 
          color={colorObj} 
          metalness={0.7} 
          roughness={0.2}
          emissive={colorObj}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

// 3D Model Preview Component
function ModelPreview({ 
  imageName, 
  color,
  onClick 
}: { 
  imageName: string; 
  color: string;
  onClick?: () => void;
}) {
  const [showModel, setShowModel] = useState(false);

  const handleClick = useCallback(() => {
    setShowModel(true);
    if (onClick) onClick();
  }, [onClick]);

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      {!showModel ? (
        // Image preview
        <div className="relative aspect-video cursor-pointer" onClick={handleClick}>
          <img 
            src={`/images/support/${imageName}.webp`} 
            alt={imageName}
            className="h-full w-full object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div className="absolute bottom-4 left-4 right-4 text-center text-white bg-black/50 rounded-lg p-2 text-sm">
            Clique para ver o modelo 3D
          </div>
        </div>
      ) : (
        // 3D Canvas
        <div className="relative h-80 sm:h-[400px] rounded-2xl overflow-hidden">
          <Canvas
            camera={{ position: [0, 0, 6], fov: 50 }}
            className="absolute inset-0"
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} />
            
            <Animated3DModel color={color} />
            
            <OrbitControls enableZoom={true} enablePan={true} />
            <Environment preset="sunset" />
          </Canvas>
          
          <button
            onClick={() => setShowModel(false)}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          >
            <ExternalLink className="h-4 w-4 rotate-45" />
          </button>
        </div>
      )}
    </div>
  );
}

const TOKEN = {
  heading: 'var(--s-color-content-heading)',
  body: 'var(--s-color-content-body)',
  muted: 'var(--s-color-content-muted)',
  inverse: 'var(--s-color-content-inverse)',
  actionPrimary: 'var(--s-color-action-primary)',
  actionGold: 'var(--s-color-action-gold)',
  cardBg: 'var(--c-card-bg)',
  cardBorder: 'var(--c-card-border)',
  cardShadow: 'var(--c-card-shadow)',
  canvas: 'var(--s-color-bg-canvas)',
  surface: 'var(--s-color-bg-surface)',
  border: 'var(--border-subtle)',
} as const;

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-montserrat), var(--font-inter), system-ui, sans-serif',
  color: TOKEN.heading,
};

const bodyStyle: React.CSSProperties = {
  color: TOKEN.body,
};

const mutedStyle: React.CSSProperties = {
  color: TOKEN.muted,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: TOKEN.cardBg,
  border: `1px solid ${TOKEN.cardBorder}`,
  borderRadius: 'var(--c-card-radius)',
  boxShadow: TOKEN.cardShadow,
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
      style={{
        fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
        backgroundColor: 'var(--s-color-bg-brand)',
        color: 'var(--s-color-content-inverse)',
      }}
    >
      {children}
    </span>
  );
}

function Badge({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold"
      style={{
        borderColor: TOKEN.cardBorder,
        backgroundColor: TOKEN.surface,
        color: TOKEN.heading,
      }}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
}

function openWhatsApp(context: string) {
  const lead = {
    name: '',
    email: '',
    whatsapp: '',
    insurance: 'particular' as const,
    interest: '3D Elements',
    sourceSection: '3d-elements',
  };
  window.open(buildWhatsappLink(lead, context), '_blank');
}

export default function ThreeDElementsPage() {
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  
  useEffect(() => {
    const teardown = initSectionTracking();
    return teardown;
  }, []);

  return (
    <main className="min-h-screen overflow-x-clip" style={{ backgroundColor: TOKEN.canvas, color: TOKEN.body }}>
      <Header onOpenCalculator={() => setIsCalculatorModalOpen(true)} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32" style={{ backgroundColor: TOKEN.surface }}>
        <div className="absolute inset-0">
          <video
            src="/images/videos/cardio.webm"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
            className="h-full w-full object-cover"
            style={{ opacity: 0.08 }}
          />
        </div>
        
        <div className="relative mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>
              <Zap className="h-3 w-3 inline mr-1" />
              Elementos 3D
            </Eyebrow>
            <h1 
              className="mt-4 text-display-md" 
              style={{ ...headingStyle }}
            >
              Visualizando os Ativos Visuais em 3D
            </h1>
            <p 
              className="mt-4 max-w-2xl text-body-lg" 
              style={bodyStyle}
            >
              Explore imagens do nosso suporte transformadas em modelos 3D proceduralmente. 
              Cada clique revela um modelo gerado a partir de imagens de referência.
            </p>
          </div>
        </div>
      </section>

      {/* 3D Gallery Section */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: TOKEN.canvas }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Eyebrow>Elementos Visuais</Eyebrow>
            <h2 className="mt-3 text-display-md" style={headingStyle}>
              Nossos Ativos de Suporte em 3D
            </h2>
            <p className="mt-3 max-w-2xl text-body-lg" style={{ ...bodyStyle, margin: '0 auto' }}>
              Imagens que ilustram os nossos procedimentos e ambiente clínico, visualizadas em 3D para uma experiência imersiva.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORT_IMAGES.map((image, index) => (
              <motion.div
                key={image.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div style={{ ...cardStyle, overflow: 'hidden' }}>
                  <ModelPreview 
                    imageName={image.name}
                    color={image.color}
                    onClick={() => trackCtaClick(`3d-${image.name}`, 'Visualizar modelo 3D')}
                  />
                  <div className="p-4">
                    <h3 className="text-heading-3" style={{ ...headingStyle }}>{image.alt}</h3>
                    <p className="mt-1 text-body-small" style={mutedStyle}>{image.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive 3D Preview */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: TOKEN.surface }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>Visualização Interativa</Eyebrow>
              <h2 className="mt-3 text-display-md" style={{ ...headingStyle }}>
                Modelo 3D Demonstrativo
              </h2>
              <p className="mt-4 text-body-lg" style={bodyStyle}>
                Este modelo 3D procedural demonstra os princípios de precisão e estética que aplicamos aos nossos procedimentos.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <span 
                    className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs"
                    style={{
                      backgroundColor: TOKEN.surface,
                      color: TOKEN.heading,
                      border: `1px solid ${TOKEN.cardBorder}`,
                    }}
                  >
                    ✓
                  </span>
                  <span style={bodyStyle}>Modelos gerados proceduralmente para consistência</span>
                </li>
                <li className="flex items-start gap-3">
                  <span 
                    className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs"
                    style={{
                      backgroundColor: TOKEN.surface,
                      color: TOKEN.heading,
                      border: `1px solid ${TOKEN.cardBorder}`,
                    }}
                  >
                    ✓
                  </span>
                  <span style={bodyStyle}>Controle total sobre cores e materiais</span>
                </li>
                <li className="flex items-start gap-3">
                  <span 
                    className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs"
                    style={{
                      backgroundColor: TOKEN.surface,
                      color: TOKEN.heading,
                      border: `1px solid ${TOKEN.cardBorder}`,
                    }}
                  >
                    ✓
                  </span>
                  <span style={bodyStyle}>Otimização para web e performance</span>
                </li>
              </ul>
              <div className="mt-8">
                <EdgeButton
                  variant="primary"
                  onClick={() => {
                    trackCtaClick('3d-elements', 'Agendar Consulta');
                    openWhatsApp('Visitar o consultório para conhecer mais sobre os nossos procedimentos');
                  }}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Agendar Consulta</span>
                </EdgeButton>
              </div>
            </div>
            
            <div className="relative h-[400px] rounded-3xl overflow-hidden border" style={{ borderColor: TOKEN.cardBorder, backgroundColor: TOKEN.cardBg }}>
              <Canvas
                camera={{ position: [0, 0, 6], fov: 50 }}
                className="h-full w-full"
              >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <pointLight position={[-5, -5, -5]} intensity={0.5} />
                
                <mesh rotation={[0.1, 0.3, 0]}>
                  <torusKnotGeometry args={[1.2, 0.35, 64, 8]} />
                  <meshStandardMaterial 
                    color={TOKEN.actionPrimary} 
                    metalness={0.7} 
                    roughness={0.2}
                    emissive={TOKEN.actionPrimary}
                    emissiveIntensity={0.3}
                  />
                </mesh>
                
                <OrbitControls enableZoom={true} enablePan={true} autoRotate autoRotateSpeed={1} />
                <Environment preset="sunset" />
              </Canvas>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="contato-3d" 
        className="relative overflow-hidden py-20 sm:py-28" 
        style={{ backgroundColor: TOKEN.canvas }}
      >
        <div className="absolute inset-0">
          <video
            src="/images/videos/cardio.webm"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
            className="h-full w-full object-cover object-[70%_30%]"
            style={{ opacity: 0.1 }}
          />
        </div>
        
        <div className="relative mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge>
              <ExternalLink className="h-3 w-3 inline mr-1" />
              Experimente o 3D
            </Badge>
            <h2 className="mb-4 mt-3 text-display-md" style={{ ...headingStyle }}>
              Explore Nossos Modelos em 3D
            </h2>
            <p className="mb-6 text-body-lg" style={bodyStyle}>
              Interaja com os nossos modelos 3D e descubra mais sobre os nossos procedimentos médicos.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <EdgeButton
                variant="primary"
                onClick={() => {
                  trackCtaClick('3d-elements', 'Agendar Consulta');
                  openWhatsApp('Consultar sobre visualização 3D');
                }}
              >
                <ImageIcon className="h-4 w-4" />
                <span>Agendar Consulta</span>
              </EdgeButton>
              <EdgeButton
                variant="outline"
                onClick={() => {
                  trackCtaClick('3d-elements', 'Agendar no Calendário');
                  window.open('https://cal.clubemkt.digital', '_blank');
                }}
              >
                <Calendar className="h-4 w-4" />
                <span>Agendar no Calendário</span>
              </EdgeButton>
            </div>
            <p className="mt-4 text-sm" style={mutedStyle}>
              📍 R. Eng. Célso Tôrres, 654 - Graça, Salvador - BA | 📞 (71) 98344-9737
            </p>
          </div>
        </div>
      </section>

      {/* Instructions for img2threejs */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: TOKEN.canvas }}>
        <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Como Gerar Modelos 3D Personalizados</Eyebrow>
            <h2 className="mt-3 text-display-md" style={headingStyle}>
              Gerar Modelos com img2threejs
            </h2>
            <p className="mt-4 text-body-lg" style={bodyStyle}>
              Para gerar modelos 3D personalizados a partir das suas imagens médicas, use a ferramenta img2threejs com um agente de IA com capacidades de visão.
            </p>
            <div className="mt-8 rounded-2xl border p-6 text-left" style={{ borderColor: TOKEN.cardBorder, backgroundColor: TOKEN.cardBg }}>
              <pre className="text-xs" style={{ fontFamily: 'monospace' }}>
{`// Instalar a ferramenta:
npx --yes img2threejs@latest install

// Gerar um modelo a partir de uma imagem:
/img2threejs Rebuild the object in ./raw-masters/images/support/body-vascular-network.png 
  as a procedural Three.js model.
  Keep its proportions, silhouette and colours.`}
              </pre>
              <p className="mt-4 text-sm" style={mutedStyle}>
                Requer um agente de IA com capacidades de visão (Claude Code, Codex, ou OpenCode).
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Modal */}
      {isCalculatorModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsCalculatorModalOpen(false)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold">Calculadora de Risco de TVP</h3>
            <p className="mt-2 text-gray-600">A calculadora será implementada em breve.</p>
            <button
              onClick={() => setIsCalculatorModalOpen(false)}
              className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}