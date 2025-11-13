import RequestsDashboard from '@/components/requests-dashboard'

export const metadata = {
  title: 'Access Requests Dashboard',
  description: 'View and manage access requests',
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-300">
            Monitor and manage all access requests in real-time
          </p>
        </div>

        <RequestsDashboard />
      </div>
    </main>
  )
}
