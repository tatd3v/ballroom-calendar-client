export default function BottomNavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
        active ? 'text-primary' : 'text-ink/40 dark:text-white/40'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  )
}
