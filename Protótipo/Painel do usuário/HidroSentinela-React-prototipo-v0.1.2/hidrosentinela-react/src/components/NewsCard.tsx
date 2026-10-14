import type { NewsItem } from '../types'

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="news-card">
      <img src={item.image} alt="" />
      <div className="news-card-body">
        <div className="news-meta">{item.category} · {item.date} · {item.time}</div>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <button className="link-button">Ver detalhes <span>→</span></button>
      </div>
    </article>
  )
}
