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

          {/* NEU: Verantwortlicher gemäß Art. 4 Nr. 7 DSGVO – Pflichtangabe */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">2. Verantwortlicher</h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br /><br />
              Saranya Mergner<br />
              Anong Thai-Massage<br />
              Metzgerstraße 12 (1. Etage)<br />
              72764 Reutlingen<br />
              E-Mail: anong.thaimassage@web.de<br />
              Telefon: 0172 639 05 15
            </p>
          </section>

          {/* NEU: Standard-Pflichthinweis zu SSL/TLS */}
          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">3. SSL- bzw. TLS-Verschlüsselung</h2>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine 
              SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die 
              Adresszeile des Browsers von "http://" auf "https://" wechselt und an dem Schloss-Symbol in Ihrer 
              Browserzeile.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">4. Datenerfassung auf dieser Website</h2>
            <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br/>
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website sowie Abschnitt 2 dieser Erklärung entnehmen.</p>

            {/* NEU: Hosting bei Netlify – ersetzt/ergänzt bisherige generische Angabe */}
            <p className="mt-4"><strong>Hosting bei Netlify</strong><br/>
            Diese Website wird bei dem Anbieter Netlify, Inc. gehostet. Anbieter ist Netlify, Inc. 
            [PLATZHALTER – aktuelle Firmenadresse bitte auf https://www.netlify.com/privacy/ prüfen, 
            da sich Adressen ändern können], USA. Netlify verarbeitet dabei Daten auch in den USA. 
            Netlify ist Teilnehmer des EU-US Data Privacy Frameworks bzw. hat mit uns EU-Standardvertragsklauseln 
            gemäß Art. 46 Abs. 2 lit. c DSGVO vereinbart, wodurch ein angemessenes Datenschutzniveau bei der 
            Datenübermittlung in die USA sichergestellt werden soll. Weitere Informationen finden Sie in der 
            Datenschutzerklärung von Netlify unter https://www.netlify.com/privacy/.</p>

            <p className="mt-4"><strong>Server-Log-Dateien</strong><br/>
            Beim Aufruf dieser Website erhebt Netlify als Hosting-Anbieter automatisch Informationen in sogenannten 
            Server-Log-Dateien, die Ihr Browser automatisch übermittelt. Dies sind: IP-Adresse, Datum und Uhrzeit 
            der Anfrage, Browsertyp und -version, verwendetes Betriebssystem sowie die Website, von der aus 
            zugegriffen wurde (Referrer-URL). Eine Zusammenführung dieser Daten mit anderen Datenquellen findet 
            nicht statt. Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1 lit. f DSGVO, unser 
            berechtigtes Interesse liegt in der technisch fehlerfreien Darstellung und Sicherheit unserer Website.</p>

            {/* NEU: ersetzt die alte, generische "Kontaktformular"-Angabe durch die technisch korrekte Netlify-Forms-Beschreibung */}
            <p className="mt-4"><strong>Terminbuchungsformular</strong><br/>
            Wenn Sie über unser Buchungsformular eine Terminanfrage senden, werden die von Ihnen angegebenen 
            Daten (Name, E-Mail-Adresse, Telefonnummer, gewünschte Behandlung, gewünschtes Datum und Uhrzeit, 
            optionale Nachricht) zur Bearbeitung Ihrer Anfrage verarbeitet. Die technische Verarbeitung des 
            Formulars erfolgt über den Dienst "Netlify Forms" unseres Hosting-Anbieters Netlify, Inc. (siehe oben). 
            Ihre Angaben werden dort gespeichert und uns zur Bearbeitung Ihrer Terminanfrage zugestellt. Wir geben 
            diese Daten nicht ohne Ihre Einwilligung an Dritte weiter. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b 
            DSGVO, da die Verarbeitung der Anbahnung bzw. Erfüllung eines Vertrags (Ihrer Terminbuchung) dient. 
            Die Daten werden gelöscht, sobald sie für die Erreichung des Zwecks ihrer Erhebung nicht mehr 
            erforderlich sind, in der Regel nach Abschluss bzw. Absage des angefragten Termins, sofern keine 
            gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>

            {/* NEU: nur nötig, falls eine Google-Maps-Karte eingebunden ist */}
            <p className="mt-4"><strong>Google Maps</strong><br/>
            Diese Website nutzt den Kartendienst Google Maps zur Darstellung unseres Standorts. Anbieter ist 
            Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Zur Nutzung der Funktionen von 
            Google Maps ist es notwendig, Ihre IP-Adresse zu speichern. Diese Informationen werden in der Regel an 
            einen Server von Google in den USA übertragen und dort gespeichert. Die Nutzung erfolgt im Interesse 
            einer ansprechenden Darstellung unserer Angebote und einer leichten Auffindbarkeit der von uns auf der 
            Website angegebenen Orte, Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mehr Informationen zum Umgang 
            mit Nutzerdaten finden Sie in der Datenschutzerklärung von Google unter 
            https://policies.google.com/privacy.</p>

            {/* NEU: kurzer Cookie-Hinweis, da keine Analyse-Tools/Tracking im Einsatz sind */}
            <p className="mt-4"><strong>Cookies</strong><br/>
            Wir setzen auf dieser Website keine Cookies zu Analyse- oder Marketingzwecken ein. Es werden 
            ausschließlich technisch notwendige Funktionen genutzt.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">5. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer 
              gespeicherten personenbezogenen Daten zu erhalten (Art. 15 DSGVO). Sie haben außerdem ein Recht auf 
              Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO) oder Einschränkung der Verarbeitung (Art. 18 
              DSGVO) dieser Daten, sowie ein Widerspruchsrecht gegen die Verarbeitung (Art. 21 DSGVO) und ein Recht 
              auf Datenübertragbarkeit (Art. 20 DSGVO). Hierzu sowie zu weiteren Fragen zum Thema Datenschutz 
              können Sie sich jederzeit über die oben genannten Kontaktdaten an uns wenden.
            </p>
            {/* NEU: Beschwerderecht bei Aufsichtsbehörde – Pflichtangabe */}
            <p className="mt-4">
              Ihnen steht zudem ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Zuständig ist:<br />
              Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg<br />
              Königstraße 10a, 70173 Stuttgart
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}