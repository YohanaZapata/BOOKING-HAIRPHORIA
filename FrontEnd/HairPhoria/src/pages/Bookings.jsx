import { useEffect, useState } from 'react'
import "../styles/Bookings.css"
import CardFront from "../assets/svg/cardFrontReserva.png"
import CardBack from "../assets/svg/cardBackReserva.png"
import LogoHairphoria from "../assets/logo/logoBlack/android-chrome-192x192.png"
import { faEye, faPenToSquare, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetProfesionales } from '../hooks/useGetProfesionales'
import ReactDatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import { useDatePicker } from '../Context/DatePickerContext'
import { useGlobalStates } from '../Context/Context'
import { usePutTurno } from '../hooks/usePutTurno'
import useGetTurnosCliente from '../hooks/useGetTurnosCliente'
import swal from 'sweetalert'

const Bookings = () => {

  //ordenamiento de turnos para edicion
  const { turnosCliente, getTurnosClientes } = useGetTurnosCliente();
  const [updatedTurnos, setUpdatedTurnos] = useState([]);
  // Ordenar los turnos por fecha de más cercana a más lejana
  const turnosOrdenados = updatedTurnos.sort((a, b) => {
    const fechaInicioA = new Date(a.fecha_hora_inicio);
    const fechaInicioB = new Date(b.fecha_hora_inicio);

    return fechaInicioA - fechaInicioB;
  });


  // Obtener la fecha y hora actual en UTC-5 (Colombia)
  const fechaActual = new Date().toLocaleString("en-US", { timeZone: "America/Bogota" });

  // Filtrar los turnos que estén dentro del límite de tiempo de edición (menor o igual a 24 horas)
  const turnosFiltrados = turnosOrdenados?.filter((turno) => {
    const fechaInicio = new Date(turno.fecha_hora_inicio).toLocaleString("en-US", { timeZone: "America/Bogota" });
    const tiempoRestante = new Date(fechaInicio) - new Date(fechaActual); // Restar las fechas para obtener el tiempo en milisegundos
    const tiempoEnHoras = tiempoRestante / (1000 * 60 * 60); // Convertir a horas

    return tiempoEnHoras > 24; // Retornar true si el tiempo restante es mayor a 24 horas
  });
  console.log("turnos filtrados", turnosFiltrados)


  //filtro solo turnos anteriores a la fecha actual para el historial de turnos
  const turnosHistorial = turnosOrdenados?.filter((turno) => {
    const fechaInicio = new Date(turno.fecha_hora_inicio).toLocaleString("en-US", { timeZone: "America/Bogota" });
    return fechaInicio < fechaActual;
  })


  //filtro solo turnos despues de la fecha actual para tus proximas reservas
  const turnosProximos = turnosOrdenados?.filter((turno) => {
    const fechaInicio = new Date(turno.fecha_hora_inicio).toLocaleString("en-US", { timeZone: "America/Bogota" });
    return fechaInicio > fechaActual; //Retornar true si el tiempo restante es menor a 24 horas
  })

  //filtrado profesionales segun especialidad del turno
  const { dataFetchProfesionales, isLoadingProfesionales } = useGetProfesionales();
  const profesionales = dataFetchProfesionales;
  const [filtroProfesionales, setFiltroProfesionales] = useState(null);
  const [turnoSeleccionadoIndex, setTurnoSeleccionadoIndex] = useState(null);

  useEffect(() => {
    if (turnoSeleccionadoIndex !== null) {
      const turnoSeleccionado = turnosOrdenados[turnoSeleccionadoIndex];
      const especialidadTurno = turnoSeleccionado?.servicio?.especialidad;

      const profesionalesFiltrados = profesionales?.filter((profesional) => {
        return profesional?.especialidades?.some((especialidad) =>
          especialidad.includes(especialidadTurno)
        );
      });

      setFiltroProfesionales(profesionalesFiltrados);
    }
  }, [turnoSeleccionadoIndex, turnosOrdenados, profesionales]);


  //estados booking turno
  const [paginaActual, setPaginaActual] = useState('pageReserva');
  const [changeBackground, setChangeBackground] = useState(true);


  const handleChangePage = (page) => {
    setPaginaActual(page);
    setChangeBackground(page === "pageReserva");
  }

  // funcion flip de card
  const [isFlipped, setIsFlipped] = useState([]);

  const handleClickFlipped = (index, event) => {
    const isPressVerTurno = event.target.classList.contains("pressVerTurno");
    const isPressEdit = event.target.classList.contains("pressEdit");

    if (isPressVerTurno || isPressEdit) {
      setTurnoSeleccionadoIndex(index);

      setIsFlipped((prevFlips) => {
        const newFlips = [...prevFlips];
        newFlips[index] = !newFlips[index];
        return newFlips;
      });
    }
  };



  //form put turno
  const { getDataFilterIdByEmail } = useGlobalStates();
  const { clienteDataFetch } = getDataFilterIdByEmail();
  //filtrar para cliente id
  const clienteId = clienteDataFetch?.id;
  console.log(clienteId)


  let horasDisponibles = [];
  const {
    startDate,
    CustomDatePickerInput,
    busqueda,
    setBusqueda,

  } = useDatePicker();



  const [profesionalSelected, setProfesionalSelected] = useState({});
  const diasHabilesProfesionales = profesionalSelected?.horarios?.map(
    (dia) => dia.dia
  );
  const selectedDate = new Date(busqueda.fecha);
  const nombreDia = selectedDate.toLocaleDateString("es-ES", {
    weekday: "long",
  });


  const emailProfesionalTurno = turnosProximos?.[turnoSeleccionadoIndex]?.profesional?.email
  console.log("turnosFiltrados: ", turnosFiltrados)
  console.log("turnosProximos: ", turnosProximos)

  const categoria = turnosProximos?.[turnoSeleccionadoIndex]?.servicio?.especialidad
  console.log("categoria", categoria)
  console.log("emailProfesionalTurno: ", emailProfesionalTurno)

  let ciudadProfesional = ""

  const profesionalEncontrado = profesionales?.find(profesional => profesional?.email === emailProfesionalTurno);
  console.log("profesionalEncontrado: ", profesionalEncontrado)
  if (profesionalEncontrado) {
    ciudadProfesional = profesionalEncontrado.ubicacion.ciudad;
  } else {
    console.log("No se encontró el profesional en el array de profesionales.");
  }
  console.log(ciudadProfesional)

  const filteredProfesionales = profesionales?.filter(
    (profesional) =>
      profesional?.especialidades?.includes(categoria) &&
      profesional?.ubicacion?.ciudad.includes(ciudadProfesional)
  );



  // enviar a turnoEditado el id del profesional y el id del servicio segun el indice
  const handleProfesionalSelectChange = (event, index) => {
    const selectedValue = JSON.parse(event.target.value);
    setProfesionalSelected(selectedValue);
    setTurnoEditado((prevTurnoEditado) => ({
      ...prevTurnoEditado,
      profesionalId: selectedValue.id,
      servicioId: turnosProximos[index]?.servicio?.id
    }));
  };


  //enviar a turnoEditado el value del input id=alergias
  const handleAlergiasChange = (event) => {
    const value = event.target.value;
    setTurnoEditado((prevTurnoEditado) => ({
      ...prevTurnoEditado,
      alergias: value
    }));
  };


  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const addAccents = (text) => {
    const replacements = {
      MIERCOLES: "MIÉRCOLES",
      SABADO: "SÁBADO",
    };

    return replacements[text] || text;
  };

  const filterAvailableDatesReserva = (date) => {
    const dayName = addAccents(
      date.toLocaleDateString("es-ES", { weekday: "long" }).toUpperCase()
    );

    const diasHabilesConTilde = diasHabilesProfesionales?.map((dia) =>
      addAccents(dia)
    );
    return diasHabilesConTilde?.includes(addAccents(dayName));
  };
  const [horasHabilesProfesionales, setHorasHabilesProfesionales] = useState(
    []
  );

  const filterAvailableTimesReserva = (time) => {
    setHorasHabilesProfesionales(
      profesionalSelected?.horarios?.find(
        (item) => item.dia === removeAccents(nombreDia).toUpperCase()
      )?.horas
    );

    if (horasHabilesProfesionales) {
      horasDisponibles = horasHabilesProfesionales.map((hora) =>
        new Date(`1970-01-01T${hora}`).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );

      return horasDisponibles.includes(
        time.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    }

    return false;
  };



  function addHours(date, hours) {
    date.setHours(date.getHours() + hours);
    return date;
  }

  const fecha = new Date(busqueda.fecha);
  const formattedFecha = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${fecha.getDate().toString().padStart(2, "0")}`;


  // funcion de put 
  const { editTurno } = usePutTurno();
  const [editedTurno, setEditedTurno] = useState(null);

  const [turnoEditado, setTurnoEditado] = useState({
    alergias: "",
    clienteId: "",
    fecha_hora_inicio: "",
    fecha_hora_final: "",
    profesionalId: "",
    segundoTelefono: "",
    servicioId: ""
  })

  const horaInicio = `${formattedFecha}T${busqueda.hora}`;
  if (!horaInicio) {
    setTurnoEditado(horaInicio)
  }
  const date = new Date(horaInicio);
  const horaFin = addHours(date, 2);

  const fechaFin = new Date(horaFin);
  const hora = fechaFin.getHours();
  const minutos = fecha.getMinutes();
  const horaFormateada = `${hora.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`;
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  useEffect(() => {
    setTurnoEditado(prevTurnoEditado => ({
      ...prevTurnoEditado,
      fecha_hora_final: `${formattedFecha}T${horaFormateada}`
    }));
  }, [busqueda.hora, hora, minutos]);

  //funcion ocultar sí o no, confirmacion de alergias
  const [sufresAlergias, setSufresAlergias] = useState(null);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;

    // Si se selecciona "Sí", establecer sufresAlergias en true y turnos?.alergiasConfirmadas en true
    if (value === "si") {
      setSufresAlergias(true);
      setTurnoEditado((prevTurnos) => ({
        ...prevTurnos,
        alergiasConfirmadas: true
      }));
    } else if (value === "no") {
      // Si se selecciona "No", establecer sufresAlergias en false y turnos?.alergiasConfirmadas en false
      setSufresAlergias(false);
      setTurnoEditado((prevTurnos) => ({
        ...prevTurnos,
        alergiasConfirmadas: false
      }));
    }
  };

  console.log("turnoEditado estado", turnoEditado);

  const [editingIndex, setEditingIndex] = useState(-1);
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    if (showAlert) {
      swal({
        text: "Ya no puedes editar este turno porque quedan menos de 24 horas",
        icon: "warning",
        button: "Aceptar",
      });
      setShowAlert(false);
    }
  }, [showAlert]);

  const handleDateChange = (date) => {
    setDiaSeleccionado(date);
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setBusqueda({ ...busqueda, fecha: formattedDate, hora: formattedTime });
    setTurnoEditado(prevTurnoEditado => ({
      ...prevTurnoEditado,
      fecha_hora_inicio: `${formattedFecha}T${formattedTime}`,
    }))
  };


  const handleEditClick = async (turnoUpdate, index) => {
    console.log(turnoUpdate)
    try {
      setEditedTurno(turnoUpdate);
      setTurnoEditado(prevTurnoEditado => ({
        ...prevTurnoEditado,
        clienteId: clienteId,
        fecha_hora_inicio: `${formattedFecha}T${busqueda.hora}`,
        fecha_hora_final: `${formattedFecha}T${horaFormateada}`,
        segundoTelefono: turnoUpdate.segundoTelefono,
      }));

      setEditingIndex(index);
    } catch (error) {
    }
  };

  const handleSaveClick = async (turnoUpdate, turnoId) => {

    if (!turnoEditado.profesionalId) {
      swal({
        title: "Selecciona un profesional",
        text: "Debes escoger un profesional antes de seleccionar la fecha/hora.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (!busqueda.fecha) {
      swal({
        title: "Selecciona una fecha",
        text: "Debes escoger una fecha para tu reserva.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (busqueda.hora == "00:00") {
      swal({
        title: "Selecciona una hora",
        text: "Debes escoger una hora para tu reserva",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (turnoEditado.segundoTelefono && !/^\d+$/.test(turnoEditado.segundoTelefono)) {
      swal({
        text: "Su telefono es inválido, por favor ingrese solo números",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (turnoEditado.alergiasConfirmadas !== true && turnoEditado.alergiasConfirmadas !== false) {
      swal({
        text: "Debe completar el campo '¿Sufres de alergias?' con 'Sí' o 'No' para continuar con la edición de la reserva",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (turnoEditado.alergiasConfirmadas === true && !turnoEditado.alergias) {
      swal({
        text: "Si llenaste el campo 'Sí', describe tus alergias",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    try {
      console.log(turnoUpdate)
      await editTurno(turnoUpdate, turnoId);
      swal({
        text: "¡Reserva actualizado exitosamente!",
        icon: "success",
        button: "Aceptar",
      });
    } catch (error) {
      console.log("error", error)
      swal({
        text: "Error al actualizar la reserva",
        icon: "error",
        button: "Aceptar",
      });
    }
    setEditedTurno(null);
    setEditingIndex(-1);
  }

  const handleCancelEdit = async (e) => {
    e.preventDefault();
    swal({
      title: '¿No deseas actualizar la reserva?',
      icon: 'info',
      buttons: ['Cancelar', 'Aceptar'],
    }).then((result) => {
      if (result) {

        setEditedTurno(null);
        setTurnoEditado(turnoEditado);
        setEditingIndex(-1);
        swal('La edición de la reserva ha sido cancelada', {
          icon: 'success',
          buttons: false,
          timer: 2000,
        });
      }
    });
  };


  //funcion punto en el precio
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };

    const formattedDate = new Intl.DateTimeFormat('es-CO', options).format(date);
    const [datePart, timePart] = formattedDate.split(', ');

    return (
      <p className="frontFecha">
        <span className="highlight">Fecha:</span> {datePart} <br />
        <span className="highlight">Hora:</span> {timePart.toLowerCase()}
      </p>
    );
  };


  //actualizar turnos tiempo real
  useEffect(() => {
    setUpdatedTurnos(turnosCliente);
  }, [turnosCliente]);

  useEffect(() => {
    if (editedTurno === null) {
      getTurnosClientes();
    }
  }, [editedTurno, updatedTurnos]);

  return (
    <div className="containerReservas">
      <div className='containerReservasBg'>
      </div>

      <div className="barToggle">
        <div
          className={`barReserva ${changeBackground ? "changeBackground" : ""}`}
          onClick={() => handleChangePage("pageReserva")}
        >
          Turnos reservados
        </div>
        <div
          className={`barHistorial ${!changeBackground ? "changeBackground" : ""}`}
          onClick={() => handleChangePage("pageHistorial")}
        >
          Historial de reservas
        </div>
      </div>

      <div className={`pageReserva ${paginaActual === "pageReserva" ? "showPage" : ""}`}>
        <div className={`fade-in`}>
          <p style={{ fontSize: '0.6rem', textAlign: 'center' }}>
            Recuerda que tienes disponible hasta 24 horas antes para editar una reserva
          </p>
          <div className="cardTurno">
            {turnosProximos?.map((turnos, index) => (
              <div
                onClick={(event) => handleClickFlipped(index, event)}
                className={`cardInnerTurno ${isFlipped[index] ? "isFlipped" : ""}`}
              >
                <div className="cardFace cardFaceFront">
                  <img src={CardFront} alt="Wave frontcard" className='waveFrontCard' />
                  <img src={LogoHairphoria} alt="Logo hairphoria" className='logoHairphoria' />
                  <div className="cardTurnoFrontBody" key={turnos?.id}>
                    <h3>{turnos?.servicio?.nombre}</h3>
                    <p className="frontFecha">
                      {formatDate(turnos?.fecha_hora_inicio)}
                    </p>
                    <p className="frontProfesional"> <span className='highlight'>Profesional:</span> {turnos?.profesional?.nombre + " " + turnos?.profesional?.apellido}</p>
                    <p className="frontPrecio">
                      <span className='highlight'>Precio: $</span>{(() => {
                        const precioPunto = turnos?.servicio?.precio;
                        return precioPunto
                          ?.toLocaleString("es", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: precioPunto % 1 === 0 ? 0 : 1,
                          })
                          .replace(",", ".");
                      })()}
                    </p>
                    <h4 className='pressEdit'>Presiona aquí para editar <FontAwesomeIcon icon={faPenToSquare} /></h4>
                  </div>
                </div>
                <div className="cardFace cardFaceBack">
                  <div className="cardTurnoContent">
                    <div className="cardTurnoBackBody">
                      <h4 className="pressVerTurno">Ver turno <FontAwesomeIcon icon={faEye} /></h4>
                      <h3>Edición de reserva</h3>
                      <div>
                        <div className="formField">
                          <h5 className="nombreInput">
                            Elige un profesional entre nuestro increíble equipo de expertos*
                          </h5>

                          {editingIndex === index ? (
                            <select
                              className="formularioReserva"
                              onChange={(e) => handleProfesionalSelectChange(e, index)}
                            >
                              <option value="" disabled selected>
                                Selecciona un profesional
                              </option>
                              {filteredProfesionales?.map((profesional) => (
                                <option
                                  key={profesional?.id}
                                  value={JSON.stringify(profesional)}
                                >
                                  {profesional?.nombre} {profesional?.apellido}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <select
                              className="formularioReserva"
                              value={turnos?.profesional?.nombre}
                              disabled={true}
                            >
                              <option value="" >
                                {turnos?.profesional?.nombre} {turnos?.profesional?.apellido}
                              </option>
                            </select>
                          )}

                          <h5 className="nombreInput">
                            Asigna una fecha y hora, según tu disponibilidad*
                          </h5>

                          {editingIndex === index ? (
                            <div className="editFecha">
                              <ReactDatePicker
                                locale={es}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={60}
                                dateFormat="MMM d, yy h:mm aa"
                                minDate={new Date() - 1}
                                monthsShown={2}
                                filterTime={filterAvailableTimesReserva}
                                customInput={<CustomDatePickerInput />}
                                onChange={handleDateChange}
                                selected={diaSeleccionado}
                                filterDate={filterAvailableDatesReserva}
                                isClearable
                              />
                            </div>
                          ) : (
                            <div className="editFecha">
                              {formatDate(turnos?.fecha_hora_inicio)}
                            </div>
                          )}


                          <h5 className="nombreInput">
                            Actualiza tu segundo número de contacto*
                          </h5>

                          {editingIndex === index ? (
                            <input
                              id="telefono"
                              className="formularioReserva"
                              maxLength={10}
                              pattern="[0-9]*"
                              required
                              placeholder="Ejemplo: 3014568674"
                              value={turnoEditado.segundoTelefono}
                              onChange={(e) =>
                                setTurnoEditado({
                                  ...turnoEditado,
                                  segundoTelefono: e.target.value
                                })
                              }
                            />
                          ) : (
                            <input
                              id="telefono"
                              className="formularioReserva"
                              maxLength={10}
                              pattern="[0-9]*"
                              required
                              value={turnos?.segundoTelefono}
                              disabled={true}
                            />
                          )}
                        </div>

                        <div className="formField">
                          <h4 className="nombreInput">¿Sufres de alergias?*</h4>
                          {editingIndex === index ? (

                            <div className="containerOptionCheckbox">
                              <span className="nombreInput">
                                Sí
                              </span>
                              <input
                                type="radio"
                                id="sensibilidad"
                                className="checkboxReserva"
                                value="si"
                                checked={sufresAlergias === true}
                                onChange={handleCheckboxChange}
                              />
                              <span className="nombreInput">
                                No
                              </span>
                              <input
                                type="radio"
                                id="sensibilidadNo"
                                className="checkboxReserva"
                                value="no"
                                checked={sufresAlergias === false}
                                onChange={handleCheckboxChange}
                              />
                            </div>
                          ) : (
                            <div className="containerOptionCheckbox">
                              <span className="nombreInput">
                                Sí
                              </span>
                              <input
                                type="radio"
                                id="sensibilidad"
                                className="checkboxReserva"
                                disabled={true}
                                checked={sufresAlergias === true || turnos?.alergiasConfirmadas === true}
                                onChange={handleCheckboxChange}
                              />
                              <span className="nombreInput">
                                No
                              </span>
                              <input
                                type="radio"
                                id="sensibilidadNo"
                                className="checkboxReserva"
                                disabled={true}
                                checked={sufresAlergias === false || turnos?.alergiasConfirmadas === false || turnos?.alergiasConfirmadas === null}
                                onChange={handleCheckboxChange}
                              />
                            </div>
                          )}

                        </div>
                        <div className={`formField ${sufresAlergias === false || sufresAlergias === null ? 'hide' : ''}`}>
                          <h4 className="nombreInput">
                            Si seleccionaste "si", cuentanos a qué eres alérgico*
                          </h4>
                          {editingIndex === index ? (
                            <input
                              id="alergias"
                              className="formularioReserva"
                              placeholder="Ejemplo: Sulfatos, Fragancias..."
                              onChange={handleAlergiasChange}
                            />
                          ) : (
                            <input
                              id="alergias"
                              className="formularioReserva"
                              value={turnos?.alergias}
                              onChange={handleAlergiasChange}
                              disabled={true}
                            />
                          )}
                        </div>

                        {editingIndex === index ? (
                          <div>
                            <button
                              className="buttonUpdate guardar"
                              onClick={() =>
                                handleSaveClick(turnoEditado, turnos?.id)
                              }
                            >
                              Guardar
                            </button>

                            <button
                              className="buttonUpdate cancelar"
                              onClick={handleCancelEdit}
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            className="buttonUpdate"
                            onClick={() => {
                              if (!turnosFiltrados.includes(turnos)) {
                                setShowAlert(true);
                              } else {
                                handleEditClick(turnos, index);
                              }
                            }}
                          >
                            Editar
                          </button>
                        )}
                      </div>

                    </div>
                    <img src={CardBack} alt="Wave backcard" className='waveBackCard' />
                  </div>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>

      <div className={`pageHistorial ${paginaActual === "pageHistorial" ? "showPage" : ""}`}>
        <div className={`fade-in`}>
          <p style={{ fontSize: '0.6rem', textAlign: 'center' }}>
            Encuentra todas las reservas que has hecho en Hairphoria
          </p>
          <div className="cardTurno">
            {turnosHistorial?.map((turnos, index) => (
              <div
                onClick={(event) => handleClickFlipped(index, event)}
                className={`cardInnerTurno innerTurnoHistorial ${isFlipped[index] ? "isFlipped" : ""}`}
              >
                <div className="cardFace cardFaceFront">
                  <img src={CardFront} alt="Wave frontcard" className='waveFrontCard' />
                  <img src={LogoHairphoria} alt="Logo hairphoria" className='logoHairphoria' />
                  <div className="cardTurnoFrontBody" key={turnos?.id}>
                    <h3>{turnos?.servicio?.nombre}</h3>
                    <p className="frontFecha">
                      {formatDate(turnos?.fecha_hora_inicio)}
                    </p>
                    <p className="frontProfesional"> <span className='highlight'>Profesional:</span> {turnos?.profesional?.nombre + " " + turnos?.profesional?.apellido}</p>
                    <p className="frontPrecio">
                      <span className='highlight'>Precio: $</span>{(() => {
                        const precioPunto = turnos?.servicio?.precio;
                        return precioPunto
                          ?.toLocaleString("es", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: precioPunto % 1 === 0 ? 0 : 1,
                          })
                          .replace(",", ".");
                      })()}
                    </p>
                    <h4 className='pressEdit'>Más detalles <FontAwesomeIcon icon={faWandMagicSparkles} /></h4>
                  </div>
                </div>
                <div className="cardFace cardFaceBack">
                  <div className="cardTurnoContent">
                    <div className="cardTurnoBackBody">
                      <h4 className="pressVerTurno">Ver turno <FontAwesomeIcon icon={faEye} /></h4>
                      <h3>Historial de reserva</h3>
                      <div>
                        <div className="formField">
                          <h5 className="nombreInput">
                            Este es el profesional que has elegido:
                          </h5>
                          <input
                            className="formularioReserva"
                            value={turnos?.profesional?.nombre + " " + turnos?.profesional?.apellido}
                            disabled={true}
                          />

                          <h5 className="nombreInput">
                            Esta fue la fecha de nuestro encuentro
                          </h5>

                          <div className="editFecha">
                            {formatDate(turnos?.fecha_hora_inicio)}
                          </div>

                          <h5 className="nombreInput">
                            Tu segundo número de contacto:
                          </h5>
                          <input
                            id="telefono"
                            className="formularioReserva"
                            maxLength={10}
                            pattern="[0-9]*"
                            required
                            value={turnos?.segundoTelefono}
                            disabled={true}
                          />
                        </div>

                        <div className="formField">
                          <h4 className="nombreInput">¿Sufres de alergias?</h4>

                          <div className="containerOptionCheckbox">
                            <span className="nombreInput">
                              Sí
                            </span>
                            <input
                              type="radio"
                              id="sensibilidad"
                              className="checkboxReserva"
                              disabled={true}
                              checked={sufresAlergias === true || turnos?.alergiasConfirmadas === true}
                            />
                            <span className="nombreInput">
                              No
                            </span>
                            <input
                              type="radio"
                              id="sensibilidadNo"
                              className="checkboxReserva"
                              disabled={true}
                              checked={sufresAlergias === false || turnos?.alergiasConfirmadas === false || turnos?.alergiasConfirmadas === null}
                            />
                          </div>

                        </div>
                        <div className={`formField ${sufresAlergias === false || sufresAlergias === null ? 'hide' : ''}`}>
                          <h4 className="nombreInput">
                            Si seleccionaste "si", cuentanos a qué eres alérgico*
                          </h4>

                          <input
                            id="alergias"
                            className="formularioReserva"
                            value={turnos?.alergias}
                            onChange={handleAlergiasChange}
                            disabled={true}
                          />

                        </div>
                      </div>

                    </div>
                    <img src={CardBack} alt="Wave backcard" className='waveBackCard waveHistorial' />
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

    </div>
  )
}

export default Bookings