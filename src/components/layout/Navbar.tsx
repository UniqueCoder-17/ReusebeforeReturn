import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Leaf, Bell, User, ChevronDown, LogOut, Settings, LayoutDashboard, Package, PlusCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useUnreadCount } from '@/hooks/useNotifications'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'About', to: '/about' },
]

export function Navbar() {
  const { user, profile, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const unread = useUnreadCount()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-green-700">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-600">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block text-lg">Reuse Before Return</span>
            <span className="sm:hidden text-lg">RBR</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-green-600',
                  isActive(link.to) ? 'text-green-600' : 'text-gray-600'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button
                  size="sm"
                  onClick={() => navigate('/list-item')}
                  className="gap-1.5"
                >
                  <PlusCircle className="h-4 w-4" />
                  List an Item
                </Button>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/notifications')}
                  className="relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Button>

                {/* Profile dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name} />
                        <AvatarFallback className="bg-green-100 text-green-700 text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <span className="max-w-[100px] truncate text-sm">{profile?.full_name?.split(' ')[0]}</span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{profile?.full_name}</span>
                        <span className="text-xs font-normal text-muted-foreground">{profile?.city}, {profile?.state}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-listings')}>
                      <Package className="mr-2 h-4 w-4" /> My Listings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                      <User className="mr-2 h-4 w-4" /> Public Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <LayoutDashboard className="mr-2 h-4 w-4 text-purple-600" />
                          <span className="text-purple-600">Admin Panel</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log In</Button>
                <Button size="sm" onClick={() => navigate('/register')}>Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-green-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block text-sm font-medium py-2',
                isActive(link.to) ? 'text-green-600' : 'text-gray-700'
              )}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="pt-2 border-t space-y-2">
              <Button className="w-full" size="sm" onClick={() => { navigate('/list-item'); setMobileOpen(false) }}>
                <PlusCircle className="h-4 w-4 mr-2" /> List an Item
              </Button>
              <Button variant="outline" className="w-full" size="sm" onClick={() => { navigate('/dashboard'); setMobileOpen(false) }}>
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full text-red-600" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="pt-2 border-t flex gap-2">
              <Button variant="outline" className="flex-1" size="sm" onClick={() => { navigate('/login'); setMobileOpen(false) }}>Log In</Button>
              <Button className="flex-1" size="sm" onClick={() => { navigate('/register'); setMobileOpen(false) }}>Sign Up</Button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
