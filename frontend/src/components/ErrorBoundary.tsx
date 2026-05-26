import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App render error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#fafafa', color: '#18181b' }}>
          <div className="max-w-lg w-full rounded-xl border border-red-200 bg-white p-6 shadow-lg">
            <h1 className="text-lg font-semibold text-red-700 mb-2">Something went wrong</h1>
            <p className="text-sm text-zinc-600 mb-4">
              The page failed to render. Try a hard refresh. If the problem persists, clear site data for this origin.
            </p>
            <pre className="text-xs overflow-auto rounded-lg bg-zinc-100 p-3 text-zinc-800">
              {this.state.error.message}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-medium"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
