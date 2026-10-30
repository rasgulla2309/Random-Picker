import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileSpreadsheet, ShieldCheck, Trophy, ArrowRight } from 'lucide-react';

export default function LandingPage({ onStart, onUpload, studentCount }) {
  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '36px 20px 80px',
      width: '100%',
    }}>
      {/* Hero Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'center',
        marginBottom: '64px',
        paddingTop: '20px',
      }}>
        {/* Left Column: Heading and CTAs */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '24px',
              background: 'rgba(255,200,87,0.12)',
              border: '1px solid rgba(255,200,87,0.3)',
              color: '#FFC857',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            <Sparkles size={16} />
            <span>Classroom Challenge System</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: 'Cinzel, Georgia, serif',
              fontSize: 'clamp(36px, 5.5vw, 68px)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '20px',
              letterSpacing: '0.02em',
            }}
          >
            <span style={{ color: '#FFFFFF' }}>RANDOM</span>{' '}
            <span style={{
              background: 'linear-gradient(135deg, #FFE7A0 0%, #FFC857 50%, #FF8A24 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 25px rgba(255,200,87,0.4))',
            }}>
              PICKER
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: '#C7C2DC',
              lineHeight: 1.6,
              marginBottom: '36px',
              maxWidth: '540px',
            }}
          >
            The ultimate fair random student selector for classrooms, auditoriums, and interactive lectures. Built with realistic optical glass physics and cryptographic fairness.
          </motion.p>

          {/* Real Action Buttons (No Demo Data) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '440px' }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onUpload}
              className="btn-gold"
              style={{
                fontSize: '17px',
                padding: '18px 32px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 8px 30px rgba(255,200,87,0.45)',
              }}
            >
              <FileSpreadsheet size={20} color="#0a0a0a" />
              <span>Import Excel / CSV Roster</span>
            </motion.button>

            {studentCount > 0 && (
              <button
                onClick={onStart}
                className="btn-primary"
                style={{
                  fontSize: '15px',
                  padding: '14px 24px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <span>Continue Active Roster ({studentCount} Students)</span>
                <ArrowRight size={17} />
              </button>
            )}
          </motion.div>
        </div>

        {/* Right Column: Realistic 3D Glass Jar & Aura Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          {/* Ambient Radial Spotlight */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            maxWidth: '460px',
            maxHeight: '460px',
            background: 'radial-gradient(circle, rgba(255,200,87,0.18) 0%, rgba(139,92,246,0.15) 45%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }} />

          {/* Realistic Glass Chamber Card */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '420px',
            padding: '36px 28px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
            backdropFilter: 'blur(25px)',
            textAlign: 'center',
          }}>
            <div style={{ marginBottom: '20px' }}>
              <svg viewBox="0 0 200 240" width="180" height="220" style={{ margin: '0 auto', filter: 'drop-shadow(0 15px 35px rgba(255,200,87,0.35))' }}>
                <defs>
                  <linearGradient id="landingGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE7A0" />
                    <stop offset="50%" stopColor="#FFC857" />
                    <stop offset="100%" stopColor="#FF8A24" />
                  </linearGradient>
                  <linearGradient id="landingGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                    <stop offset="20%" stopColor="rgba(255,255,255,0.08)" />
                    <stop offset="80%" stopColor="rgba(255,255,255,0.05)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
                  </linearGradient>
                </defs>
                {/* Brass Lid */}
                <ellipse cx="100" cy="35" rx="55" ry="12" fill="url(#landingGold)" />
                <rect x="50" y="35" width="100" height="16" fill="url(#landingGold)" />
                <ellipse cx="100" cy="51" rx="50" ry="10" fill="#FFE7A0" opacity="0.6" />

                {/* Crystal Bell Body */}
                <path d="M 50 51 C 25 70, 20 200, 100 215 C 180 200, 175 70, 150 51 Z" fill="url(#landingGlass)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                
                {/* Specular Sheen & Caustics */}
                <path d="M 45 75 Q 40 160 55 195" stroke="rgba(255,255,255,0.45)" strokeWidth="6" fill="none" strokeLinecap="round" />
                <path d="M 60 70 Q 56 140 65 185" stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="none" strokeLinecap="round" />

                {/* Realistic Parchment Chits inside */}
                <rect x="75" y="165" width="28" height="18" rx="3" fill="#F8FAFC" transform="rotate(-12 89 174)" opacity="0.95" />
                <rect x="95" y="155" width="30" height="18" rx="3" fill="#FEF08A" transform="rotate(18 110 164)" opacity="0.95" />
                <rect x="65" y="145" width="26" height="17" rx="3" fill="#FED7AA" transform="rotate(-5 78 153)" opacity="0.9" />
                <rect x="100" y="175" width="26" height="16" rx="3" fill="#E2E8F0" transform="rotate(6 113 183)" opacity="0.9" />
              </svg>
            </div>

            <div style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '20px', fontWeight: 800, color: '#FFC857', marginBottom: '6px' }}>
              Optical Glass & Brass Chamber
            </div>
            <div style={{ fontSize: '13px', color: '#B8B2CC' }}>
              Physics-inspired transparent vessel holding folded parchment chits
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feature Highlights Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        marginBottom: '56px',
      }}>
        <FeatureCard
          icon={<ShieldCheck size={26} color="#34D399" />}
          title="Cryptographic Fairness"
          desc="Employs Web Crypto API (crypto.getRandomValues) with rejection sampling. Every single student has a precisely equal probability of selection."
        />
        <FeatureCard
          icon={<FileSpreadsheet size={26} color="#8B5CF6" />}
          title="Excel / CSV Auto-Parser"
          desc="Drag and drop any real spreadsheet. Automatic name column detection, whitespace sanitation, duplicate inspection, and manual override controls."
        />
        <FeatureCard
          icon={<Trophy size={26} color="#FFC857" />}
          title="Projector-Optimized UI"
          desc="Engineered specifically for classroom smartboards and 4K auditorium projectors with high-contrast text readable from any desk distance."
        />
      </div>

      {/* How it works banner */}
      <div className="glass-card" style={{ padding: '32px 28px', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '22px', fontWeight: 800, color: '#FFC857', marginBottom: '24px' }}>
          CLASSROOM DRAW WORKFLOW
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          textAlign: 'left',
        }}>
          <StepCard num="01" title="Import Roster" desc="Upload your classroom .xlsx, .xls, or .csv spreadsheet." />
          <StepCard num="02" title="Verify & Pack" desc="Watch parchment chits fold and deposit into the realistic glass jar." />
          <StepCard num="03" title="Detonate Blast" desc="Spark the pyrotechnic fuse for a thrilling cinematic countdown." />
          <StepCard num="04" title="Celebrate Winner" desc="Reveal the lucky student in golden 3D trophy glory with speech." />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-card" style={{
      padding: '24px',
      borderRadius: '20px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.09)',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '13px', color: '#B8B2CC', lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

function StepCard({ num, title, desc }) {
  return (
    <div style={{
      padding: '18px 20px',
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        fontFamily: 'Cinzel, Georgia, serif',
        fontSize: '24px',
        fontWeight: 900,
        color: '#FFC857',
        marginBottom: '6px',
      }}>
        {num}
      </div>
      <div style={{ fontWeight: 700, fontSize: '15px', color: '#FFFFFF', marginBottom: '6px' }}>{title}</div>
      <div style={{ fontSize: '12px', color: '#B8B2CC', lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}
