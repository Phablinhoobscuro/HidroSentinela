import { toast } from 'react-toastify'
import { SectionHeader } from '../components/SectionHeader'

export function SettingsPage() {
  return <div className="page"><header className="page-header"><div><p className="eyebrow">Preferências</p><h1>Configurações</h1><p>Ajustes básicos da experiência do protótipo.</p></div></header><section className="section-block settings"><SectionHeader title="Experiência do usuário" description="Nesta versão, as opções são apenas demonstrativas." /><label className="setting-row"><div><strong>Região principal</strong><span>São Torquato – Vila Velha/ES</span></div><span className="setting-control">Ativa</span></label><label className="setting-row"><div><strong>Dados demonstrativos</strong><span>O protótipo utiliza dados fictícios.</span></div><span className="setting-control active">Ativo</span></label><button className="btn btn-primary" onClick={() => toast.success('Preferências demonstrativas mantidas.')}>Salvar preferências</button></section></div>
}
