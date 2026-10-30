import { Link } from 'react-router-dom'
import { Leaf, Mail, Shield, FileText, HelpCircle, Info } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Reuse Before Return</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Give unwanted e-commerce products a second life. Connect with people nearby, reduce waste, and support a local circular economy across India.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore" className="hover:text-green-400 transition-colors">Browse Products</Link></li>
              <li><Link to="/list-item" className="hover:text-green-400 transition-colors">List an Item</Link></li>
              <li><Link to="/how-it-works" className="hover:text-green-400 transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal & Safety</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-green-400 transition-colors flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-green-400 transition-colors flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Privacy Policy</Link></li>
              <li><Link to="/community-guidelines" className="hover:text-green-400 transition-colors flex items-center gap-1.5"><HelpCircle className="h-3.5 w-3.5" /> Community Guidelines</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-500" />
                <a href="mailto:support@reusebeforereturn.in" className="hover:text-green-400 transition-colors">support@reusebeforereturn.in</a>
              </li>
              <li className="flex items-center gap-2">
                <Info className="h-4 w-4 text-green-500" />
                <Link to="/about" className="hover:text-green-400 transition-colors">About the Project</Link>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-green-900/30 rounded-lg text-xs text-green-300">
              🌱 Hyderabad, Telangana, India<br />Supporting local redistribution nationwide
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Reuse Before Return. All rights reserved.</p>
          <span className="text-yellow-500">⚠ Demo content clearly marked — not real listings</span>
          <p>Designed for India 🇮🇳 — Made with 💚 for sustainability</p>
        </div>
      </div>
    </footer>
  )
}
