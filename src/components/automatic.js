import { useState, useEffect } from 'react'
import DataSupplier from './dataSupplier'

function Automatic() {
  const [meno, setMeno] = useState('')
  const [peniaze, setPeniaze] = useState('')
  const [odoslaneUdajeDva, setOdoslaneUdajeDva] = useState([])
  const [inputValues, setInputValues] = useState([])
  const [subtractValue, setSubtractValue] = useState([])
  const [totalMoney, setTotalMoney] = useState(0)
  const [oldMoney, setOldMoney] = useState(1000)
  const [kurz, setKurz] = useState(1)

  useEffect(() => {
    const sum = odoslaneUdajeDva.reduce((total, udaj) => total + parseFloat(udaj.peniaze || 0), 0)
    setTotalMoney(sum)
  }, [odoslaneUdajeDva])

  useEffect(() => {
    if (totalMoney !== 0) {
      const newKurz = kurz / Math.E**(-0.05*((oldMoney / totalMoney) -1 ))
      setKurz(newKurz)
        setOldMoney(totalMoney)
    }
  }, [totalMoney, oldMoney, kurz])

  useEffect(() => {
    // Načítanie údajov z Local Storage pri načítaní komponenty
    const storedUdaje = JSON.parse(localStorage.getItem('odoslaneUdajeDva'));
    if (storedUdaje) setOdoslaneUdajeDva(storedUdaje);
  }, []);

  useEffect(() => {
    // Uloženie údajov do Local Storage pri zmene
    localStorage.setItem('odoslaneUdajeDva', JSON.stringify(odoslaneUdajeDva));
  }, [odoslaneUdajeDva]);

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
    setOdoslaneUdajeDva((prevOdoslaneUdaje) => {
      const updatedUdaje = [...prevOdoslaneUdaje]
      updatedUdaje[index].DK += updatedUdaje[index].VK * kurz
      updatedUdaje[index].VK = 0
      updatedUdaje[index].peniaze = 0
      return updatedUdaje
    })
  }

  const handleConvertToVK = (index) => {
    setOdoslaneUdajeDva((prevOdoslaneUdaje) => {
      const updatedUdaje = [...prevOdoslaneUdaje]
      updatedUdaje[index].VK += updatedUdaje[index].DK / kurz
      updatedUdaje[index].DK = 0
      updatedUdaje[index].peniaze = updatedUdaje[index].VK * 1000
      return updatedUdaje
    })
  }

  const handleSubmitVKValue = (index) => {
    setOdoslaneUdajeDva((prevOdoslaneUdaje) => {
      const updatedUdaje = [...prevOdoslaneUdaje]
      updatedUdaje[index].VK += parseFloat(inputValues[index] || 0)
      updatedUdaje[index].peniaze = updatedUdaje[index].VK * 1000
      setInputValues((prevInputValues) => {
        const newInputValues = [...prevInputValues]
        newInputValues[index] = ''
        return newInputValues
      })
      return updatedUdaje
    })
  }

  const handleSubtractFromVK = (index) => {
    setOdoslaneUdajeDva((prevOdoslaneUdaje) => {
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
    const novaPolozka = { meno, peniaze, VK: peniaze / 1000, DK: 0 }
    setOdoslaneUdajeDva([...odoslaneUdajeDva, novaPolozka])
    setMeno('')
    setPeniaze('')
    setInputValues([...inputValues, ''])
  }

  return (
    <div>
      <h4>Automaticky kurz</h4>
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
      <p>Daný kurz je 1 : {kurz.toFixed(2)}</p>
      <button type="button" onClick={() => {setOdoslaneUdajeDva([]); setKurz(1)}}>vymazat list</button>
      <div>
        {odoslaneUdajeDva.map((udaj, index) => (
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
      <DataSupplier udaje={odoslaneUdajeDva} />
    </div>
  )
}

export default Automatic