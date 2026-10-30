import { PROHIBITED_ITEMS } from '@/lib/constants'
import { Shield, CheckCircle2, XCircle, AlertTriangle, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function CommunityGuidelinesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Shield className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Community Guidelines</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Reuse Before Return works because our community is honest, respectful, and safety-conscious.
        </p>
      </div>

      <div className="space-y-8 text-sm">
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />What Makes a Good Listing
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            {[
              'Use clear, honest photos — real ones of the actual item, not stock photos',
              'Describe the condition accurately, including any defects, scratches, or missing parts',
              'Set a fair price if selling — this is a community platform, not a commercial resale shop',
              'List only items you actually have and intend to give / sell',
              'Update or remove listings once an item is taken',
              'One listing per item — no duplicate posts',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />Prohibited Items
          </h2>
          <p className="text-muted-foreground mb-4">
            The following items may not be listed on Reuse Before Return under any circumstances. Listings containing prohibited items will be removed and accounts may be suspended.
          </p>
          <Card className="border-red-200">
            <CardContent className="p-4">
              <ul className="space-y-2">
                {PROHIBITED_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-red-700">
                    <XCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />How to Behave in the Community
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            {[
              'Respond to requests promptly — people are waiting to hear from you',
              'Be polite in all messages, even if you choose to decline a request',
              'Do not discriminate based on religion, caste, gender, disability, or community',
              'Do not harass, threaten, or stalk other users',
              'Do not ask for or provide personal financial information in chat',
              'If you\'ve accepted a request, honour it — or communicate early if plans change',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />Safe Pickup Guidelines
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            {[
              'Always meet in a safe, well-lit, public place',
              'For high-value items, bring someone with you',
              'Check your apartment or gated community\'s rules about visitors before arranging a gate pickup',
              'Inspect the item before accepting it — you\'re not obligated to take it if it doesn\'t match the description',
              'Never transfer money before receiving the item',
              'Report suspicious behaviour using the Report button on the listing or profile',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold mt-0.5">⚠</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Violations & Moderation</h2>
          <p className="text-muted-foreground">
            Reuse Before Return reserves the right to remove listings, issue warnings, or suspend accounts that violate these guidelines. If you believe a listing or user is in violation, please use the Report feature.
          </p>
        </section>

        <div className="bg-muted/50 rounded-xl p-4 text-xs text-muted-foreground">
          Last updated: October 2026. These guidelines may be updated at any time. Continued use of the platform after changes constitutes acceptance of the updated guidelines.
        </div>
      </div>
    </div>
  )
}
