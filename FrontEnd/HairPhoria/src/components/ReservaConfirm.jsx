import React from 'react'
import { useGlobalStates } from '../Context/Context';
import EmailVideo from "../assets/emailVideo/emailConfirm.mp4"
import "../styles/ReservaConfirm.css"

const ReservaConfirm = () => {
    const { getDataFilterIdByEmail } = useGlobalStates();
    const { clienteDataFetch } = getDataFilterIdByEmail();
    console.log(clienteDataFetch);


    return (
        <div className='containerReserva'>
            <div className="contentReserva">
                <video autoPlay loop muted src={EmailVideo} className='emailVideo'>
                </video>
                <div className="contentInfoReserva">
                    <h3 className="titleReserva">¡{clienteDataFetch?.nombre} agradecemos tu reserva en Hairphoria!</h3>
                    <p>
                        En la bandeja de entrada de tu correo <span className="textBold">{clienteDataFetch?.email}</span> encontrarás toda la información sobre la reserva.
                        Si surge alguna inconveniencia, dentro de <span className="textBold">"Ver perfil"</span> en <span className="textBold">"Reservas"</span> podrás
                        actualizar el turno hasta 24 horas antes.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default ReservaConfirm