import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

const Enviroment = () => {
    const enviromentData = [
        {
            name: 'Garden',
            url: 'https://i.ibb.co/wrYrKqL/garden.png',
            num: 3
        },
        {
            name: 'Skilliza Metaverce',
            url: 'https://i.ibb.co/qDdTvL2/3-1.png',
            num: 2
        },
        {
            name: 'Lounge Bar',
            url: 'https://i.ibb.co/0jL6HRm/new-6.jpg',
            num: 1
        },
        {
            name: 'Art Gallery',
            url: 'https://i.ibb.co/mBfsDW7/ArtNew.jpg',
            num: 0
        }
    ]
    const router = useRouter()
    const handleenviroment = (num) =>{
        router.push(`/spaces/unity?type=spaces&id=AQw8hFNDi0xFYl1KafXL&name=MOHD+ZAID+DEGINE&sceneId=DmoakA7G6EMESqE52vUK&numb=${num}`)
    }
    return (
        <div className="enviroment-conatiner">
            <div className="bottom-line-container-home">
            </div>
            <div className="enviroment-card">
                {
                    enviromentData &&
                    enviromentData.map((item) => {
                        return (
                            <div className="enviroment-card-child" onClick={() => handleenviroment(item.num)}>
                                <div className="enviroment-card-image">
                                    <Image src={item.url} layout='fill'alt={`enviroment${item.num}`}/>
                                </div>
                                <div className="enviroment-card-text">{item.name}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>

    )
}

export default Enviroment