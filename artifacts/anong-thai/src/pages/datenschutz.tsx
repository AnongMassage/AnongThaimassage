import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import anongLogo from '@assets/anong_logo_new.png';

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6">
      <div className="max-w-3xl mx-auto bg-card p-10 md:p-16 rounded-3xl shadow-sm border border-border">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors mb-12 font-medium">
          <ArrowLeft size={16} /> Zurück zur Startseite
        </Link>
        
        <div className="mb-12 flex justify-center">
          <img src={anongLogo} alt="Anong Thai-Massage Logo" className="w-20 h-20 object-contain" />
        </div>

        <h1 className="font-display text-4xl text-primary font-medium mb-8 text-center">Datenschutzerklärung</h1>
        
        <div className="space-y-8 text-foreground/80 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">1. Datenschutz auf einen Blick</h2>
            <p><strong>Allgemeine Hinweise</strong><br/>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">2. Datenerfassung auf dieser Website</h2>
            <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br/>
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
            
            <p className="mt-4"><strong>Kontaktformular / Terminbuchung</strong><br/>
            Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">3. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
