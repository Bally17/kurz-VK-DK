import { useState, useEffect } from 'react'
import DataSupplier from './dataSupplier'

function Manual() {
  const [meno, setMeno] = useState('')
  const [peniaze, setPeniaze] = useState('')
  const [odoslaneUdaje, setOdoslaneUdaje] = useState([])
  const [kurz, setKurz] = useState(1)
  const [inputValues, setInputValues] = useState([])
  const [subtractValue, setSubtractValue] = useState([])
  
  useEffect(() => {
    // Načítanie údajov z Local Storage pri načítaní komponenty
    const storedUdaje = JSON.parse(localStorage.getItem('odoslaneUdaje'));
    if (storedUdaje) setOdoslaneUdaje(storedUdaje);
  }, []);

  useEffect(() => {
    // Uloženie údajov do Local Storage pri zmene
    localStorage.setItem('odoslaneUdaje', JSON.stringify(odoslaneUdaje));
  }, [odoslaneUdaje]);

  const handleMenoChange = (event) => {
    setMeno(event.target.value)
  }

  const handlePeniazeChange = (event) => {
    const input = event.target.value
    if (!isNaN(input) || input === '') {
      setPeniaze(input)
    }
  }

  const handleConvertToDK = (index) => {
    setOdoslaneUdaje((prevOdoslaneUdaje) => {
      const updatedUdaje = [...prevOdoslaneUdaje]
      updatedUdaje[index].DK += updatedUdaje[index].VK * kurz
      updatedUdaje[index].VK = 0
      updatedUdaje[index].peniaze = 0
      updatedUdaje[index].showVK = false
      return updatedUdaje
    })
  }

  const handleConvertToVK = (index) => {
    setOdoslaneUdaje((prevOdoslaneUdaje) => {
      const updatedUdaje = [...prevOdoslaneUdaje]
      updatedUdaje[index].VK += updatedUdaje[index].DK / kurz
      updatedUdaje[index].DK = 0
      updatedUdaje[index].peniaze = updatedUdaje[index].VK * 1000
      updatedUdaje[index].showVK = true
      return updatedUdaje
    })
  }

  const handleSubmitVKValue = (index) => {
    setOdoslaneUdaje((prevOdoslaneUdaje) => {
      const updatedUdaje = [...prevOdoslaneUdaje]
      updatedUdaje[index].VK += parseFloat(inputValues[index] || 0)
      updatedUdaje[index].peniaze = updatedUdaje[index].VK * 1000
      setInputValues((prevInputValues) => {
        const newInputValues = [...prevInputValues];
        newInputValues[index] = ''
        return newInputValues
      })
      return updatedUdaje
    })
  }

  const handleSubtractFromVK = (index) => {
    setOdoslaneUdaje((prevOdoslaneUdaje) => {
      const updatedUdaje = [...prevOdoslaneUdaje]
      const subtract = parseFloat(subtractValue[index] || 0)
      updatedUdaje[index].VK = Math.max(updatedUdaje[index].VK - subtract, 0)
      updatedUdaje[index].peniaze = updatedUdaje[index].VK * 1000
      setSubtractValue((prevInputValues) => {
        const newInputValues = [...prevInputValues]
        newInputValues[index] = ''
        return newInputValues
      })
      return updatedUdaje
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const novaPolozka = { meno, peniaze, VK: peniaze / 1000, DK: 0, showVK: true }
    setOdoslaneUdaje([...odoslaneUdaje, novaPolozka])
    setMeno('')
    setPeniaze('')
    setInputValues([...inputValues, ''])
  }

  const handleKurzChange = (event) => {
    const input = event.target.value
    if (!isNaN(input) && input > 0) {
      setKurz(input)
    }
  }

  return (
    <div>
      <h4>Manualny kurz</h4>
      <form onSubmit={handleSubmit}>
        <label>
          Meno:
          <input type="text" value={meno} onChange={handleMenoChange} />
        </label>
        <label>
          Peniaze:
          <input type="number" min="0" step="1000" value={peniaze} onChange={handlePeniazeChange} />
        </label>
        <button type="submit">Odoslať</button>
      </form>
      <p>Daný kurz je 1 : <input type="number" min="0" step="0.1" value={kurz} onChange={handleKurzChange} /></p>
      <button type="button" onClick={() => setOdoslaneUdaje([])}>vymazat list</button>
      <div>
        {odoslaneUdaje.map((udaj, index) => (
          <div key={index}>
            <p>Meno: {udaj.meno}</p>
            <p>Peniaze: {parseFloat(udaj.peniaze).toFixed(2)}</p>
            <p>VK: {udaj.VK}</p>
            <p>DK: {udaj.DK}</p>
            <label>
              Pridať k VK:
              <input type="number" min="0" step="1" value={inputValues[index] || ''} onChange={(event) => {
                const newInputValues = [...inputValues]
                newInputValues[index] = event.target.value
                setInputValues(newInputValues)
              }} />
            </label>
            <button onClick={() => handleSubmitVKValue(index)}>Pridať k VK</button>
            {udaj.VK !== 0 && (
              <>
                <label>
                  Odrátať z VK:
                  <input type="number" min="0" step="1" max={udaj.VK} value={subtractValue[index] || ''} onChange={(event) => {
                    const newInputValues = [...subtractValue]
                    newInputValues[index] = event.target.value
                    setSubtractValue(newInputValues)
                  }} />
                </label>
                <button onClick={() => handleSubtractFromVK(index)}>Odrátať z VK</button>
              </>
            )}
            {(udaj.VK && udaj.DK) ? (
              <>
                <button onClick={() => handleConvertToVK(index)}>Premeniť na VK</button>
                <button onClick={() => handleConvertToDK(index)}>Premeniť na DK</button>  
              </>
            ) : (
              udaj.VK ? (
                <button onClick={() => handleConvertToDK(index)}>Premeniť na DK</button>
              ) : (
                <button onClick={() => handleConvertToVK(index)}>Premeniť na VK</button>
              )
            )}
          </div>
        ))}
      </div>
      <DataSupplier udaje={odoslaneUdaje} />
    </div>
  )
}

export default Manual