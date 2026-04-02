export function Footer() {
  return (
    <footer className="bg-[#0A0806] border-t border-magnata-border mt-20 py-12 px-6 text-center">
      <div className="text-3xl mb-3 select-none">🍕</div>
      <div className="font-serif text-xl font-black tracking-[0.3em] text-magnata-gold mb-2">
        MAGNATA
      </div>
      <p className="font-sans text-xs text-magnata-dim mb-1">
        A pizza que você merece, entregue com carinho.
      </p>
      <p className="font-sans text-[10px] text-magnata-dim/50 mt-4">
        © {new Date().getFullYear()} Pizzaria Magnata · Goiânia — GO
      </p>
    </footer>
  )
}
