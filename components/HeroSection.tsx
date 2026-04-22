'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  backgroundImage?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  logoSvg?: React.ReactNode;
}

export function HeroSection({
  headline = 'Especialista em Angiologia e Cirurgia Vascular',
  subheadline = 'Cuidado de excelência para sua saúde vascular em Salvador',
  backgroundImage = 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
  primaryCTA = { label: 'Agendar Consulta', href: '/agendamento' },
  secondaryCTA = { label: 'Saiba Mais', href: '/sobre' },
  logoSvg,
}: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate parallax offset based on scroll
  const parallaxOffset = scrollY * 0.5;

  // Calculate logo rotation based on mouse position
  const logoRotation = (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth : 0) / 2) * 0.01;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: backgroundImage,
      }}
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #14B8A6 0%, transparent 50%)',
          transform: `translateY(${parallaxOffset}px)`,
        }}
      />

      {/* Content Container */}
      <motion.div
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-md py-20 text-center sm:px-lg md:px-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        {logoSvg && (
          <motion.div
            className="mb-lg sm:mb-xl"
            variants={logoVariants}
            style={{
              rotate: logoRotation,
            }}
          >
            {logoSvg}
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          className="mb-md max-w-4xl text-3xl font-bold text-neutral-light sm:text-4xl md:text-display-lg lg:mb-lg"
          variants={itemVariants}
        >
          {headline}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mb-lg max-w-2xl text-sm text-neutral-medium sm:text-base md:text-body-lg lg:mb-2xl"
          variants={itemVariants}
        >
          {subheadline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col gap-md sm:gap-lg sm:flex-row"
          variants={itemVariants}
        >
          {/* Primary CTA */}
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
          >
            <Link
              href={primaryCTA.href}
              className="inline-flex items-center justify-center rounded-lg bg-surgical-teal px-lg py-md font-semibold text-dark-elevated transition-all duration-300 hover:bg-surgical-teal-dark sm:px-2xl sm:py-lg"
            >
              {primaryCTA.label}
            </Link>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
          >
            <Link
              href={secondaryCTA.href}
              className="inline-flex items-center justify-center rounded-lg border-2 border-surgical-teal px-lg py-md font-semibold text-surgical-teal transition-all duration-300 hover:bg-surgical-teal hover:text-dark-elevated sm:px-2xl sm:py-lg"
            >
              {secondaryCTA.label}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-lg left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-md">
          <p className="text-xs text-neutral-medium sm:text-sm">Scroll para explorar</p>
          <svg
            className="h-5 w-5 text-surgical-teal sm:h-6 sm:w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
