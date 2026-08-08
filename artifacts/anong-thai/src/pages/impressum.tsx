import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import anongLogo from '@assets/anong_logo.jpg';

export default function Impressum() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-3xl mx-auto bg-card p-10 md:p-16 rounded-3xl shadow-sm border border-border">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors mb-12 font-medium">
          <ArrowLeft size={16} /> Zurück zur Startseite
        </Link>
        
        <div className="mb-12 flex justify-center">
          <img src={anongLogo} alt="Logo" className="w-20 h-20 rounded-full" />
        </div>

        <h1 className="font-display text-4xl text-primary font-medium mb-8 text-center">Impressum</h1>
        
        <div className="space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">Angaben gemäß § 5 TMG</h2>
            <p>
              Saranya [Nachname]<br />
              Anong Thai-Massage<br />
              Metzgerstrasse 12 (1. Etage)<br />
              72764 Reutlingen
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">Kontakt</h2>
            <p>
              Telefon: 0172 639 05 15<br />
              E-Mail: anong.thaimassage@web.de
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
