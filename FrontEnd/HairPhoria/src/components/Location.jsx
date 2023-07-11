import { useEffect, useState } from 'react'
import '../styles/Modal.css';
import "../styles/AddCitys.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';

const Location = ({ nuevaCiudad, setNuevaCiudad }) => {

    const [direccion, setDireccion] = useState('');
    const direccionReplace = direccion.replaceAll(" ", "%20")

    const [departamento, setDepartamento] = useState('')
    console.log(direccionReplace)

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        sessionStorage.setItem("ciudad", JSON.stringify(nuevaCiudad))

        const ciudad = nuevaCiudad.ciudad;



        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=Colombia,${departamento},${ciudad},${direccionReplace}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log("url", url)
            console.log("data: ", data)

            if (data.length > 0) {
                const latitud = parseFloat(data[0].lat);
                console.log("lati", latitud)
                const longitud = parseFloat(data[0].lon);
                console.log("longi", longitud)

                sessionStorage.setItem(
                    'ciudad',
                    JSON.stringify({
                        ciudad,
                        coordenadas: {
                            x: latitud,
                            y: longitud,
                        },
                        direccion: direccion
                    })
                );
                setNuevaCiudad({
                    ciudad: ciudad,
                    coordenadas: {
                        x: parseFloat(latitud),
                        y: parseFloat(longitud)
                    },
                    direccion: direccion
                });


            }

            // Resto del código
        } catch (error) {
            console.log('Error:', error);
        }

        setIsOpen(false)
        swal({
            text: "La ciudad ingresada fue añadida, por favor selecciona la nueva ciudad antes de agregar el servicio para que sea agregada exitosamente.",
            icon: "success",
            button: "Aceptar",
        });


        setNuevaCiudad({
            ciudad: "",
            coordenadas: {
                x: "",
                y: ""
            },
            direccion: ""
        });
    };
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };
    return (
        <div className="locationContainer">
            <div
                onClick={openModal}
                className='buttonLocation'>
                Añadir ciudad
            </div>

            {isOpen && (
                <div className="modal-overlay">
                    <div className="modalContainerCity">
                        <button className="modalClose" onClick={closeModal} style={{background: "none", border: "none"}}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                        <div className="formLocation">
                            <div >
                                <label htmlFor="departamento">Departamento*</label>
                                <input
                                    type="text"
                                    name="departamento"
                                    id="departamento"
                                    placeholder="Ejemplo: Atlantico"
                                    value={departamento}
                                    onChange={(e) => setDepartamento(e.target.value)
                                    }
                                />
                                <label htmlFor="cityname">Ciudad*</label>
                                <input
                                    type="text"
                                    name="cityname"
                                    id="cityname"
                                    placeholder="Ingrese el nombre de la ciudad"
                                    value={nuevaCiudad.ciudad}
                                    onChange={(e) =>
                                        setNuevaCiudad({
                                            ...nuevaCiudad,
                                            ciudad: e.target.value
                                        })
                                    }
                                />
                                <label htmlFor="direccion">Dirección*</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    id="direccion"
                                    placeholder="Ejemplo: Calle 19 # 24 -36a"
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)
                                    }
                                />

                                <button className="buttonSubmitCity" type="submit" onClick={handleFormSubmit} >
                                    Agregar
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default Location