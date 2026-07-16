/**
 * Premium Interactive Birthday Experience
 * Phase 1: Foundations & Cinematic Intro Screen
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize elements
  const enterBtn = document.getElementById('enter-btn');
  const introSection = document.getElementById('intro-section');
  const ambientGlow = document.getElementById('ambient-glow');
  const particleCanvas = document.getElementById('particle-canvas');

  // Check accessibility preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     AMBIENT MOUSE TRACKING SPOTLIGHT (EASED)
     ========================================================================== */
  let targetMouseX = window.innerWidth / 2;
  let targetMouseY = window.innerHeight / 2;
  let currentMouseX = targetMouseX;
  let currentMouseY = targetMouseY;
  const glowEasing = 0.08; // Smooth inertia factor

  // Initial setup for ambient center glow
  document.body.style.setProperty('--mouse-x', `${currentMouseX}px`);
  document.body.style.setProperty('--mouse-y', `${currentMouseY}px`);

  if (!prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    });
  }

  function updateGlowPosition() {
    if (prefersReducedMotion) return;

    // Apply easing (lerp)
    currentMouseX += (targetMouseX - currentMouseX) * glowEasing;
    currentMouseY += (targetMouseY - currentMouseY) * glowEasing;

    document.body.style.setProperty('--mouse-x', `${currentMouseX}px`);
    document.body.style.setProperty('--mouse-y', `${currentMouseY}px`);

    requestAnimationFrame(updateGlowPosition);
  }
  
  if (!prefersReducedMotion) {
    requestAnimationFrame(updateGlowPosition);
  }

  /* ==========================================================================
     CINEMATIC PARTICLE CANVAS
     ========================================================================== */
  let particlesArray = [];
  let animationFrameId;
  const ctx = particleCanvas.getContext('2d');

  function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    initParticles();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * particleCanvas.width;
      this.y = Math.random() * particleCanvas.height;
      this.size = Math.random() * 1.8 + 0.6; // Slightly larger, more visible golden dust
      this.speedY = -(Math.random() * 0.35 + 0.05); // Slow vertical drift
      this.speedX = (Math.random() * 0.15 - 0.075); // Subtle horizontal waving
      this.opacity = Math.random() * 0.5 + 0.35; // Brighter baseline opacity
      this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
      this.pulseSpeed = Math.random() * 0.004 + 0.001; // Slightly faster sparkle pulse
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      // Wrap particles around borders
      if (this.y < 0) {
        this.y = particleCanvas.height;
        this.x = Math.random() * particleCanvas.width;
      }
      if (this.x < 0 || this.x > particleCanvas.width) {
        this.speedX = -this.speedX;
      }

      // Shimmering pulse effect (brighter boundaries)
      this.opacity += this.pulseSpeed * this.pulseDirection;
      if (this.opacity >= 0.85) {
        this.pulseDirection = -1;
      } else if (this.opacity <= 0.2) {
        this.pulseDirection = 1;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(197, 160, 89, ${this.opacity})`; // Luxury Gold particle color (Ivory theme)
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    // Restrained density: 1 particle per 25000 square pixels
    const numberOfParticles = Math.floor((particleCanvas.width * particleCanvas.height) / 25000);
    const particleCount = Math.min(numberOfParticles, 60); // Cap at 60 particles for clean minimalist aesthetic

    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    animationFrameId = requestAnimationFrame(animateParticles);
  }

  // Setup Particles if user does not prefer reduced motion
  if (!prefersReducedMotion) {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();
  } else {
    // If reduced motion is preferred, render static starry background once
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    ctx.fillStyle = 'rgba(197, 160, 89, 0.55)'; // Brighter fallback particles
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * particleCanvas.width;
      const y = Math.random() * particleCanvas.height;
      const size = Math.random() * 1.8 + 0.6; // Matched size
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ==========================================================================
     TYPING TEXT EFFECT
     ========================================================================== */
  const typingTextSpan = document.getElementById('typing-text');
  const words = ["brother", "junaid", "pravaasii 🤭"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 150;

  function type() {
    if (!typingTextSpan) return;
    const currentWord = words[wordIndex];
    const charArray = [...currentWord]; // Emoji-safe character array handling surrogate pairs
    
    if (isDeleting) {
      typingTextSpan.textContent = charArray.slice(0, charIndex - 1).join('');
      charIndex--;
      typingSpeed = 80;
    } else {
      typingTextSpan.textContent = charArray.slice(0, charIndex + 1).join('');
      charIndex++;
      typingSpeed = 150 - Math.random() * 50; // Random variable typing speed
    }

    if (!isDeleting && charIndex === charArray.length) {
      typingSpeed = 2000; // Wait 2s on full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length; // Cycle word
      typingSpeed = 500; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  // Delay typing startup to align with header entry fade-in
  if (typingTextSpan) {
    setTimeout(type, 1200);
  }

  /* ==========================================================================
     TRANSITION: ENTER EXPERIENCE (PHASE 1 TO PHASE 2)
     ========================================================================== */
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      // 1. Trigger hero fade/scale exit
      introSection.classList.add('intro-exit');

      // 2. Dim stardust particles to prevent visual clutter in text rooms
      if (particleCanvas) {
        particleCanvas.style.transition = 'opacity 2.0s ease';
        particleCanvas.style.opacity = '0.2';
      }

      // 3. Mount Phase 2 Section
      setTimeout(() => {
        introSection.style.display = 'none';
        
        const voicesSection = document.getElementById('voices-section');
        if (voicesSection) {
          voicesSection.style.display = 'flex';
          // Triggers browser reflow then applies entrance styling
          voicesSection.offsetHeight; 
          
          // FUTURE TRIGGER: Hook any global background audio shifts here
        }
      }, 1500); // Syncs with 1.5s CSS transition
    });
  }

  /* ==========================================================================
     PHASE 2: VOICES OF LOVE - STAGE TRANSITION
     ========================================================================== */
  const voicesContinueBtn = document.getElementById('voices-continue-btn');
  const voicesIntro = document.getElementById('voices-intro');
  const voicesGallery = document.getElementById('voices-gallery');
  const voiceNamesList = document.getElementById('voice-names-list');
  const activeCardContainer = document.getElementById('active-card-container');

  if (voicesContinueBtn && voicesIntro && voicesGallery) {
    voicesContinueBtn.addEventListener('click', () => {
      // Fade out Stage A
      voicesIntro.classList.add('exit');
      
      // Reveal Stage B Audio Gallery
      setTimeout(() => {
        voicesIntro.classList.add('hidden');
        voicesGallery.classList.remove('hidden');
        voicesGallery.classList.add('enter-active');
        
        // Resize canvas elements once visible so canvas widths align with grids
        resizeWaveformCanvases();
      }, 1000); // Match CSS transition duration
    });
  }

  /* ==========================================================================
     PHASE 2: VOICE MESSAGE PLAYERS & MUTUAL EXCLUSION
     ========================================================================== */
  const voiceCards = document.querySelectorAll('.voice-card');
  const voiceNameItems = document.querySelectorAll('.voice-name-item');
  const toMomentsBtn = document.getElementById('to-moments-btn');
  let activeFallbackInterval = null;
  let activeFallbackCard = null;
  let fallbackTime = 0;
  let audioCtx = null;
  let activeOscillators = [];
  let slideshowInterval = null;
  let activeSlideshowCard = null;
  let autoCloseTimeout = null;

  // Format seconds to M:SS
  function formatTime(secs) {
    if (isNaN(secs) || secs < 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // Web Audio Failsafe Chime Synthesizer
  function playFallbackChime() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) {
        audioCtx = new AudioContextClass();
      }
      
      const now = audioCtx.currentTime;
      // Ambient Gold chime chord: G4, B4, D5, G5
      const freqs = [392.00, 493.88, 587.33, 783.99]; 
      
      freqs.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.18);
        
        // Lowpass filter for smooth premium warmth
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        
        // Slow swell, organic decay envelope
        gainNode.gain.setValueAtTime(0, now + index * 0.18);
        gainNode.gain.linearRampToValueAtTime(0.12, now + index * 0.18 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.18 + 2.5);
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(now + index * 0.18);
        osc.stop(now + index * 0.18 + 2.5);
        
        activeOscillators.push(osc);
        
        // Clean up node when stopped
        setTimeout(() => {
          activeOscillators = activeOscillators.filter(item => item !== osc);
        }, (index * 0.18 + 2.5) * 1000);
      });
    } catch (err) {
      console.warn("Dynamic synthesizer chiming unsupported by device:", err);
    }
  }

  // Stop currently playing chimes immediately
  function stopActiveOscillators() {
    activeOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (err) {}
    });
    activeOscillators = [];
  }

  // Failsafe Interval Swell Mocking
  function resumeFallbackInterval(card, durationSec) {
    stopActiveFallback();
    
    activeFallbackCard = card;
    const slider = card.querySelector('.timeline-slider');
    const fill = card.querySelector('.progress-bar-fill');
    const curTimeSpan = card.querySelector('.current-time');
    
    if (fallbackTime === 0) {
      playFallbackChime();
    }
    
    activeFallbackInterval = setInterval(() => {
      fallbackTime += 0.1;
      if (fallbackTime >= durationSec) {
        // Playback completed
        slider.value = 100;
        fill.style.width = '100%';
        curTimeSpan.textContent = formatTime(durationSec);
        
        stopActiveFallback();
        fallbackTime = 0;
        
        handleAudioFinished(card);
      } else {
        const progress = (fallbackTime / durationSec) * 100;
        slider.value = progress;
        fill.style.width = `${progress}%`;
        curTimeSpan.textContent = formatTime(fallbackTime);
        
        // Trigger middle ambient chime loop
        if (Math.abs(fallbackTime - 7.5) < 0.05) {
          playFallbackChime();
        }
      }
    }, 100);
  }

  function stopActiveFallback() {
    if (activeFallbackInterval) {
      clearInterval(activeFallbackInterval);
      activeFallbackInterval = null;
    }
    activeFallbackCard = null;
  }

  function resetCardToIdle(card) {
    card.classList.remove('playing');
    const audio = card.querySelector('.voice-audio');
    
    if (audio && audio.dataset.failed !== "true" && audio.src && !audio.src.endsWith('/')) {
      audio.pause();
    } else {
      stopActiveFallback();
    }
    
    // Resume falling petals on pause/reset
    if (window.ambientPetals) {
      window.ambientPetals.resume();
    }
  }

  function pauseAllCardsExcept(activeCard) {
    voiceCards.forEach(card => {
      if (card !== activeCard) {
        resetCardToIdle(card);
      }
    });
    stopActiveFallback();
    stopActiveOscillators();
  }

  // Slideshow management
  function startCardSlideshow(card) {
    stopCardSlideshow();
    activeSlideshowCard = card;
    const slides = card.querySelectorAll('.memory-slide');
    if (slides.length <= 1) return;
    
    let currentIdx = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    if (currentIdx === -1) currentIdx = 0;
    
    slideshowInterval = setInterval(() => {
      if (!card.classList.contains('playing')) return; // Pause advancing if paused
      
      slides[currentIdx].classList.remove('active');
      currentIdx = (currentIdx + 1) % slides.length;
      slides[currentIdx].classList.add('active');
    }, 3500);
  }

  function stopCardSlideshow() {
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
    }
    activeSlideshowCard = null;
  }

  function resetCardSlides(card) {
    const slides = card.querySelectorAll('.memory-slide');
    slides.forEach((slide, idx) => {
      if (idx === 0) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }

  // Card expansion transitions
  function expandCard(card) {
    // Fade out name list
    voiceNamesList.classList.add('hidden');
    if (toMomentsBtn) {
      toMomentsBtn.classList.add('hidden');
    }
    
    if (autoCloseTimeout) {
      clearTimeout(autoCloseTimeout);
      autoCloseTimeout = null;
    }
    
    // Display active card container
    activeCardContainer.classList.remove('hidden');
    
    // Hide all other cards
    voiceCards.forEach(c => {
      if (c !== card) {
        c.classList.remove('active', 'playing');
        c.style.display = 'none';
        resetCardSlides(c);
      }
    });
    
    card.style.display = 'block';
    card.offsetHeight; // force reflow
    card.classList.add('active');
    
    // Warm theme overlay
    document.body.classList.add('warm-theme');
    
    // Auto start audio
    playVoiceCard(card);
    
    // Auto start slideshow
    startCardSlideshow(card);
    
    // Force resize canvases
    setTimeout(() => {
      resizeWaveformCanvases();
    }, 50);
  }

  function collapseCard(card) {
    resetCardToIdle(card);
    stopCardSlideshow();
    stopActiveOscillators();
    
    if (autoCloseTimeout) {
      clearTimeout(autoCloseTimeout);
      autoCloseTimeout = null;
    }
    
    card.classList.remove('active', 'playing');
    activeCardContainer.classList.add('hidden');
    document.body.classList.remove('warm-theme');
    
    // Resume falling petals when card collapses
    if (window.ambientPetals) {
      window.ambientPetals.resume();
    }
    
    // Wait for fadeout before returning list
    setTimeout(() => {
      card.style.display = 'none';
      resetCardSlides(card);
      voiceNamesList.classList.remove('hidden');
      if (toMomentsBtn) {
        toMomentsBtn.classList.remove('hidden');
      }
    }, 600);
  }

  function playVoiceCard(card) {
    const audio = card.querySelector('.voice-audio');
    const slider = card.querySelector('.timeline-slider');
    const fill = card.querySelector('.progress-bar-fill');
    const curTimeSpan = card.querySelector('.current-time');
    const durTimeSpan = card.querySelector('.duration-time');
    
    if (autoCloseTimeout) {
      clearTimeout(autoCloseTimeout);
      autoCloseTimeout = null;
    }
    
    pauseAllCardsExcept(card);
    card.classList.add('active', 'playing');
    startCardSlideshow(card);
    
    // Pause falling petals during audio playback
    if (window.ambientPetals) {
      window.ambientPetals.pause();
    }
    
    let useFallback = audio.dataset.failed === "true" || !audio.src || audio.src.endsWith('/');
    
    if (useFallback) {
      console.log("Playing fallback synth chimes because useFallback is true. failed:", audio.dataset.failed, "src:", audio.src);
      durTimeSpan.textContent = "0:15";
      resumeFallbackInterval(card, 15);
      return;
    }
    
    // Explicitly set volume to maximum to ensure voice comes out well
    audio.volume = 1.0;
    
    console.log("Attempting to play audio file:", audio.src);
    audio.play().then(() => {
      console.log("Audio playback started successfully for:", audio.src);
    }).catch(err => {
      console.warn("Local audio file play failed, triggering failsafe synth chimes:", err);
      audio.dataset.failed = "true";
      durTimeSpan.textContent = "0:15";
      resumeFallbackInterval(card, 15);
    });
  }

  function handleAudioFinished(card) {
    card.classList.remove('playing');
    stopCardSlideshow();
    stopActiveOscillators();
    
    // Resume falling petals when audio finishes
    if (window.ambientPetals) {
      window.ambientPetals.resume();
    }
    
    // Wait 2.5s before collapsing card automatically
    autoCloseTimeout = setTimeout(() => {
      collapseCard(card);
    }, 2500);
  }

  // Hook List click items
  voiceNameItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.dataset.targetId;
      const targetCard = document.querySelector(`.voice-card[data-voice-id="${targetId}"]`);
      if (targetCard) {
        expandCard(targetCard);
      }
    });
  });

  // Initialize Card Controls
  voiceCards.forEach(card => {
    const audio = card.querySelector('.voice-audio');
    const playBtn = card.querySelector('.play-btn');
    const closeBtn = card.querySelector('.card-close-btn');
    const slider = card.querySelector('.timeline-slider');
    const fill = card.querySelector('.progress-bar-fill');
    const curTimeSpan = card.querySelector('.current-time');
    const durTimeSpan = card.querySelector('.duration-time');

    // Close button click
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        collapseCard(card);
      });
    }

    // Handle audio metadata load
    audio.addEventListener('loadedmetadata', () => {
      durTimeSpan.textContent = formatTime(audio.duration);
    });
    
    // Failsafe in case file is cached or loads instantly
    if (audio.readyState >= 1) {
      durTimeSpan.textContent = formatTime(audio.duration);
    }

    // Handle play button clicks
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (card.classList.contains('playing')) {
        // Paused state
        card.classList.remove('playing');
        stopActiveOscillators();
        
        if (audio.dataset.failed !== "true" && audio.src && !audio.src.endsWith('/')) {
          audio.pause();
        } else {
          stopActiveFallback(); // Pause fallback timer
        }
      } else {
        // Play state
        playVoiceCard(card);
      }
    });

    // Real audio time updates
    audio.addEventListener('timeupdate', () => {
      if (card.classList.contains('playing') && audio.dataset.failed !== "true") {
        const progress = (audio.currentTime / audio.duration) * 100;
        slider.value = progress;
        fill.style.width = `${progress}%`;
        curTimeSpan.textContent = formatTime(audio.currentTime);
      }
    });

    // Real audio finished playing
    audio.addEventListener('ended', () => {
      handleAudioFinished(card);
    });

    // Scrubbing input changes (timeline drag support)
    slider.addEventListener('input', () => {
      const percent = parseFloat(slider.value);
      fill.style.width = `${percent}%`;
      
      const isFallback = audio.dataset.failed === "true" || !audio.src || audio.src.endsWith('/');
      
      if (isFallback) {
        fallbackTime = (percent / 100) * 15;
        curTimeSpan.textContent = formatTime(fallbackTime);
      } else {
        if (audio.duration) {
          audio.currentTime = (percent / 100) * audio.duration;
          curTimeSpan.textContent = formatTime(audio.currentTime);
        }
      }
    });
  });

  /* ==========================================================================
     PHASE 2: CANVAS DUAL WAVEFORM VISUALIZER
     ========================================================================== */
  const canvasList = [];
  
  voiceCards.forEach(card => {
    const canvas = card.querySelector('.waveform-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvasList.push({
        card: card,
        canvas: canvas,
        ctx: ctx,
        phase: Math.random() * 100, // Staggered starting point
        amplitude: 0
      });
    }
  });

  function resizeWaveformCanvases() {
    canvasList.forEach(item => {
      const parent = item.canvas.parentElement;
      if (parent) {
        item.canvas.width = parent.clientWidth;
      }
    });
  }

  // Handle resize events to recalculate canvas widths
  window.addEventListener('resize', resizeWaveformCanvases);

  // Global waveform render loop
  function drawWaveforms() {
    const voicesSection = document.getElementById('voices-section');
    if (voicesSection && voicesSection.style.display === 'none') {
      requestAnimationFrame(drawWaveforms);
      return;
    }

    canvasList.forEach(item => {
      const { card, canvas, ctx } = item;
      
      // Stop rendering/clearing if the card is not even active!
      if (!card.classList.contains('active')) {
        return;
      }
      
      const width = canvas.width;
      const height = canvas.height;
      
      const isActive = card.classList.contains('playing');
      
      // Fluid amplitude adjustments (resting vs active frequencies)
      const targetAmp = isActive ? 12 : 2.5;
      item.amplitude += (targetAmp - item.amplitude) * 0.1;
      
      // Frequency speed adjustment
      item.phase += isActive ? 0.12 : 0.03;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw quiet baseline
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.strokeStyle = 'rgba(44, 33, 26, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Gold Primary Wave
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      const goldGradient = ctx.createLinearGradient(0, 0, width, 0);
      goldGradient.addColorStop(0, 'rgba(197, 160, 89, 0.1)');
      goldGradient.addColorStop(0.5, `rgba(197, 160, 89, ${isActive ? 0.8 : 0.25})`);
      goldGradient.addColorStop(1, 'rgba(197, 160, 89, 0.1)');
      ctx.strokeStyle = goldGradient;
      
      for (let i = 0; i < width; i++) {
        const angle = (i / width) * Math.PI * 3.5 + item.phase;
        const offset = Math.sin(angle) * item.amplitude + Math.cos(angle * 1.8) * (item.amplitude * 0.4);
        const y = height / 2 + offset;
        
        if (i === 0) {
          ctx.moveTo(i, y);
        } else {
          ctx.lineTo(i, y);
        }
      }
      ctx.stroke();
      
      // Complementary Soft Sandstone Wave (only active during playback)
      if (isActive) {
        ctx.beginPath();
        ctx.lineWidth = 1.0;
        const sandstoneGradient = ctx.createLinearGradient(0, 0, width, 0);
        sandstoneGradient.addColorStop(0, 'rgba(164, 141, 120, 0.05)');
        sandstoneGradient.addColorStop(0.5, 'rgba(164, 141, 120, 0.35)');
        sandstoneGradient.addColorStop(1, 'rgba(164, 141, 120, 0.05)');
        ctx.strokeStyle = sandstoneGradient;
        
        for (let i = 0; i < width; i++) {
          const angle = (i / width) * Math.PI * 4 - item.phase * 0.8;
          const offset = Math.sin(angle * 1.5) * (item.amplitude * 0.65) + Math.cos(angle * 2.2) * (item.amplitude * 0.2);
          const y = height / 2 + offset;
          
          if (i === 0) {
            ctx.moveTo(i, y);
          } else {
            ctx.lineTo(i, y);
          }
        }
        ctx.stroke();
      }
    });
    
    requestAnimationFrame(drawWaveforms);
  }

  // Lightbox click-to-enlarge for slideshow pictures
  const photoLightbox = document.getElementById('photo-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (photoLightbox && lightboxImg && lightboxClose) {
    document.querySelectorAll('.memory-slide').forEach(slide => {
      slide.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxImg.src = slide.src;
        
        const card = slide.closest('.voice-card');
        const name = card ? card.querySelector('.voice-card-expanded-name').textContent : 'Memory';
        if (lightboxCaption) {
          lightboxCaption.textContent = `${name}'s Shared Moment`;
        }
        
        photoLightbox.classList.add('active');
      });
    });

    // Close on click close button
    lightboxClose.addEventListener('click', () => {
      photoLightbox.classList.remove('active');
    });

    // Close on clicking overlay background
    photoLightbox.addEventListener('click', () => {
      photoLightbox.classList.remove('active');
    });
  }

  // Start global waveform renders
  drawWaveforms();

  /* ==========================================================================
     PHASE 3: MOMENTS GALLERY & COLLAGE WALL (CHAPTER III)
     ========================================================================== */
  
  const momentsSection = document.getElementById('moments-section');
  const voicesSection = document.getElementById('voices-section');
  
  if (toMomentsBtn && momentsSection && voicesSection) {
    toMomentsBtn.addEventListener('click', () => {
      // 1. Fade out Phase 2 voices section
      voicesSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      voicesSection.style.opacity = '0';
      voicesSection.style.transform = 'translateY(-20px)';
      
      // Stop any active audio and fallbacks on navigation
      document.querySelectorAll('.voice-card').forEach(card => {
        resetCardToIdle(card);
      });
      
      setTimeout(() => {
        voicesSection.style.display = 'none';
        
        // 2. Reveal Phase 3 Moments section
        momentsSection.style.display = 'flex';
        momentsSection.style.flexDirection = 'column';
        momentsSection.style.alignItems = 'center';
        momentsSection.style.opacity = '0';
        momentsSection.style.transform = 'translateY(20px)';
        
        // Trigger layout reflow
        momentsSection.offsetHeight;
        
        // Animate in Chapter III
        momentsSection.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        momentsSection.style.opacity = '1';
        momentsSection.style.transform = 'translateY(0)';
        
        // Transition theme to dark museum spotlight wall
        document.body.classList.remove('warm-theme');
        document.body.classList.add('museum-theme');
        
        // Disable falling flower petals for the quiet dark gallery room
        if (window.ambientPetals) {
          window.ambientPetals.disable();
        }
      }, 800);
    });
  }

  // Curated list of all 33 photos from brother and family directories
  const allMomentsImages = [
    { src: "assests/images/brother/WhatsApp Image 2026-07-14 at 09.20.43.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-14 at 09.20.52.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-14 at 09.20.58.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-14 at 09.20.59 (1).webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-14 at 09.20.59.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-14 at 09.21.01 (1).webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-14 at 09.21.01.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-14 at 09.21.02.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-14 at 09.21.03.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-14 at 09.21.04.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.45.47.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.45.48.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.21.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.23.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.25.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.27.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.28.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.29.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.31.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.32.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.33.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.34.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.35.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.36.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.42.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.43.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.45.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.46.webp" },
    { src: "assests/images/brother/WhatsApp Image 2026-07-15 at 11.49.48.webp" },
    // Family files included
    { src: "assests/images/family/PXL_20251207_085814253.PORTRAIT.webp.webp" },
    { src: "assests/images/family/PXL_20251207_085920416.PORTRAIT.webp.webp" },
    { src: "assests/images/family/PXL_20251207_085952225.PORTRAIT.webp.webp" },
    { src: "assests/images/family/WhatsApp Image 2026-07-15 at 20.25.04.webp" }
  ];

  const momentsWall = document.getElementById('moments-wall');
  const memoryViewer = document.getElementById('memory-viewer');
  const viewerImg = document.getElementById('viewer-img');
  const viewerTitle = document.getElementById('viewer-title');
  const viewerCaption = document.getElementById('viewer-caption');
  const viewerCloseBtn = document.getElementById('viewer-return-btn');
  const memoryViewerClose = document.getElementById('memory-viewer-close');
  
  const momentsCaptions = [
    "Whoo araapath! 😎",            // 1
    "Suntharan! 😍",                 // 2
    "Aa nilp kandooo! 👀",           // 3
    "Aaahaa! ✨",                    // 4
    "Gaayagan! 🎤",                  // 5
    "Enta rasam! 🥰",                // 6
    "Eetha style! 🔥",               // 7
    "Model Pinjuu! 📸",              // 8
    "Marakaan patoo? 🥺",            // 9
    "Yooo! 🤘",                      // 10
    "Life with pinjuu! 💞",          // 11
    "Eetha monjj! 👑",               // 12
    "Ooormayundoo? 🤔",              // 13
    "Chirii! 😁",                    // 14
    "Whooo araapath! 😎",            // 15
    "Sundharan! 😍",                 // 16
    "Whaaah sundaram! ✨",           // 17
    "Hmmmmm... 😏",                  // 18
    "Aa chiri! 😊",                  // 19
    "Luxury life! 💎",               // 20
    "Aah aaa! 😮",                   // 21
    "Good times 🌸",                 // 22
    "Ippo oru Dubai kaaraan ayalloo! ✈️", // 23
    "So much laughter! 😂",          // 24
    
    // Fallback/Cycle variations for remaining brother photos
    "Whoo araapath! 😎",            // 25
    "Suntharan! 😍",                 // 26
    "Aa nilp kandooo! 👀",           // 27
    "Aaahaa! ✨",                    // 28
    "Good times 🌸",                 // 29
    
    // Family photos explicitly labeled "With family! ❤️"
    "With family! ❤️",               // 30
    "With family! ❤️",               // 31
    "With family! ❤️",               // 32
    "With family! ❤️"                // 33
  ];

  // Render polaroids dynamically into memory wall
  if (momentsWall) {
    momentsWall.innerHTML = '';
    
    allMomentsImages.forEach((item, index) => {
      const rotation = (Math.random() * 8 - 4).toFixed(1); // Random angle between -4deg and 4deg
      const sizeFactor = (Math.random() * 0.2 + 0.9).toFixed(2); // Random scale between 0.9 and 1.1
      
      const labelText = momentsCaptions[index] || "A beautiful memory ✨";
      
      // Realistically add brass pins, tape layers, clips or retro tags
      let accessoryHtml = '<div class="brass-pin"></div>';
      const accRand = Math.random();
      if (accRand < 0.15) {
        accessoryHtml += '<div class="memory-card-tape top-left-tape"></div>';
      } else if (accRand < 0.3) {
        accessoryHtml += '<div class="memory-card-tape top-right-tape"></div>';
      } else if (accRand < 0.42) {
        accessoryHtml += '<div class="memory-card-clip"></div>';
      } else if (accRand < 0.52) {
        accessoryHtml += '<div class="memory-card-ticket"></div>';
      }
      
      const cardHtml = `
        <div class="memory-card" style="--rotation: ${rotation}deg; --size-factor: ${sizeFactor};" tabindex="0" data-memory-id="${index + 1}">
          ${accessoryHtml}
          <div class="memory-card-img-wrapper">
            <img src="${item.src}" alt="${labelText}">
          </div>
          <span class="memory-date">${labelText}</span>
        </div>
      `;
      momentsWall.insertAdjacentHTML('beforeend', cardHtml);
    });
  }

  function openMemory(card) {
    const memoryId = parseInt(card.dataset.memoryId) - 1;
    const img = card.querySelector('img');

    if (!img) return;

    // Save triggering element for focus lock return
    lastActiveMemoryCard = card;

    const labelText = momentsCaptions[memoryId] || "A beautiful memory ✨";

    // Load content details into viewer
    viewerImg.src = img.src;
    viewerImg.alt = img.alt;
    viewerTitle.textContent = `Memory #${memoryId + 1}`;
    viewerCaption.textContent = `“${labelText} — A beautiful moment that makes life so special.”`;

    // Open Modal
    memoryViewer.classList.add('active');

    // Accessibility: Lock focus to return/close trigger
    setTimeout(() => {
      if (viewerCloseBtn) viewerCloseBtn.focus();
    }, 150);
  }

  function closeMemory() {
    if (!memoryViewer.classList.contains('active')) return;
    
    memoryViewer.classList.remove('active');
    
    // Accessibility: Return focus back to original Polaroid card
    if (lastActiveMemoryCard) {
      lastActiveMemoryCard.focus();
    }
  }

  // Bind dynamic card interactions
  if (momentsWall && memoryViewer) {
    momentsWall.addEventListener('click', (e) => {
      const card = e.target.closest('.memory-card');
      if (card) {
        openMemory(card);
      }
    });

    momentsWall.addEventListener('keydown', (e) => {
      const card = e.target.closest('.memory-card');
      if (card && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openMemory(card);
      }
    });

    // Close Actions
    if (viewerCloseBtn) {
      viewerCloseBtn.addEventListener('click', closeMemory);
    }
    if (memoryViewerClose) {
      memoryViewerClose.addEventListener('click', closeMemory);
    }

    // Modal Backdrop Click close
    const backdrop = memoryViewer.querySelector('.memory-viewer-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeMemory);
    }

    // Escape Key Accessibility
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeMemory();
      }
    });
  }

  /* ==========================================================================
     PHASE 4: CONFETTI & RIBBON EMITTER (CHAPTER IV)
     ========================================================================== */
  class ConfettiEmitter {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.animationFrameId = null;
      this.active = false;
      
      // Muted luxury colorful palette matching user sandstone design
      this.colors = [
        '#C5A059', // Antique Gold
        '#A48D78', // Desert Rock
        '#E6DAC8', // Creamed Oat
        '#E5C158', // Light Gold
        '#C07A65', // Soft Muted Coral
        '#7B9A86', // Sage Green
        '#8FA4B5'  // Soft Steel Blue
      ];
    }

    init() {
      if (!this.canvas) return;
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.active = true;
      this.particles = [];

      // Initial double side burst: Left and Right corners
      this.burst(0, this.canvas.height, -45); // Left burst upward right
      this.burst(this.canvas.width, this.canvas.height, -135); // Right burst upward left

      this.animate();
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = this.canvas.parentElement.clientWidth;
      this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    burst(x, y, angleDeg) {
      const count = 45; // Number of particles per corner
      const baseAngle = angleDeg * Math.PI / 180;
      
      for (let i = 0; i < count; i++) {
        const angle = baseAngle + (Math.random() * 0.4 - 0.2);
        const speed = Math.random() * 12 + 10; // Strong burst speed
        
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 4 + 2), // Upward thrust
          size: Math.random() * 10 + 6,
          width: Math.random() * 8 + 4,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: Math.random() * 0.15 - 0.075,
          gravity: 0.18,
          friction: 0.98,
          type: Math.random() > 0.35 ? 'paper' : 'ribbon',
          oscillation: Math.random() * 100,
          oscillationSpeed: 0.04 + Math.random() * 0.04
        });
      }
    }

    update() {
      // Filter out offscreen particles
      this.particles = this.particles.filter(p => p.y <= this.canvas.height + 20);
      
      // If no particles left and active, stop the animation loop to save resources!
      if (this.particles.length === 0 && this.active) {
        this.stop();
        return;
      }

      this.particles.forEach(p => {
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.x += p.vx;
        p.y += p.vy;
        
        p.rotation += p.rotationSpeed;
        p.oscillation += p.oscillationSpeed;
        
        // Float sway
        p.x += Math.sin(p.oscillation) * 0.5;
      });
    }

    draw() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach(p => {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillStyle = p.color;
        
        if (p.type === 'paper') {
          this.ctx.fillRect(-p.width / 2, -p.size / 2, p.width, p.size);
        } else {
          this.ctx.strokeStyle = p.color;
          this.ctx.lineWidth = 3;
          this.ctx.beginPath();
          this.ctx.moveTo(-p.width, -p.size);
          this.ctx.bezierCurveTo(-p.width / 2, -p.size / 2, p.width / 2, p.size / 2, p.width, p.size);
          this.ctx.stroke();
        }
        
        this.ctx.restore();
      });
    }

    animate() {
      if (!this.active) return;
      this.update();
      if (this.active) {
        this.draw();
        this.animationFrameId = requestAnimationFrame(() => this.animate());
      }
    }

    stop() {
      this.active = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  // Failsafe synth chime for blowing candles
  function playBlowoutChime() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) {
        audioCtx = new AudioContextClass();
      }
      
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 1.2); // descending wind sweep
      
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      
      osc.start(now);
      osc.stop(now + 1.2);
    } catch (e) {
      console.warn("Failsafe blowout synth failed:", e);
    }
  }

  // Navigation from Moments section to Cake section
  const toCakeBtn = document.getElementById('to-cake-btn');
  const cakeSection = document.getElementById('cake-section');
  let confettiEmitterInstance = null;

  if (toCakeBtn && cakeSection && momentsSection) {
    toCakeBtn.addEventListener('click', () => {
      // Fade out Chapter III
      momentsSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      momentsSection.style.opacity = '0';
      momentsSection.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        momentsSection.style.display = 'none';
        
        // Show Chapter IV
        cakeSection.style.display = 'flex';
        cakeSection.style.opacity = '0';
        cakeSection.style.transform = 'translateY(20px)';
        
        // Force reflow
        cakeSection.offsetHeight;
        
        // Transition in Chapter IV
        cakeSection.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        cakeSection.style.opacity = '1';
        cakeSection.style.transform = 'translateY(0)';
        
        // Set Dark museum background theme
        document.body.classList.remove('warm-theme');
        document.body.classList.add('museum-theme');
        
        // Disable falling petals for the cake spotlight room
        if (window.ambientPetals) {
          window.ambientPetals.disable();
        }
        
        // Trigger Confetti Ribbon blast!
        if (!confettiEmitterInstance) {
          confettiEmitterInstance = new ConfettiEmitter('confetti-canvas');
        }
        confettiEmitterInstance.init();
      }, 800);
    });
  }

  // Interactive Birthday Cake Logic
  const cakeContainer = document.getElementById('cake-container');
  const flames = document.querySelectorAll('.flame');
  const letterNoteContainer = document.getElementById('letter-note-container');
  let cakeBlown = false;

  if (cakeContainer && flames && letterNoteContainer) {
    const triggerBlowout = () => {
      if (cakeBlown) return;
      cakeBlown = true;
      
      // Extinguish flames
      flames.forEach(f => {
        f.classList.remove('active');
        f.classList.add('blown-out');
      });
      
      // Play sound
      playBlowoutChime();
      
      // Reveal letter card note and wish entry form
      setTimeout(() => {
        letterNoteContainer.classList.remove('hidden');
        letterNoteContainer.offsetHeight;
        letterNoteContainer.classList.add('revealed');
        
        // Show Wish form container
        const wishFormContainer = document.getElementById('wish-form-container');
        if (wishFormContainer) {
          wishFormContainer.classList.remove('hidden');
          wishFormContainer.offsetHeight;
          wishFormContainer.classList.add('revealed');
        }
      }, 800);
    };

    cakeContainer.addEventListener('click', triggerBlowout);
    cakeContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerBlowout();
      }
    });

    // Wish form submission, localStorage backup, auto-reply & WhatsApp redirection
    const wishForm = document.getElementById('birthday-wish-form');
    const wishInput = document.getElementById('user-wish-input');
    const wishReplyBox = document.getElementById('wish-reply-box');
    
    if (wishForm && wishInput && wishReplyBox) {
      wishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const wishText = wishInput.value.trim();
        if (!wishText) return;
        
        // 1. Back up the wish inside localStorage so you can access it privately
        localStorage.setItem('birthday_wish', wishText);
        
        // 2. Reveal auto-reply box
        wishReplyBox.classList.remove('hidden');
        
        // Disable form input to prevent duplicates
        wishInput.disabled = true;
        const submitBtn = wishForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        
        // 3. WhatsApp Redirect Notification after delay
        const textMessage = encodeURIComponent(`Hey! Here is my birthday wish: "${wishText}"`);
        const whatsappUrl = `https://wa.me/?text=${textMessage}`;
        
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 3800);
      });
    }
  }

  /* ==========================================================================
     AMBIENT FALLING PETALS ANIMATION (PHASE 1 HERO ENHANCEMENT)
     ========================================================================== */

  class AmbientPetals {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.petals = [];
      this.animationFrameId = null;
      this.mouseX = 0;
      this.mouseY = 0;
      this.mouseActive = false;
      this.initialized = false;
      this.paused = false;

      // === FUTURE SUPPORT CONFIGURATIONS ===
      // You can easily modify these parameters to customize the behavior:
      this.config = {
        // High-contrast, non-saturated ivory & champagne colors
        colors: ['#FFFDF9', '#FAF5E8', '#ECDDBF', '#E5D2A8'],
        
        // Screen-density limits (max visible petals at once - moderately increased)
        density: {
          desktop: 16,  // Desktop max: 14-18
          tablet: 10,   // Tablet max: 9-12
          mobile: 6     // Mobile max: 5-8
        },
        
        // Wind/gravity simulation parameters
        gravity: { min: 0.35, max: 0.85 },   // Fall speed range
        swaySpeed: { min: 0.01, max: 0.025 }, // Sway frequency
        swayRange: { min: 0.8, max: 2.2 },   // Horizontal drift amplitude
        rotateSpeed: { min: 0.005, max: 0.02 }, // Rotation spin speed
        
        // Scale and opacity settings to establish depth/parallax
        scale: { min: 0.35, max: 1.25 },
        opacity: { min: 0.25, max: 0.75 },
        
        // Mouse interaction influence
        mouseInfluence: 0.02,
        
        // Start delay: Spawns first petal after landing elements finish fading in (approx 6s total)
        startDelayMs: 6000
      };
    }

    init() {
      // 1. Create a dedicated fullscreen overlay canvas for isolated rendering
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'ambient-petals-canvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100vw';
      this.canvas.style.height = '100vh';
      this.canvas.style.pointerEvents = 'none'; // Ensure clicks pass through to hero button
      this.canvas.style.zIndex = '5'; // Positioned above background but behind cards/headings
      
      // Inject the canvas directly into body
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      
      this.resize();
      window.addEventListener('resize', () => this.resize());
      
      // Track mouse coordinates for gentle air movement influence
      window.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.mouseActive = true;
      });

      window.addEventListener('mouseleave', () => {
        this.mouseActive = false;
      });
      
      this.initialized = true;
      
      // Start drawing loop
      this.animate();
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    getMaxPetals() {
      const width = window.innerWidth;
      if (width > 1024) return this.config.density.desktop;
      if (width > 768) return this.config.density.tablet;
      return this.config.density.mobile;
    }

    createPetal(isInitial = false) {
      // Pick one of three explicit depth layers (Parallax effect)
      const layerRand = Math.random();
      let layer = 'midground';
      let scale, opacity, blur, speedY;

      if (layerRand < 0.2) {
        // Foreground (Layer 0) - close, large, blurred, fast, low opacity
        layer = 'foreground';
        scale = Math.random() * 0.3 + 0.95; // 0.95 to 1.25
        opacity = Math.random() * 0.15 + 0.3; // 0.3 to 0.45
        blur = Math.random() * 1.5 + 3.0; // 3.0px to 4.5px blur
        speedY = Math.random() * 0.4 + 0.85; // 0.85 to 1.25
      } else if (layerRand < 0.55) {
        // Background (Layer 2) - far, small, lightly blurred, slow, low opacity
        layer = 'background';
        scale = Math.random() * 0.27 + 0.35; // 0.35 to 0.62
        opacity = Math.random() * 0.25 + 0.25; // 0.25 to 0.5
        blur = Math.random() * 1.0 + 1.0; // 1.0px to 2.0px blur
        speedY = Math.random() * 0.2 + 0.25; // 0.25 to 0.45
      } else {
        // Midground (Layer 1) - main focus, sharp, medium scale/speed, high contrast
        layer = 'midground';
        scale = Math.random() * 0.27 + 0.65; // 0.65 to 0.92
        opacity = Math.random() * 0.2 + 0.55; // 0.55 to 0.75
        blur = 0; // Zero blur
        speedY = Math.random() * 0.25 + 0.55; // 0.55 to 0.8
      }

      // Slightly increased base petal size (was 18, now 22)
      const baseSize = 22;

      return {
        layer: layer,
        x: Math.random() * this.canvas.width,
        y: isInitial ? Math.random() * this.canvas.height : -30,
        size: scale * baseSize,
        scale: scale,
        opacity: opacity,
        color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
        
        speedY: speedY,
        swaySpeed: Math.random() * (this.config.swaySpeed.max - this.config.swaySpeed.min) + this.config.swaySpeed.min,
        swayRange: Math.random() * (this.config.swayRange.max - this.config.swayRange.min) + this.config.swayRange.min,
        swayOffset: Math.random() * Math.PI * 2,
        
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() * (this.config.rotateSpeed.max - this.config.rotateSpeed.min) + this.config.rotateSpeed.min) * (Math.random() > 0.5 ? 1 : -1),
        curl: Math.random() * Math.PI,
        curlSpeed: 0.01 + Math.random() * 0.015,
        
        blur: blur
      };
    }

    // Draw organic petal shape using bezier curves
    drawPetalShape(ctx, petal) {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.angle);
      
      // Simulate 3D curling/folding by scaling along the vertical axis of rotation
      ctx.scale(1, Math.sin(petal.curl));
      
      // Apply soft depth-of-field lens blur
      if (petal.blur > 0.5) {
        ctx.filter = `blur(${petal.blur.toFixed(1)}px)`;
      }
      
      // Specular highlight: when rotation and curl line up with our light source, catch the light!
      let highlightOpacity = 0;
      const cosAngle = Math.cos(petal.angle + petal.curl * 1.5);
      if (cosAngle > 0.8 && petal.layer !== 'background') {
        highlightOpacity = (cosAngle - 0.8) * 5.0 * petal.opacity; // Catch light shimmer factor
      }

      // Premium soft glow (drop shadow) to improve contrast on cream backgrounds
      ctx.shadowColor = 'rgba(216, 192, 138, 0.22)'; // Soft gold ambient drop shadow
      ctx.shadowBlur = 6 * petal.scale;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2 * petal.scale;
      
      ctx.fillStyle = petal.color;
      ctx.globalAlpha = petal.opacity;
      
      // Draw an organic petal outline (magnolia/white flower leaf profile)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-petal.size / 2, -petal.size / 3, -petal.size / 2, -petal.size, 0, -petal.size);
      ctx.bezierCurveTo(petal.size / 2, -petal.size, petal.size / 2, -petal.size / 3, 0, 0);
      ctx.closePath();
      ctx.fill();
      
      // Draw a subtle vertical rib/vein through the center for high realism
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = petal.size * 0.04;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-petal.size * 0.03, -petal.size * 0.5, 0, -petal.size * 0.95);
      ctx.stroke();

      // Catch the light overlay (occasional specular flash shimmer)
      if (highlightOpacity > 0.05) {
        ctx.save();
        ctx.shadowColor = 'transparent'; // Turn off shadow for light highlight

        // Specular radial shimmer gradient
        const specGrad = ctx.createRadialGradient(0, -petal.size * 0.5, 1, 0, -petal.size * 0.5, petal.size * 0.5);
        specGrad.addColorStop(0, `rgba(255, 255, 255, ${highlightOpacity * 0.9})`);
        specGrad.addColorStop(0.5, `rgba(254, 248, 230, ${highlightOpacity * 0.45})`);
        specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = specGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-petal.size / 2, -petal.size / 3, -petal.size / 2, -petal.size, 0, -petal.size);
        ctx.bezierCurveTo(petal.size / 2, -petal.size, petal.size / 2, -petal.size / 3, 0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      
      ctx.restore();
    }

    update() {
      if (this.paused) return;

      const maxPetals = this.getMaxPetals();
      
      // Gradually spawn petals one-by-one up to density limit
      if (this.petals.length < maxPetals && Math.random() < 0.015) {
        this.petals.push(this.createPetal(false));
      }

      this.petals.forEach((petal, idx) => {
        // 1. Gravity fall
        petal.y += petal.speedY;
        
        // 2. Sway back and forth using sine oscillation
        petal.swayOffset += petal.swaySpeed;
        petal.x += Math.sin(petal.swayOffset) * petal.swayRange * 0.5;
        
        // 3. Rotation spin and 3D curl folding
        petal.angle += petal.spinSpeed;
        petal.curl += petal.curlSpeed;
        
        // 4. Mouse interaction: air current influence
        if (this.mouseActive) {
          const dx = petal.x - this.mouseX;
          const dy = petal.y - this.mouseY;
          const distance = Math.hypot(dx, dy);
          
          if (distance < 200) {
            // Gentle push away from the cursor
            const force = (200 - distance) / 200;
            const forceX = (dx / distance) * force * 1.5;
            petal.x += forceX;
            
            // Add a minor tilt/rotation kick
            petal.angle += forceX * this.config.mouseInfluence;
          }
        }
        
        // 5. Recycle petal to the top when it drifts offscreen
        if (petal.y > this.canvas.height + 30 || petal.x < -30 || petal.x > this.canvas.width + 30) {
          this.petals[idx] = this.createPetal(false);
        }
      });
    }

    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.petals.forEach(petal => {
        this.drawPetalShape(this.ctx, petal);
      });
    }

    animate() {
      if (this.paused) return;
      this.update();
      this.draw();
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    // === TOGGLES FOR DYNAMIC CONTROLS & CHAPTERS ===
    pause() {
      this.paused = true;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }

    resume() {
      if (this.paused) {
        this.paused = false;
        if (!this.animationFrameId) {
          this.animate();
        }
      }
    }

    disable() {
      this.pause();
      if (this.canvas) {
        this.canvas.style.display = 'none';
      }
    }

    enable() {
      this.resume();
      if (this.canvas) {
        this.canvas.style.display = 'block';
      }
    }
  }

  // Initialize and attach globally
  const ambientPetalsInstance = new AmbientPetals();
  window.ambientPetals = ambientPetalsInstance;
  
  // Start delay: wait for hero elements to load and fade in fully (approx 6s delay)
  setTimeout(() => {
    ambientPetalsInstance.init();
  }, ambientPetalsInstance.config.startDelayMs);
});
