// Esta tela já tem a estrutura visual. Sua tarefa é ligá-la à API e ao estado React.
// Consulte docs/checkpoint-04.md antes de substituir os dados de exemplo.
import { useEffect, useState } from 'react'
import { listEvents, register } from './api.js'

export default function App() {
  const [userId, setUserId] = useState(1)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sendingId, setSendingId] = useState(null)
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    listEvents()
      .then(setEvents)
      .catch(() => setError('Não foi possível carregar os eventos.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleRegister(eventId) {
  if (sendingId !== null) return
  setSendingId(eventId)
  setMessage('')
  setActionError('')
  try {
    await register(eventId, userId)
    const updated = await listEvents()
    setEvents(updated)
    setMessage('Inscrição realizada com sucesso!')
  } catch (error) {
    setActionError(error.message)
  } finally {
    setSendingId(null)
  }
}

  return <main className="page">
    <header>
      <p className="eyebrow">Trilha · Laboratório Full Stack</p>
      <h1>Eventos</h1>
      <p>Encontre uma atividade e garanta sua vaga.</p>
    </header>

    <label className="user-picker">Participante de demonstração
      <select value={userId} onChange={event => setUserId(Number(event.target.value))}>
        <option value="1">Pessoa 1</option>
        <option value="2">Pessoa 2</option>
      </select>
    </label>

    {message && <p role="status">{message}</p>}
    {actionError && <p role="alert">{actionError}</p>}

    <section aria-label="Lista de eventos" className="events">
      {loading && <p>Carregando eventos...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && events.length === 0 && <p>Nenhum evento disponível.</p>}
      {events.map(event => (
        <article className="card" key={event.id}>
          <p className="date">{event.date}</p>
          <h2>{event.title}</h2>
          <p>
            {event.available_slots}{' '}
            {event.available_slots === 1 ? 'vaga disponível' : 'vagas disponíveis'}
          </p>
          <button
            type="button"
            onClick={() => handleRegister(event.id)}
            disabled={sendingId === event.id || event.available_slots === 0}
          >
            {event.available_slots === 0 ? 'Esgotado' : 'Inscrever-se'}
          </button>
        </article>
      ))}
    </section>
  </main>
}