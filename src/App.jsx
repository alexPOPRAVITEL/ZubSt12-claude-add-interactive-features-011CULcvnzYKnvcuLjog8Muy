import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  // Add notification
  const addNotification = (message) => {
    const id = Date.now()
    setNotifications([...notifications, { id, message }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    addNotification(`Спасибо, ${formData.name}! Ваше сообщение отправлено.`)
    setFormData({ name: '', email: '', message: '' })
    setShowModal(false)
  }

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>Интерактивное Приложение</h1>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Notifications */}
      <div className="notifications">
        {notifications.map(notif => (
          <div key={notif.id} className="notification">
            {notif.message}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Counter Card */}
        <div className="card">
          <h2>Интерактивный Счетчик</h2>
          <div className="counter-display">{count}</div>
          <div className="button-group">
            <button onClick={() => setCount(count - 1)}>➖ Минус</button>
            <button onClick={() => setCount(0)}>🔄 Сброс</button>
            <button onClick={() => setCount(count + 1)}>➕ Плюс</button>
          </div>
        </div>

        {/* Interactive Buttons */}
        <div className="card">
          <h2>Интерактивные Кнопки</h2>
          <div className="button-group">
            <button onClick={() => addNotification('Кнопка 1 нажата!')}>
              Кнопка 1
            </button>
            <button onClick={() => addNotification('Кнопка 2 нажата!')}>
              Кнопка 2
            </button>
            <button onClick={() => setShowModal(true)}>
              Открыть Форму
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="card">
          <h2>О Приложении</h2>
          <p>Это интерактивное React приложение с различными функциями:</p>
          <ul>
            <li>🌓 Переключение темной/светлой темы</li>
            <li>🔔 Уведомления</li>
            <li>📝 Интерактивные формы</li>
            <li>🎨 Анимации и переходы</li>
            <li>📊 Счетчики и кнопки</li>
          </ul>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h2>Контактная Форма</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Имя:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Сообщение:</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                Отправить
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>Интерактивное приложение на React + Vite</p>
      </footer>
    </div>
  )
}

export default App
