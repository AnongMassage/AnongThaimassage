import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '@/components/animated-section';
import { MapPin, Phone, Mail, Instagram, Facebook, Clock, Menu, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import anongLogo from '@assets/anong_logo.jpg';
import heroBg from '@assets/hero_massage_room.jpg';
import aboutImg from '@assets/about_masseuse.jpg';

const TREATMENTS = [
  { id: 1, name: 'Traditionelle Thai-Massage', desc: 'Klassische Druckpunkt- und Dehnmassage, die Verspannungen löst und die Lebensenergie neu ausbalanciert.', icon: '💆‍♀️' },
  { id: 2, name: 'Thai-Ölmassage', desc: 'Sanfte Ölmassage für tiefe Entspannung von Körper und Geist.', icon: '🌿' },
  { id: 3, name: 'Thai-Aromamassage', desc: 'Wohltuende Ölmassage mit warmen, aromatischen Ölen für alle Sinne.', icon: '🌸' },
  { id: 4, name: 'Thai-Sport-Massage', desc: 'Intensive Tiefenmassage für aktive Menschen — ideal zur Regeneration.', icon: '💪' },
  { id: 5, name: 'Hot-Stone-Massage', desc: 'Wärme trifft Entspannung: erhitzte Basaltsteine lösen tief sitzende Muskelverspannungen.', icon: '🪨' },
  { id: 6, name: 'Fußreflexzonenmassage', desc: 'Gezielte Reize an den Fußpunkten, die den gesamten Körper vitalisieren.', icon: '👣' },
  { id: 7, name: 'Kopf-, Schulter- & Nackenmassage', desc: 'Gezielte Entspannung für die am stärksten beanspruchten Körperzonen.', icon: '🧘‍♀️' },
  { id: 8, name: 'Kombi-Massage (Öl + Fuß)', desc: 'Die beste Kombination: genießen Sie Öl- und Fußmassage in einer Behandlung.', icon: '✨' },
  { id: 9, name: 'Spezial-Massage mit vier Händen', desc: 'Außergewöhnliches Erlebnis: zwei Therapeuten, vollkommene Harmonie.', icon: '👐' },
  { id: 10, name: 'Paarmassage', desc: 'Entspannen Sie gemeinsam — das perfekte Geschenk für zwei.', icon: '❤️' },
];

const PRICING = [
  { group: 'Thai-Ölmassage', items: [{ dur: '60 Min', price: '45 €' }, { dur: '90 Min', price: '65 €' }, { dur: '120 Min', price: '85 €' }] },
  { group: 'Thai-Aromamassage (warmes Öl)', items: [{ dur: '60 Min', price: '47 €' }, { dur: '90 Min', price: '68 €' }, { dur: '120 Min', price: '89 €' }] },
  { group: 'Thai-Sport-Massage', items: [{ dur: '60 Min', price: '47 €' }, { dur: '90 Min', price: '68 €' }, { dur: '120 Min', price: '89 €' }] },
  { group: 'Hot-Stone-Massage', items: [{ dur: '60 Min', price: '50 €' }, { dur: '90 Min', price: '73 €' }] },
  { group: 'Kombi-Massage (Öl- + Fußmassage)', items: [{ dur: '90 Min', price: '65 €' }, { dur: '120 Min', price: '85 €' }] },
  { group: 'Spezial-Massage, vier Hände', items: [{ dur: '60 Min', price: '89 €' }, { dur: '90 Min', price: '127 €' }] },
  { group: 'Kopf-Schulter-Nacken', items: [{ dur: '30 Min', price: '25 €' }, { dur: '60 Min', price: '45 €' }] },
  { group: 'Fußmassage', items: [{ dur: '30 Min', price: '25 €' }, { dur: '60 Min', price: '45 €' }] },
  { group: 'Paarmassage', items: [{ dur: '30 Min', price: '48 €' }, { dur: '60 Min', price: '86 €' }, { dur: '90 Min', price: '124 €' }, { dur: '120 Min', price: '162 €' }] },
];

const BOOKING_OPTIONS = PRICING.flatMap(p => p.items.map(i => `${p.group} – ${i.dur} (${i.price})`));

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Today's day (0 = Sunday, 1 = Monday, etc.)
  const today = new Date().getDay();

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    setSelectedDate(dateStr);
    if (dateStr) {
      const dateObj = new Date(dateStr);
      setSelectedDayOfWeek(dateObj.getDay());
    } else {
      setSelectedDayOfWeek(null);
    }
  };

  const getAvailableTimeSlots = () => {
    if (selectedDayOfWeek === null) return [];
    if (selectedDayOfWeek === 2) return []; // Tuesday closed
    
    const slots = [];
    const startHour = 10;
    const startMin = 0;
    const endHour = selectedDayOfWeek === 0 ? 18 : 19; // Sun 18:30 last slot, others 19:30
    const endMin = 30;

    let currH = startHour;
    let currM = startMin;

    while (currH < endHour || (currH === endHour && currM <= endMin)) {
      const timeStr = `${currH.toString().padStart(2, '0')}:${currM.toString().padStart(2, '0')}`;
      slots.push(timeStr);
      currM += 30;
      if (currM >= 60) {
        currH += 1;
        currM -= 60;
      }
    }
    return slots;
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingStatus('submitting');
    
    const form = e.currentTarget;
    const formData = new URLSearchParams();
    formData.append('form-name', 'buchung');
    
    // Convert FormData to URLSearchParams properly
    const data = new FormData(form);
    for (const [key, value] of data.entries()) {
      formData.append(key, value.toString());
    }

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      if (res.ok) {
        setBookingStatus('success');
        form.reset();
      } else {
        setBookingStatus('error');
      }
    } catch (err) {
      setBookingStatus('error');
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Get minimum date for date picker (today)
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full flex flex-col min-h-screen relative font-sans">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={anongLogo} alt="Anong Thai-Massage Logo" className="w-12 h-12 object-cover rounded-full shadow-sm" />
            <span className={`font-display text-xl font-bold tracking-wide ${isScrolled ? 'text-primary' : 'text-primary md:text-white'}`}>
              Anong Thai-Massage
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['über uns', 'anwendungen', 'preise', 'kontakt'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.replace(' ', '-'))}
                className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-secondary ${isScrolled ? 'text-foreground' : 'text-white/90'}`}
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('termin')}
              className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-sm hover:shadow-md"
            >
              Termin buchen
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className={`md:hidden p-2 ${isScrolled ? 'text-primary' : 'text-primary'}`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} className={!isScrolled ? "text-white drop-shadow-md" : ""} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 pb-6 flex flex-col gap-6 md:hidden"
          >
            {['über uns', 'anwendungen', 'preise', 'kontakt'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.replace(' ', '-'))}
                className="text-2xl font-display text-primary text-left uppercase tracking-widest border-b border-border pb-4"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('termin')}
              className="mt-4 bg-secondary text-white text-xl py-4 rounded-xl font-medium w-full shadow-md"
            >
              Termin buchen
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src={heroBg} alt="Thai massage room" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-medium leading-tight mb-6"
          >
            Ihre kleine Auszeit beginnt hier.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-white/90 mb-10 font-light tracking-wide"
          >
            Traditionelle Thai-Massage in Reutlingen.
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onClick={() => scrollToSection('termin')}
            className="group flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:bg-secondary/90 hover:scale-105 hover:shadow-lg"
          >
            Termin buchen 
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>
      </section>

      {/* About Section */}
      <AnimatedSection id="über-uns" className="py-24 md:py-32 bg-background relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-2xl transform rotate-3 -z-10"></div>
                <img src={aboutImg} alt="Saranya - Thai Masseuse" className="w-full h-auto object-cover rounded-2xl shadow-xl" />
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
              <span className="text-accent font-semibold tracking-widest uppercase text-sm mb-4">Herzlich Willkommen</span>
              <h2 className="font-display text-4xl md:text-5xl text-primary font-medium mb-8 leading-tight">
                Echte Erholung für Körper und Seele
              </h2>
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                Anong Thai-Massage steht für traditionelle, sorgfältig ausgeführte Thai-Massagen im Herzen von Reutlingen. Inhaberin Saranya und ihr engagiertes Team bringen jahrelange Erfahrung, tiefes Wissen und echte Leidenschaft in jede Behandlung mit ein.
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed mb-8">
                Unser Ziel ist es, Ihnen eine echte Auszeit von Ihrem Alltag zu schenken. Ob Sie nach tiefgreifender Muskelarbeit suchen oder pure Entspannung genießen möchten — wir stimmen jede Behandlung achtsam und individuell auf Ihre Bedürfnisse ab.
              </p>
              <img src={anongLogo} alt="Logo" className="w-16 h-16 opacity-20 grayscale" />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Services Section */}
      <AnimatedSection id="anwendungen" className="py-24 bg-card">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold tracking-widest uppercase text-sm mb-4 block">Unser Angebot</span>
            <h2 className="font-display text-4xl md:text-5xl text-primary font-medium mb-6">Anwendungen</h2>
            <p className="text-foreground/70 text-lg">Entdecken Sie unsere vielfältigen Massagen für Ihr individuelles Wohlbefinden.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TREATMENTS.map((t) => (
              <div key={t.id} className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-border group">
                <div className="text-4xl mb-6 bg-muted w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  {t.icon}
                </div>
                <h3 className="font-display text-2xl text-primary font-semibold mb-3">{t.name}</h3>
                <p className="text-foreground/70 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Pricing Section */}
      <AnimatedSection id="preise" className="py-24 bg-background">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold tracking-widest uppercase text-sm mb-4 block">Transparent & Fair</span>
            <h2 className="font-display text-4xl md:text-5xl text-primary font-medium mb-6">Unsere Preise</h2>
          </div>

          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-sm border border-border">
            <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
              {PRICING.map((group, idx) => (
                <div key={idx} className="border-b border-border/50 pb-6 last:border-0 md:last:border-b-0">
                  <h4 className="font-display text-xl text-primary font-semibold mb-4">{group.group}</h4>
                  <ul className="space-y-3">
                    {group.items.map((item, i) => (
                      <li key={i} className="flex justify-between items-center text-foreground/80">
                        <span className="flex items-center gap-2">
                          <Clock size={16} className="text-muted-foreground" /> 
                          {item.dur}
                        </span>
                        <span className="font-medium text-primary">{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border text-center text-foreground/60 text-sm flex flex-col md:flex-row items-center justify-center gap-4">
              <span>Alle Anwendungen sind auch als Gutschein erhältlich.</span>
              <span className="hidden md:inline">•</span>
              <span>Zahlung per PayPal ist derzeit leider nicht möglich.</span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Booking Form Section */}
      <AnimatedSection id="termin" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto">
            
            <div className="w-full lg:w-5/12 flex flex-col justify-center">
              <span className="text-secondary font-semibold tracking-widest uppercase text-sm mb-4 block">Ihre Zeit für sich</span>
              <h2 className="font-display text-4xl md:text-5xl font-medium mb-6 text-white">Termin anfragen</h2>
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                Füllen Sie das Formular aus, um Ihren Wunschtermin anzufragen. Wir melden uns schnellstmöglich bei Ihnen zurück, um den Termin zu bestätigen.
              </p>
              <div className="hidden lg:flex items-center gap-6 text-primary-foreground/70">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-white">Rufen Sie uns an</span>
                  <span>0172 639 05 15</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-7/12">
              <div className="bg-background rounded-3xl p-8 md:p-10 shadow-2xl border border-border text-foreground">
                
                {bookingStatus === 'success' ? (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={40} className="text-green-600" />
                    </div>
                    <h3 className="font-display text-3xl text-primary mb-4">Vielen Dank!</h3>
                    <p className="text-foreground/70 text-lg">
                      Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns in Kürze zur Bestätigung Ihres Termins.
                    </p>
                    <button 
                      onClick={() => setBookingStatus('idle')}
                      className="mt-8 text-primary font-medium hover:underline"
                    >
                      Weitere Anfrage senden
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    {/* Hidden Honeypot Field */}
                    <p className="hidden">
                      <label>Don't fill this out if you're human: <input name="bot-field" /></label>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Name *</label>
                        <input required type="text" id="name" name="name" className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-shadow" placeholder="Ihr Name" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">E-Mail *</label>
                        <input required type="email" id="email" name="email" className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-shadow" placeholder="ihre.email@beispiel.de" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="telefon" className="text-sm font-medium">Telefonnummer *</label>
                        <input required type="tel" id="telefon" name="telefon" className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-shadow" placeholder="Für Rückfragen" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="behandlung" className="text-sm font-medium">Behandlung *</label>
                        <select required id="behandlung" name="behandlung" className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-shadow appearance-none">
                          <option value="">Bitte wählen...</option>
                          {BOOKING_OPTIONS.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="datum" className="text-sm font-medium">Wunschdatum *</label>
                        <input 
                          required 
                          type="date" 
                          id="datum" 
                          name="datum" 
                          min={todayStr}
                          onChange={handleDateChange}
                          onKeyDown={(e) => e.preventDefault()} // prevent manual typing of invalid dates
                          className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-shadow" 
                        />
                        {selectedDayOfWeek === 2 && (
                          <p className="text-destructive text-xs mt-1">Dienstags haben wir Ruhetag. Bitte wählen Sie einen anderen Tag.</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="uhrzeit" className="text-sm font-medium">Wunschuhrzeit *</label>
                        <select 
                          required 
                          id="uhrzeit" 
                          name="uhrzeit" 
                          disabled={!selectedDate || selectedDayOfWeek === 2}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-shadow appearance-none disabled:opacity-50"
                        >
                          <option value="">
                            {!selectedDate ? "Zuerst Datum wählen" : selectedDayOfWeek === 2 ? "Geschlossen" : "Bitte wählen..."}
                          </option>
                          {getAvailableTimeSlots().map((time, i) => (
                            <option key={i} value={time}>{time} Uhr</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="nachricht" className="text-sm font-medium">Nachricht (optional)</label>
                      <textarea id="nachricht" name="nachricht" rows={3} className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-shadow resize-none" placeholder="Haben Sie besondere Wünsche oder Beschwerden?"></textarea>
                    </div>

                    {bookingStatus === 'error' && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                        Es gab einen Fehler beim Senden. Bitte versuchen Sie es erneut oder rufen Sie uns an.
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={bookingStatus === 'submitting' || selectedDayOfWeek === 2}
                      className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
                    >
                      {bookingStatus === 'submitting' ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        "Termin anfragen"
                      )}
                    </button>
                    <p className="text-xs text-center text-foreground/50 mt-4">
                      Ihre Daten werden sicher übermittelt und nur zur Terminvereinbarung genutzt.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Opening Hours & Contact Section */}
      <AnimatedSection id="kontakt" className="py-24 bg-card">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left: Info */}
            <div className="space-y-12">
              <div>
                <h2 className="font-display text-4xl text-primary font-medium mb-8">Kontakt & Öffnungszeiten</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Hours */}
                  <div className="bg-background p-6 rounded-2xl shadow-sm border border-border">
                    <h3 className="font-medium text-lg mb-4 flex items-center gap-2"><Clock size={20} className="text-secondary" /> Öffnungszeiten</h3>
                    <ul className="space-y-2 text-sm text-foreground/80">
                      <li className={`flex justify-between py-1 ${today === 1 ? 'font-bold text-primary' : ''}`}><span>Montag</span> <span>10:00 – 20:00</span></li>
                      <li className={`flex justify-between py-1 ${today === 2 ? 'font-bold text-accent' : 'text-foreground/50'}`}><span>Dienstag</span> <span>Ruhetag</span></li>
                      <li className={`flex justify-between py-1 ${today === 3 ? 'font-bold text-primary' : ''}`}><span>Mittwoch</span> <span>10:00 – 20:00</span></li>
                      <li className={`flex justify-between py-1 ${today === 4 ? 'font-bold text-primary' : ''}`}><span>Donnerstag</span> <span>10:00 – 20:00</span></li>
                      <li className={`flex justify-between py-1 ${today === 5 ? 'font-bold text-primary' : ''}`}><span>Freitag</span> <span>10:00 – 20:00</span></li>
                      <li className={`flex justify-between py-1 ${today === 6 ? 'font-bold text-primary' : ''}`}><span>Samstag</span> <span>10:00 – 20:00</span></li>
                      <li className={`flex justify-between py-1 ${today === 0 ? 'font-bold text-primary' : ''}`}><span>Sonn- & Feiertage</span> <span>10:00 – 19:00</span></li>
                    </ul>
                  </div>

                  {/* Contact details */}
                  <div className="space-y-6">
                    <a href="https://maps.google.com/?q=Metzgerstrasse+12,+72764+Reutlingen" target="_blank" rel="noreferrer" className="flex items-start gap-4 p-4 bg-background rounded-2xl shadow-sm border border-border hover:border-secondary/50 transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-secondary/10 transition-colors">
                        <MapPin size={20} className="text-primary group-hover:text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Adresse</p>
                        <p className="text-sm text-foreground/70">Metzgerstrasse 12 (1. Etage)<br/>72764 Reutlingen</p>
                      </div>
                    </a>
                    
                    <a href="tel:01726390515" className="flex items-start gap-4 p-4 bg-background rounded-2xl shadow-sm border border-border hover:border-secondary/50 transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-secondary/10 transition-colors">
                        <Phone size={20} className="text-primary group-hover:text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Telefon</p>
                        <p className="text-sm text-foreground/70">0172 639 05 15</p>
                      </div>
                    </a>

                    <a href="mailto:anong.thaimassage@web.de" className="flex items-start gap-4 p-4 bg-background rounded-2xl shadow-sm border border-border hover:border-secondary/50 transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-secondary/10 transition-colors">
                        <Mail size={20} className="text-primary group-hover:text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">E-Mail</p>
                        <p className="text-sm text-foreground/70 break-all">anong.thaimassage@web.de</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Social placeholders */}
              <div>
                <p className="font-medium mb-4">Folgen Sie uns</p>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:text-secondary hover:border-secondary transition-colors cursor-pointer shadow-sm">
                    <Instagram size={24} />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:text-secondary hover:border-secondary transition-colors cursor-pointer shadow-sm">
                    <Facebook size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Map */}
            <div className="h-[400px] lg:h-auto rounded-3xl overflow-hidden shadow-md border border-border relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2635.0!2d9.2145!3d48.4926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4799c1c7a4b4e567%3A0x0!2sMetzgerstra%C3%9Fe+12%2C+72764+Reutlingen!5e0!3m2!1sde!2sde!4v1!"
                width="100%" 
                height="100%" 
                style={{ border: 0, position: 'absolute', inset: 0 }} 
                allowFullScreen 
                loading="lazy"
              ></iframe>
            </div>

          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 mt-auto">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-3">
            <img src={anongLogo} alt="Logo" className="w-10 h-10 object-cover rounded-full" />
            <span className="font-display text-lg font-bold">Anong Thai-Massage</span>
          </div>
          
          <div className="text-primary-foreground/60 text-center md:text-left">
            © 2025 Anong Thai-Massage. Alle Rechte vorbehalten.
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/impressum" className="text-primary-foreground/70 hover:text-white transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-primary-foreground/70 hover:text-white transition-colors">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
