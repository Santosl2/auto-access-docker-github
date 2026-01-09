import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Navbar from '@/components/navbar'
import { createClient } from '@/lib/supabase/server'
import { addMonths, differenceInCalendarDays, format } from 'date-fns'

interface AccessRequest {
  id: string
  github_username: string
  email: string
  status: 'pending' | 'approved' | 'failed'
  docker_token?: string | null
  valor_venda?: number | null
  observacao?: string | null
  created_at: string
}

interface ClientWithSupport extends AccessRequest {
  supportEndsAt: Date
  supportActive: boolean
  daysRemaining: number
}

const SUPPORT_MONTHS = 6

const buildClientSupport = (
  request: AccessRequest,
  now: Date
): ClientWithSupport => {
  const createdAt = new Date(request.created_at)
  const supportEndsAt = addMonths(createdAt, SUPPORT_MONTHS)
  const daysRemaining = differenceInCalendarDays(supportEndsAt, now)
  const supportActive = supportEndsAt.getTime() >= now.getTime()

  return {
    ...request,
    supportEndsAt,
    supportActive,
    daysRemaining: Math.max(0, daysRemaining),
  }
}

export const metadata = {
  title: 'Clients Support Coverage',
  description: 'Track clients that have active or expired support windows',
}

export default async function ClientsSupportPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('access_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="border-red-500/30 bg-red-500/10">
            <CardHeader>
              <CardTitle className="text-red-200">Unable to load clients</CardTitle>
              <CardDescription className="text-red-200/80">
                {error.message}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    )
  }

  const now = new Date()
  const clients = (data || [])
    .filter(request => request.status === 'approved')
    .map(request => buildClientSupport(request as AccessRequest, now))

  const activeCount = clients.filter(client => client.supportActive).length
  const expiredCount = clients.length - activeCount
  const avgDaysRemaining = clients.length
    ? Math.round(
        clients.reduce((total, client) => total + client.daysRemaining, 0) /
          clients.length
      )
    : 0

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-300/80">
            Client Support
          </p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Clients you have sold</h1>
              <p className="text-slate-300 max-w-2xl">
                Support stays active for {SUPPORT_MONTHS} months after the
                request is approved. Quickly see who is covered and who needs
                a renewal.
              </p>
            </div>
            <Badge className="bg-blue-500/20 text-blue-200 border-blue-500/40 px-4 py-2 text-sm">
              Support window: {SUPPORT_MONTHS} months
            </Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-slate-700/80 bg-slate-800/60">
            <CardHeader className="pb-2">
              <CardDescription>Total clients</CardDescription>
              <CardTitle className="text-3xl">{clients.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">
                Approved requests counted as sold clients.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-600/50 bg-emerald-900/20">
            <CardHeader className="pb-2">
              <CardDescription>Support active</CardDescription>
              <CardTitle className="text-3xl">{activeCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-emerald-200/80">
                Inside the {SUPPORT_MONTHS}-month support window.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-600/40 bg-amber-900/20">
            <CardHeader className="pb-2">
              <CardDescription>Average days remaining</CardDescription>
              <CardTitle className="text-3xl">{avgDaysRemaining}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-200/80">
                Across all active and expired clients.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-600/40 bg-purple-900/20">
            <CardHeader className="pb-2">
              <CardDescription>Total sales</CardDescription>
              <CardTitle className="text-2xl">
                R$ {clients.reduce((sum, client) => sum + (client.valor_venda || 0), 0).toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-200/80">
                Sum of all sales recorded.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-700 bg-slate-800/60">
          <CardHeader className="border-b border-slate-700 pb-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Support coverage</CardTitle>
                <CardDescription>
                  Clients are considered sold once the request status is
                  approved.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-slate-600 text-slate-200">
                Last updated {format(now, 'MMM d, yyyy p')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            {clients.length === 0 ? (
              <div className="p-6 text-center text-slate-300">
                No approved clients yet.
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-900/50">
                  <TableRow>
                    <TableHead className="text-slate-300">Client</TableHead>
                    <TableHead className="text-slate-300">Email</TableHead>
                    <TableHead className="text-slate-300">Valor de Venda</TableHead>
                    <TableHead className="text-slate-300">Support status</TableHead>
                    <TableHead className="text-slate-300">Sold on</TableHead>
                    <TableHead className="text-slate-300">Support ends</TableHead>
                    <TableHead className="text-slate-300">Days left</TableHead>
                    <TableHead className="text-slate-300">Observação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map(client => (
                    <TableRow key={client.id} className="border-slate-700/80">
                      <TableCell>
                        <div className="font-semibold text-white">
                          @{client.github_username}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {client.email}
                      </TableCell>
                      <TableCell className="text-slate-200 font-semibold">
                        {client.valor_venda ? (
                          <span className="text-green-400">
                            R$ {client.valor_venda.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {client.supportActive ? (
                          <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-500/40">
                            Support active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/20 text-red-200 border-red-500/40">
                            Support expired
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-200">
                        {format(new Date(client.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-slate-200">
                        {format(client.supportEndsAt, 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-slate-200">
                        {client.supportActive ? `${client.daysRemaining} days` : 'Expired'}
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm max-w-xs truncate">
                        {client.observacao ? (
                          <span title={client.observacao}>{client.observacao}</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
    </>
  )
}
