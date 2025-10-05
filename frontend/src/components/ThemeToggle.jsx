import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 border-2 border-neutral-300 dark:border-neutral-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
      aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      title={theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-neutral-700 transition-transform duration-300" />
      ) : (
        <Sun className="w-5 h-5 text-accent-400 transition-transform duration-300" />
      )}
    </button>
  )
}
