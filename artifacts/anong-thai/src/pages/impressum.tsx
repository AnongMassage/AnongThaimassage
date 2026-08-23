import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import anongLogo from '@assets/anong_logo_new.png';
export default function Impressum() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-3xl mx-auto bg-card p-10 md:p-16 rounded-3xl shadow-sm border border-border">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors mb-12 font-medium">
          <ArrowLeft size={16} /> Zurück zur Startseite
        </Link>

        <div className="mb-12 flex justify-center">
          <img src={anongLogo} alt="Anong Thai-Massage Logo" className="w-20 h-20 object-contain" />
        </div>
        <h1 className="font-display text-primary font-medium mb-8 text-center text-[33px]">Impressum</h1>

        <div className="space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">Angaben gemäß § 5 DDG</h2>
            <p>
              Saranya Mergner<br />
              Anong Thai-Massage<br />
              Metzgerstraße 12 (1. Etage)<br />
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
            <h2 className="text-xl font-semibold text-primary mb-3">Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br />
              DE354482770
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">Haftung für Inhalte</h2>
            <p>
              Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
              Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
              Als Diensteanbieterin sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten 
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als 
              Diensteanbieterin jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
              Tätigkeit hinweisen.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">Haftung für Links</h2>
            <p>
              Unsere Website kann Links zu externen Websites Dritter enthalten, auf deren Inhalte wir 
              keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr 
              übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder 
              Betreiber der Seiten verantwortlich.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiberin erstellten Inhalte und Werke auf diesen Seiten unterliegen 
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der 
              Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung 
              der jeweiligen Erstellerin.
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