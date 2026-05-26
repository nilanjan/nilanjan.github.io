import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme, type ThemeMode } from '../context/ThemeContext'

const modes: { value: ThemeMode; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light Mode' },
  { value: 'dark', icon: Moon, label: 'Dark Mode' },
  { value: 'system', icon: Monitor, label: 'System Mode' },
]

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div
      className="hidden sm:flex items-center rounded-full p-0.5"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
      role="group"
      aria-label="Appearance"
    >
      {modes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-label={label}
          aria-pressed={theme === value}
          className="p-1.5 rounded-full transition-colors duration-150"
          style={{
            color: theme === value ? 'var(--text)' : 'var(--text-muted)',
            backgroundColor: theme === value ? 'var(--surface)' : 'transparent',
          }}
        >
          <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>
      ))}
    </div>
  )
}

export default ThemeToggle
