"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, TrendingUp, Award } from "lucide-react";
import gsap from "gsap";

interface CompletionScreenProps {
  onReturnToStart: () => void;
}

export default function CompletionScreen({ onReturnToStart }: CompletionScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const checkmarkRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate logo first
    if (logoRef.current) {
      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0
      );
    }

    // Checkmark animation - scale in with bounce
    if (checkmarkRef.current) {
      tl.fromTo(
        checkmarkRef.current,
        { scale: 0, rotation: -180 },
        { 
          scale: 1, 
          rotation: 0, 
          duration: 1, 
          ease: "elastic.out(1, 0.5)" 
        },
        0.3
      );
    }

    // Title cascade
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.6
      );
    }

    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.8
      );
    }

    // Cards animation - staggered
    const cards = [card1Ref.current, card2Ref.current, card3Ref.current];
    cards.forEach((card, index) => {
      if (card) {
        tl.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7 },
          1 + index * 0.15
        );
      }
    });

    // Button animation
    if (buttonRef.current) {
      tl.fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6 },
        1.5
      );
    }

    // Continuous floating animation for cards
    cards.forEach((card, index) => {
      if (card) {
        gsap.to(card, {
          y: -10,
          duration: 2 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2 + index * 0.2,
        });
      }
    });

  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100"
    >
      {/* Fixed Logo - Top Left */}
      <div 
        ref={logoRef}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center gap-3 opacity-0"
      >
        <img
          src="/societe-des-boissons-du-maroc--600-removebg-preview.png"
          alt="Société des Boissons du Maroc"
          className="h-12 md:h-16 w-auto object-contain drop-shadow-lg"
        />
        <div className="h-12 md:h-16 w-px bg-gray-400/50"></div>
        <span className="text-xl md:text-2xl font-bold drop-shadow-md">
          <span className="text-blue-600">Enquête</span>
          <span className="text-purple-600"> IT</span>
        </span>
      </div>

      {/* Decorative Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Illustration/Icons */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Large Checkmark Circle */}
              <div ref={checkmarkRef} className="relative z-10 mx-auto w-48 h-48 mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                  <CheckCircle2 className="w-24 h-24 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              </div>

              {/* Floating Cards */}
              <div className="relative">
                {/* Card 1 - Top */}
                <div
                  ref={card1Ref}
                  className="absolute -top-8 left-8 bg-white rounded-2xl p-4 shadow-xl border-2 border-blue-200 opacity-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 rounded-lg p-2">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Réponses</div>
                      <div className="text-lg font-bold text-gray-900">23/23</div>
                    </div>
                  </div>
                </div>

                {/* Card 2 - Middle Right */}
                <div
                  ref={card2Ref}
                  className="absolute top-16 -right-4 bg-white rounded-2xl p-4 shadow-xl border-2 border-purple-200 opacity-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500 rounded-lg p-2">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Progression</div>
                      <div className="text-lg font-bold text-gray-900">100%</div>
                    </div>
                  </div>
                </div>

                {/* Card 3 - Bottom */}
                <div
                  ref={card3Ref}
                  className="absolute top-40 left-4 bg-white rounded-2xl p-4 shadow-xl border-2 border-green-200 opacity-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 rounded-lg p-2">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Statut</div>
                      <div className="text-lg font-bold text-gray-900">Terminé</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Text Content */}
          <div className="text-left space-y-6">
            <div ref={titleRef} className="opacity-0">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Merci pour
                </span>
                <br />
                <span className="text-gray-900">Votre Participation!</span>
              </h1>
              <div className="h-2 w-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>

            <div ref={subtitleRef} className="opacity-0 space-y-4">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                Votre avis est <span className="text-blue-600 font-bold">précieux</span> pour améliorer nos services IT.
              </p>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                <p className="text-gray-800 leading-relaxed">
                  ✅ <strong>Vos réponses ont été enregistrées</strong>
                  <br />
                  📊 Nos équipes analyseront vos retours
                  <br />
                  🚀 Nous travaillons à améliorer votre expérience IT
                </p>
              </div>

              <p className="text-base text-gray-600">
                L'équipe DSI vous remercie pour le temps consacré à cette enquête.
              </p>
            </div>

            {/* Action Button */}
            <button
              ref={buttonRef}
              onClick={onReturnToStart}
              className="opacity-0 group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Retour à l'accueil
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
