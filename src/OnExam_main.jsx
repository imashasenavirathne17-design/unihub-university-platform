import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './OnExam_index.css'
import App from './OnExam_App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
