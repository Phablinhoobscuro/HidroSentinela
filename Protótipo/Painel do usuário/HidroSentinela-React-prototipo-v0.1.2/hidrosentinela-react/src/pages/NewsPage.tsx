import { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { ErrorState } from '../components/ErrorState'
import { Loading } from '../components/Loading'
import { NewsCard } from '../components/NewsCard'
import { SectionHeader } from '../components/SectionHeader'
import { useAsyncData } from '../hooks/useAsyncData'
import { getNews } from '../services/newsService'

const categories = [['all', 'Todas'], ['comunicados', 'Comunicados'], ['prevenção', 'Prevenção'], ['ações', 'Ações da Prefeitura']] as const

export function NewsPage() {
  const loadNews = useCallback(() => getNews(), [])
  const news = useAsyncData(loadNews)
  const [filter, setFilter] = useState<string>('all')
  const filtered = useMemo(() => filter === 'all' ? news.data ?? [] : news.data?.filter((item) => item.category === filter) ?? [], [filter, news.data])

  if (news.loading) return <Loading />
  if (news.error) return <ErrorState message={news.error.message} onRetry={() => void news.reload()} />

  return <div className="page"><header className="page-header"><div><p className="eyebrow">Informações</p><h1>Notícias e Informações</h1><p>Fique informado sobre as últimas atualizações do cenário demonstrativo.</p></div></header><section className="section-block"><SectionHeader title="Publicações" /><div className="filter-tabs">{categories.map(([value, label]) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => { setFilter(value); toast.info(`Filtro: ${label}`) }}>{label}</button>)}</div><div className="news-list">{filtered.map((item) => <NewsCard key={item.id} item={item} />)}</div></section></div>
}
