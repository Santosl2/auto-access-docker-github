import AccessRequestForm from '@/components/access-request-form'
import Navbar from '@/components/navbar'

export const metadata = {
  title: 'GitHub Access Request',
  description:
    'Request access to private repository, Docker image and get credentials',
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-4rem)] flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Access Private Resources
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Request access to our private GitHub repository, Docker image, and
              get your credentials automatically
            </p>
          </div>

          <div className="flex justify-center">
            <AccessRequestForm />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-400 text-xl">🔗</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                GitHub Access
              </h3>
              <p className="text-slate-300 text-sm">
                Automatic access to private repository
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-purple-400 text-xl">🐳</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Docker Token
              </h3>
              <p className="text-slate-300 text-sm">
                Generated Docker Hub credentials
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-green-400 text-xl">✉️</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Email Delivery
              </h3>
              <p className="text-slate-300 text-sm">
                Receive credentials via Resend
              </p>
            </div>
          </div>
        </div>
        </div>
      </main>
    </>
  )
}
