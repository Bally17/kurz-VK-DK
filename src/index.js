import { createRoot} from 'react-dom/client'
import App from './App'
import './index.css'
const container = document.getElementById('result')
const root = createRoot(container)
root.render(<App tab='home' />)