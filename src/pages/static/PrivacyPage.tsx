export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-2">
        <span className="inline-block px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200 font-medium">
          Draft — not legal advice
        </span>
      </div>
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm mb-8">Last updated: October 2026</p>

      <div className="space-y-8 text-sm text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">1. Overview</h2>
          <p>
            Reuse Before Return ("the Platform") is committed to protecting your personal data. This Privacy Policy describes what information we collect, how we use it, and your rights under applicable Indian law, including the Digital Personal Data Protection Act, 2023 (DPDPA 2023). This document is a draft and has not been reviewed by a legal professional. Please consult a lawyer before using this document for production.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account information:</strong> Name, email address, optionally phone number, city, locality, and state</li>
            <li><strong>Listings:</strong> Item details, photos, location (city and locality — not street address)</li>
            <li><strong>Requests and messages:</strong> Content of requests and chat messages between users</li>
            <li><strong>Usage data:</strong> Page views, search queries, and interaction data for product improvement</li>
            <li><strong>Device and connection:</strong> IP address, browser type for security and analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">3. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To operate, maintain, and improve the Platform</li>
            <li>To facilitate item listings, requests, and conversations between users</li>
            <li>To send transactional emails (request notifications, account security)</li>
            <li>To detect and prevent fraud, abuse, and prohibited content</li>
            <li>To comply with applicable Indian laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">4. What We Never Show Publicly</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your phone number</li>
            <li>Your email address</li>
            <li>Your exact street address (we do not collect it)</li>
            <li>Exact pickup details — only shared between matched users after a request is accepted</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">5. Data Sharing</h2>
          <p>We do not sell your personal data. We may share data with:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Supabase:</strong> Our database and authentication provider</li>
            <li><strong>Email provider:</strong> To send transactional emails via SMTP</li>
            <li><strong>Law enforcement:</strong> When required by a valid court order or Indian law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">6. Your Rights Under DPDPA 2023</h2>
          <p>Under the Digital Personal Data Protection Act, 2023, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Access a summary of your personal data we hold</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Withdraw your consent and request erasure of your data</li>
            <li>File a complaint with the Data Protection Board of India</li>
          </ul>
          <p className="mt-2">To exercise these rights, contact us. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">7. Data Retention</h2>
          <p>
            We retain your account data for as long as your account is active. You may request deletion at any time from Settings → Account.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">8. Cookies</h2>
          <p>We use essential session cookies for authentication. We do not use advertising cookies or third-party tracking cookies.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">9. Contact</h2>
          <p>For privacy-related inquiries: <strong>privacy@reusebeforereturn.in</strong> (placeholder — configure before launch)</p>
        </section>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          <strong>Disclaimer:</strong> This privacy policy is a draft document prepared for development purposes. It has not been reviewed by a qualified legal professional. Before launching publicly, this document must be reviewed and approved by a lawyer familiar with the DPDPA 2023 and applicable Indian regulations.
        </div>
      </div>
    </div>
  )
}
