import {useState} from 'react'
import First from './components/first'
import Second from './components/second'

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
    {show ? (<First />) : (<Second />)}
  </>
}

export default App