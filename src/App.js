import {useState} from 'react'
import Manual from './components/manual'
import Automatic from './components/automatic'

const App = () => {
  const [title, setTitle] = useState('klik na automaticky kurz')
  const [show, setShow] = useState(true)

  const clickBtn = () => {
    setShow(!show)
    if (show) {
      setTitle('klik na manualny kurz')
    } else {
      setTitle('klik na automaticky kurz')
    }
  }

  return <>
    <button type="button" onClick={clickBtn}>{title}</button>
    <p></p>
    {show ? (<Manual />) : (<Automatic />)}
  </>
}

export default App