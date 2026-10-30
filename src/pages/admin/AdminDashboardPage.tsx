import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Package, Users, Flag, CheckCircle2, Loader2, ShieldAlert, Eye } from 'lucide-react'
import { formatDate, statusLabel } from '@/lib/utils'
import toast from 'react-hot-toast'

const COLORS = ['#16a34a', '#2563eb', '#d97706', '#9333ea', '#ef4444', '#0891b2']

export default function AdminDashboardPage() {
  const { profile, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (profile && !isAdmin) navigate('/dashboard')
  }, [profile, isAdmin, navigate])

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [products, users, reports, completed] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }).neq('status', 'deleted'),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('reports').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('products').select('id', { count: 'exact' }).eq('status', 'completed'),
      ])
      return {
        products: products.count || 0,
        users: users.count || 0,
        pendingReports: reports.count || 0,
        completed: completed.count || 0,
      }
    },
    enabled: !!isAdmin,
  })

  const { data: categoryData = [] } = useQuery({
    queryKey: ['admin-category-chart'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('categories(name)')
        .neq('status', 'deleted')
      const counts: Record<string, number> = {}
      ;(data || []).forEach((p: { categories?: { name: string } | { name: string }[] | null }) => {
        const cat = p.categories
        const name = (Array.isArray(cat) ? cat[0]?.name : cat?.name) || 'Uncategorized'
        counts[name] = (counts[name] || 0) + 1
      })
      return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8)
    },
    enabled: !!isAdmin,
  })

  const { data: reports = [], refetch: refetchReports } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*, reporter:profiles!reports_reporter_id_fkey(full_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data
    },
    enabled: !!isAdmin,
  })

  const { data: recentProducts = [] } = useQuery({
    queryKey: ['admin-recent-products'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('id, title, status, city, created_at, profiles(full_name)')
        .neq('status', 'deleted')
        .order('created_at', { ascending: false })
        .limit(20)
      return data || []
    },
    enabled: !!isAdmin,
  })

  const handleRemoveListing = async (productId: string) => {
    if (!window.confirm('Remove this listing?')) return
    const { error } = await supabase.from('products').update({ status: 'deleted' }).eq('id', productId)
    if (error) toast.error(error.message)
    else { toast.success('Listing removed'); refetchReports() }
  }

  const handleDismissReport = async (reportId: string) => {
    const { error } = await supabase.from('reports').update({ status: 'dismissed' }).eq('id', reportId)
    if (error) toast.error(error.message)
    else { toast.success('Report dismissed'); refetchReports() }
  }

  if (!isAdmin) {
    return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <ShieldAlert className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Badge variant="default" className="text-xs">Admin</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Listings', value: stats?.products ?? '—', icon: Package, color: 'text-green-600' },
          { label: 'Active Users', value: stats?.users ?? '—', icon: Users, color: 'text-blue-600' },
          { label: 'Pending Reports', value: stats?.pendingReports ?? '—', icon: Flag, color: 'text-red-500' },
          { label: 'Redistributed', value: stats?.completed ?? '—', icon: CheckCircle2, color: 'text-purple-600' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <s.icon className={`h-5 w-5 mb-2 ${s.color}`} />
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="reports">
        <TabsList className="mb-6">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="listings">Recent Listings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          {(reports as { id: string; target_type: string; target_id: string; reason: string; description?: string; created_at: string; reporter?: { full_name: string } }[]).length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-xl">
              <Flag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No pending reports</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(reports as { id: string; target_type: string; target_id: string; reason: string; description?: string; created_at: string; reporter?: { full_name: string } }[]).map((r) => (
                <Card key={r.id}>
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="destructive" className="text-xs capitalize">{r.target_type}</Badge>
                        <span className="text-xs text-muted-foreground">by {r.reporter?.full_name || 'Anonymous'}</span>
                        <span className="text-xs text-muted-foreground">· {formatDate(r.created_at)}</span>
                      </div>
                      <p className="text-sm font-medium capitalize">{r.reason.replace(/_/g, ' ')}</p>
                      {r.description && <p className="text-xs text-muted-foreground mt-1">{r.description}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {r.target_type === 'product' && (
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/products/${r.target_id}`} target="_blank"><Eye className="h-3 w-3" /></Link>
                        </Button>
                      )}
                      {r.target_type === 'product' && (
                        <Button size="sm" variant="destructive" onClick={() => handleRemoveListing(r.target_id)}>Remove</Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleDismissReport(r.id)}>Dismiss</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="listings">
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium">Owner</th>
                  <th className="text-left px-4 py-3 font-medium">City</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(recentProducts as unknown as { id: string; title: string; status: string; city: string; created_at: string; profiles?: { full_name: string } }[]).map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 max-w-[180px] truncate">{p.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.profiles?.full_name || '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.city}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status === 'active' ? 'free' : p.status === 'completed' ? 'completed' : 'secondary'} className="text-xs">
                        {statusLabel(p.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(p.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/products/${p.id}`} target="_blank"><Eye className="h-3 w-3" /></Link>
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleRemoveListing(p.id)}>Remove</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Listings by Category</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={categoryData} layout="vertical" margin={{ left: 60 }}>
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={60} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#16a34a" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Category Distribution</CardTitle></CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                      {categoryData.map((_: unknown, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
