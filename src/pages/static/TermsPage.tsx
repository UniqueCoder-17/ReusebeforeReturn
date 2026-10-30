export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-2">
        <span className="inline-block px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200 font-medium">
          Draft — not legal advice
        </span>
      </div>
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground text-sm mb-8">Last updated: October 2026</p>

      <div className="space-y-8 text-sm text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using Reuse Before Return ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform. These terms are governed by the laws of India.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">2. Eligibility</h2>
          <p>You must be at least 18 years old to use the Platform. By using the Platform, you represent that you are 18 or older and have the legal capacity to enter into these terms.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">3. The Platform Is a Facilitator</h2>
          <p>Reuse Before Return connects users who wish to redistribute unwanted items. We are not a party to any transaction between users. We do not take ownership of, inspect, or guarantee any items listed on the Platform. All transactions are between the listing owner and the requester directly.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">4. User Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You are responsible for the accuracy and legality of your listings</li>
            <li>You may not list prohibited items (see Community Guidelines)</li>
            <li>You must not misrepresent the condition of any item</li>
            <li>You are responsible for any transaction you enter into with another user</li>
            <li>You must comply with all applicable Indian laws</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">5. Safety and Meetings</h2>
          <p>Reuse Before Return encourages safe meetups in public places. We are not responsible for any harm, loss, or damage arising from meetings arranged through the Platform. Users meet at their own risk and should take appropriate precautions.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">6. Content Ownership</h2>
          <p>You retain ownership of content you post. By posting, you grant us a non-exclusive, royalty-free licence to display your content on the Platform. You warrant that you have the right to post the content and that it does not infringe third-party rights.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">7. Limitation of Liability</h2>
          <p>To the maximum extent permitted by applicable law, Reuse Before Return shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform or transactions with other users.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">8. Governing Law</h2>
          <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Hyderabad, Telangana.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">9. Contact</h2>
          <p>For legal inquiries: <strong>legal@reusebeforereturn.in</strong> (placeholder — configure before launch)</p>
        </section>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          <strong>Disclaimer:</strong> This is a draft Terms of Service document prepared for development purposes. It has not been reviewed by a qualified legal professional. Before launching publicly, this document must be reviewed and approved by a lawyer familiar with applicable Indian laws.
        </div>
      </div>
    </div>
  )
}
