'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { CheckCircle, Clock, Copy, RefreshCw, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AccessRequest {
  id: string
  github_username: string
  email: string
  status: 'pending' | 'approved' | 'failed'
  docker_token?: string
  valor_venda?: number | null
  observacao?: string | null
  created_at: string
}

export default function RequestsDashboard() {
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/access-request')
      const data = await response.json()
      setRequests(data.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
    // Refresh every 10 seconds
    const interval = setInterval(fetchRequests, 10000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-yellow-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Approved
          </Badge>
        )
      case 'failed':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Failed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Pending
          </Badge>
        )
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-2" />
          <p className="text-slate-300">Loading requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Access Requests</h2>
        <Button
          onClick={fetchRequests}
          variant="outline"
          size="sm"
          className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 bg-transparent"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-500/20 bg-red-500/10">
          <CardContent className="pt-6">
            <p className="text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {requests.length === 0 ? (
        <Card className="border-slate-700 bg-slate-800/50">
          <CardContent className="pt-6">
            <p className="text-slate-400 text-center">No access requests yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map(request => (
            <Card
              key={request.id}
              className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 transition"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <p className="font-semibold text-white">
                          @{request.github_username}
                        </p>
                        <p className="text-sm text-slate-400">
                          {request.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {getStatusBadge(request.status)}
                      <span className="text-xs text-slate-400">
                        {format(
                          new Date(request.created_at),
                          'MMM d, yyyy h:mm a'
                        )}
                      </span>
                    </div>

                    {request.valor_venda && (
                      <div className="mt-2 p-2 bg-blue-500/10 rounded border border-blue-500/30">
                        <p className="text-xs text-blue-300">
                          <span className="font-semibold">Valor de Venda:</span> R$ {request.valor_venda.toFixed(2)}
                        </p>
                      </div>
                    )}

                    {request.observacao && (
                      <div className="mt-2 p-2 bg-slate-700/30 rounded border border-slate-600">
                        <p className="text-xs text-slate-300">
                          <span className="font-semibold">Observação:</span> {request.observacao}
                        </p>
                      </div>
                    )}

                    {request.status === 'approved' && request.docker_token && (
                      <div className="mt-4 p-3 bg-slate-700/30 rounded border border-slate-600 space-y-2">
                        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Docker Token
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs bg-slate-900 p-2 rounded border border-slate-600 text-slate-200 break-all">
                            {request.docker_token.substring(0, 20)}...
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              copyToClipboard(
                                request.docker_token || '',
                                request.id
                              )
                            }
                            className="text-slate-400 hover:text-white hover:bg-slate-600"
                          >
                            {copiedId === request.id ? (
                              <span className="text-xs">Copied</span>
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
