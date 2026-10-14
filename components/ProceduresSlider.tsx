'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination, Autoplay, Navigation } from 'swiper/modules';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CliniqIcon, EdgeButton } from '@/components';
import { PROCEDURES } from '@/lib/procedures';
import { trackCtaClick } from '@/lib/analytics';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const TOKEN = {
  heading: 'var(--s-color-content-heading)',
  body: 'var(--s-color-content-body)',
  muted: 'var(--s-color-content-muted)',
  actionPrimary: 'var(--s-color-action-primary)',
  cardBorder: 'var(--c-card-border)',
  canvas: 'var(--s-color-bg-canvas)',
  surface: 'var(--s-color-bg-surface)',
  border: 'var(--border-subtle)',
} as const;

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-montserrat), var(--font-inter), system-ui, sans-serif',
  color: TOKEN.heading,
};

const bodyStyle: React.CSSProperties = { color: TOKEN.body };
const mutedStyle: React.CSSProperties = { color: TOKEN.muted };

interface ProceduresSliderProps {
  onCtaClick: (sectionId: string, interest: string) => void;
}

const slideVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export function ProceduresSlider({ onCtaClick }: ProceduresSliderProps) {
  return (
    <div className="relative">
      <style>{`
        .procedures-slider .swiper {
          padding-bottom: 3.5rem;
          overflow: visible;
        }
        .procedures-slider .swiper-slide {
          height: auto;
        }
        .procedures-slider .swiper-pagination {
          bottom: 0.5rem !important;
        }
        .procedures-slider .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: var(--s-color-content-muted);
          opacity: 0.3;
          transition: all 0.3s ease;
        }
        .procedures-slider .swiper-pagination-bullet-active {
          width: 28px;
          border-radius: 6px;
          background: var(--s-color-action-primary);
          opacity: 1;
        }
        .procedures-slider .swiper-button-prev,
        .procedures-slider .swiper-button-next {
          color: var(--s-color-action-primary);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--s-color-bg-surface);
          border: 1px solid var(--c-card-border);
          transition: all 0.2s ease;
          top: 42%;
        }
        .procedures-slider .swiper-button-prev:hover,
        .procedures-slider .swiper-button-next:hover {
          background: var(--s-color-action-primary);
          color: #fff;
          border-color: var(--s-color-action-primary);
        }
        .procedures-slider .swiper-button-prev::after,
        .procedures-slider .swiper-button-next::after {
          font-size: 16px;
          font-weight: 700;
        }
        .procedures-slider .swiper-button-prev {
          left: -8px;
        }
        .procedures-slider .swiper-button-next {
          right: -8px;
        }
        @media (max-width: 767px) {
          .procedures-slider .swiper-button-prev,
          .procedures-slider .swiper-button-next {
            display: none;
          }
        }
        @media (min-width: 768px) {
          .procedures-slider .swiper-button-prev {
            left: -16px;
          }
          .procedures-slider .swiper-button-next {
            right: -16px;
          }
        }
      `}</style>

      <Swiper
        modules={[EffectFade, Pagination, Autoplay, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ clickable: true }}
        navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
        autoplay={{ delay: 5000, disableOnInteraction: true, pauseOnMouseEnter: true }}
        slidesPerView={1}
        spaceBetween={24}
        grabCursor={true}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
        className="procedures-slider"
      >
        {PROCEDURES.map((proc) => (
          <SwiperSlide key={proc.slug}>
            <motion.article
              variants={slideVariants}
              className="card-edge group flex h-full flex-col p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span
                  className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-sm"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--s-color-action-primary) 10%, transparent)',
                    color: 'var(--s-color-action-primary)',
                  }}
                >
                  <CliniqIcon
                    name={proc.icon}
                    size={38}
                    className="relative z-10"
                    color="var(--s-color-action-primary)"
                  />
                </span>
                <span
                  className="rounded-sm border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
                  style={{ borderColor: TOKEN.cardBorder, color: TOKEN.muted }}
                >
                  {proc.tag}
                </span>
              </div>

              <h2 className="text-lg font-bold leading-snug" style={headingStyle}>
                {proc.title}
              </h2>
              <div className="mt-1 text-sm font-medium" style={{ color: TOKEN.actionPrimary }}>
                {proc.subtitle}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed" style={bodyStyle}>
                {proc.description}
              </p>

              <div className="mt-6">
                <EdgeButton
                  variant="outline"
                  size="sm"
                  block
                  onClick={() => {
                    trackCtaClick(`procedure:${proc.slug}`, proc.title);
                    onCtaClick(`procedure:${proc.slug}`, proc.title);
                  }}
                  aria-label={`Consultar disponibilidade de ${proc.title}`}
                >
                  <span>Consultar disponibilidade</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </EdgeButton>
              </div>
            </motion.article>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation arrows */}
      <div className="swiper-button-prev" />
      <div className="swiper-button-next" />
    </div>
  );
}
