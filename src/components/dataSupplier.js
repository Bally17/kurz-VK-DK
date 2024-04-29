import React, { useState, useEffect } from 'react'
import Graf from './graf'

const DataSupplier = ({ udaje }) => {
    const [data, setData] = useState([])

    useEffect(() => {
        if (udaje.length === 0) return setData([])

        const grafData = []

        let vkSum = 0
        let dkSum = 0

        for (let i = 0; i < udaje.length; i++) {
            vkSum += udaje[i].VK
            dkSum += udaje[i].DK

            const name = i === udaje.length - 1 ? 'Aktuálne' : `${i + 1}. zmena`

            grafData.push({
                name: name,
                VK: vkSum,
                DK: dkSum,
            });
        }

        grafData.unshift({
            name: 'Začiatok',
            VK: 0,
            DK: 0,
        });

        setData(grafData)
    }, [udaje])

    return <>
        <p>aktualne je {data.length > 0 ? data[data.length - 1].VK.toFixed(2) : 0} VK a {data.length > 0 ? data[data.length - 1].DK.toFixed(2) : 0} DK.</p>
        <Graf data={data} />
    </>
};

export default DataSupplier