/** Tempo relativo desde uma data ISO */
export function timeAgo(iso: string): string {
  const minutes = (Date.now() - new Date(iso).getTime()) / 60_000
  if (minutes < 1)  return 'agora'
  if (minutes < 60) return `${Math.floor(minutes)}min atrás`
  const hours = minutes / 60
  if (hours < 24)   return `${Math.floor(hours)}h atrás`
  return `${Math.floor(hours / 24)}d atrás`
}

/** Formata data para exibição */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day:    '2-digit',
    month:  '2-digit',
    hour:   '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

/** Gera um UUID v4 no client */
export function uuid(): string {
  return crypto.randomUUID()
}

/** Capitaliza a primeira letra */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/** Trunca texto com ellipsis */
export function truncate(str: string, max: number): string {
  return str.length > max ? `${str.slice(0, max)}…` : str
}
