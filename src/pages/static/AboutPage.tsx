import { Link } from 'react-router-dom'
import { Heart, Recycle, Users, MapPin, Leaf, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Recycle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-3">About Reuse Before Return</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A community platform for Indians who would rather share an unwanted item with a neighbour than return it or throw it away.
        </p>
      </div>

      <div className="space-y-8 text-sm">
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Heart className="h-5 w-5 text-green-600" />Our Mission</h2>
          <p className="text-muted-foreground">
            Every year, millions of e-commerce packages arrive at Indian doorsteps — sometimes the wrong size, sometimes a duplicate gift, sometimes simply not what was expected. Many of these items are returned at cost to the consumer, the logistics system, and the planet. Many more are left unused or thrown away.
          </p>
          <p className="text-muted-foreground mt-3">
            Reuse Before Return exists to change that. We believe that before an item travels back through the returns system, it deserves a chance to find a new home — ideally just a few streets away.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Users className="h-5 w-5 text-green-600" />Built for India</h2>
          <p className="text-muted-foreground">
            This platform is designed from the ground up for Indian users — residents of cities, towns, gated communities, and neighbourhoods across all 28 states and 8 Union Territories. We support Indian addresses, Indian phone numbers, prices in ₹, and the familiar ways Indians like to connect locally.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Leaf className="h-5 w-5 text-green-600" />Why This Matters</h2>
          <ul className="text-muted-foreground space-y-2">
            {[
              'India processed hundreds of millions of e-commerce orders in 2023–24',
              'Return rates for fashion, electronics accessories, and household items are significant',
              'Every return shipment adds to logistics emissions and packaging waste',
              'Items that reach a neighbour skip packaging, skip logistics, and skip waste',
              'A circular local economy reduces the cost of living for everyone in the community',
            ].map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">→</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><MapPin className="h-5 w-5 text-green-600" />How It Works</h2>
          <p className="text-muted-foreground">
            List an item. A neighbour finds it. They request it. You accept. You arrange a safe local pickup. Your exact address is never shown publicly — only your locality and city.
          </p>
        </section>

        <div className="border-t pt-8 text-center">
          <p className="text-muted-foreground mb-4">Ready to give something a second life?</p>
          <div className="flex gap-3 justify-center">
            <Button asChild><Link to="/list-item">List an Item</Link></Button>
            <Button variant="outline" asChild><Link to="/explore">Explore Items <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
          </div>
        </div>
      </div>
    </div>
  )
}
