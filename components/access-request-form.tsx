'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { useState } from 'react'

export default function AccessRequestForm() {
  const [github, setGithub] = useState('')
  const [email, setEmail] = useState('')
  const [dockerToken, setDockerToken] = useState('')
  const [valorVenda, setValorVenda] = useState('')
  const [observacao, setObservacao] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/access-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          github_username: github.trim(),
          email: email.trim(),
          dockerToken: dockerToken.trim(),
          valor_venda: valorVenda ? Number.parseFloat(valorVenda) : null,
          observacao: observacao.trim() || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to submit request')
        return
      }

      setSuccess(true)
      setGithub('')
      setEmail('')
      setDockerToken('')
      setValorVenda('')
      setObservacao('')

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border border-slate-700 bg-slate-800/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Request Access</CardTitle>
        <CardDescription className="text-slate-300">
          Enter your GitHub username to request access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github" className="text-slate-200">
              GitHub Username (opcional)
            </Label>
            <Input
              id="github"
              placeholder="your-github-username"
              value={github}
              onChange={e => setGithub(e.target.value)}
              disabled={loading}
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-400">
              The username will be added to the private repository
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">
              Email Address (optional )
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
            <p className="text-xs text-slate-400">
              We'll send your Docker credentials here
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dockerToken" className="text-slate-200">
              Docker token
            </Label>
            <Input
              id="dockerToken"
              type="text"
              placeholder="dckr_pat_xxxxxxxxxxxxxxxxxxxx"
              value={dockerToken}
              onChange={e => setDockerToken(e.target.value)}
              disabled={loading}
              required
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorVenda" className="text-slate-200">
              Valor de Venda (opcional)
            </Label>
            <Input
              id="valorVenda"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={valorVenda}
              onChange={e => setValorVenda(e.target.value)}
              disabled={loading}
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao" className="text-slate-200">
              Observação (opcional)
            </Label>
            <textarea
              id="observacao"
              placeholder="Digite suas anotações aqui..."
              value={observacao}
              onChange={e => setObservacao(e.target.value)}
              disabled={loading}
              className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 flex gap-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 flex gap-2 text-sm text-green-400">
              <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>
                Request submitted! Check your email for access details.
              </span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 h-10"
            disabled={loading || !dockerToken.trim()}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              'Request Access'
            )}
          </Button>

          <p className="text-xs text-slate-400 text-center">
            By submitting this form, you agree to our terms of service
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
