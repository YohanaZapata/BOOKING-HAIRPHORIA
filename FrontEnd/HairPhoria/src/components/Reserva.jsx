import { useParams } from "react-router";
import "../styles/Reserva.css";
import { useFetchServices } from "../hooks/useFetchServices";
import { useContext, useEffect, useState } from "react";
import {
  faAddressCard,
  faEnvelope,
  faMobile,
  faScissors,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Star from "./Star";
import { AuthContext } from "../Context/AuthContext";
import { useGlobalStates } from "../Context/Context";
import { useDatePicker } from "../Context/DatePickerContext";
import BarSearch from "../components/BarSearch";
import ServiceSearch from "./ServiceSearch";
import { useBarSearchResult } from "../Context/BarSearchResultContext";
import { useGetProfesionales } from "../hooks/useGetProfesionales";
import ReactDatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import swal from "sweetalert";
import { useFetchPostAddTurno } from "../hooks/usePostTurno";
import { routes } from "../routes";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useProfesionalFecha } from "../Context/ProfesionalFechaContext";
import "react-datepicker/dist/react-datepicker.css";

const Reserva = () => {
  const { nombreServicio } = useParams();
  const { dataFetch, isLoading } = useFetchServices();
  const { dataFetchProfesionales, isLoadingProfesionales } =
    useGetProfesionales();
  const { dispatch, token } = useContext(AuthContext);
  const isLoggedIn = !!token;
  const { getDataFilterIdByEmail } = useGlobalStates();
  const { clienteDataFetch } = getDataFilterIdByEmail();
  const loading = clienteDataFetch === undefined;
  const { addTurno } = useFetchPostAddTurno();
  let horasDisponibles = [];
  const {
    profesionalSelected,
    handleProfesionalSelectChange,
    filteredProfesionales,
    service,
    setService,
  } = useProfesionalFecha();
  const {
    startDate,
    handleDateChange,
    CustomDatePickerInput,
    busqueda,
    ciudades,
    handleUbicacionesChange,
    horarioOcupado,
    setHorarioOcupado,
    excludeTimes,
    filterAvailableTimes,
    filterAvailableDates,
  } = useDatePicker();
  const {
    setMostarCategorias,
    mostrarBusqueda,
    setMostrarBusqueda,
    search,
    setSearch,
  } = useBarSearchResult();
  const precioPunto = service?.precio;
  const formattedPrecioPunto = precioPunto
    ?.toLocaleString("es", {
      minimumFractionDigits: 0,
      maximumFractionDigits: precioPunto % 1 === 0 ? 0 : 1,
    })
    .replace(",", ".");
  const diasHabilesProfesionales = profesionalSelected?.horarios?.map(
    (dia) => dia.dia
  );

  const horasOcupadasProfesionales =
    profesionalSelected?.horasOcupadas?.flatMap((dia) =>
      dia.horas.map((hora) => hora.split("T")[1])
    );
  useEffect(() => {
    setHorarioOcupado(profesionalSelected.horasOcupadas);
  }, [profesionalSelected]);

  const selectedDate = new Date(busqueda.fecha);
  const nombreDia = selectedDate.toLocaleDateString("es-ES", {
    weekday: "long",
  });

  useEffect(() => {
    if (dataFetch) {
      const servicio = dataFetch?.find(
        (value) => value.nombre === nombreServicio
      );
      setService(servicio);
    }
  }, [nombreServicio, dataFetch]);

  const [telefono2, setTelefono2] = useState("");
  const [telLetras, setTelLetras] = useState(false);
  const [alergiaConfirmada, setAlergiaConfirmada] = useState(false);
  const [alergias, setAlergias] = useState();

  const fecha = new Date(busqueda.fecha);
  const formattedFecha = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${fecha.getDate().toString().padStart(2, "0")}`;

  const horaInicio = `${formattedFecha}T${busqueda.hora}`;
  const date = new Date(horaInicio);
  const horaFin = addHours(date, 1);

  const fechaFin = new Date(horaFin);
  const hora = fechaFin.getHours();
  const minutos = fecha.getMinutes();
  const horaFormateada = `${hora.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}`;

  const navigate = useNavigate();

  const handleTelefonoChange = (event) => {
    setTelefono2(event.target.value);
    const inputValue = event.target.value;
    setTelefono2(inputValue);
    setTelLetras(/[a-zA-Z]/.test(inputValue));
  };

  const handleAlergiasChange = (event) => {
    setAlergias(event.target.value);
  };

  useEffect(() => {
    if (dataFetch) {
      const servicio = dataFetch?.find(
        (value) => value.nombre === nombreServicio
      );
      setService(servicio);
    }
  }, [nombreServicio, dataFetch]);

  const ciudadSeleccionada = busqueda.ciudad.value;

  function addHours(date, hours) {
    date.setHours(date.getHours() + hours);
    return date;
  }

  const handlePickerClick = () => {
    if (!profesionalSelected.id) {
      swal({
        title: "Selecciona un profesional",
        text: "Debes escoger un profesional antes de seleccionar la fecha/hora.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  };

  const handleProfesionalClick = () => {
    if (!busqueda.ciudad) {
      swal({
        title: "Selecciona una ciudad",
        text: "Debes escoger una ciudad antes de seleccionar un profesional.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSubmitReservar = async (e) => {
    e.preventDefault();

    if (!profesionalSelected?.id) {
      swal({
        title: "Selecciona un profesional",
        text: "Debes escoger un profesional antes de seleccionar la fecha/hora.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else if (!busqueda.fecha) {
      swal({
        title: "Selecciona una fecha",
        text: "Debes escoger una fecha para tu reserva.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else if (busqueda.hora == "00:00") {
      swal({
        title: "Selecciona una hora",
        text: "Debes escoger una hora para tu reserva",
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else if (telLetras) {
      swal({
        text: "Su telefono es inválido, por favor ingrese solo números",
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else {
      const turno = {
        clienteId: clienteDataFetch?.id,
        profesionalId: profesionalSelected?.id,
        servicioId: service?.id,
        fecha_hora_inicio: horaInicio,
        fecha_hora_final: `${formattedFecha}T${horaFormateada}`,
        segundoTelefono: telefono2,
        alergiasConfirmadas: alergiaConfirmada,
        alergias: alergias,
      };

      try {
        await addTurno(turno);
        swal({
          text: "¡Reserva exitosa!",
          icon: "success",
          button: "Aceptar",
        });
        navigate(routes.reservaconfirmacion);
        console.log("turno enviado: ", turno)
      } catch (error) {
        swal({
          text: "Error al agregar el servicio",
          icon: "error",
          button: "Aceptar",
        });
      }
    }
  };

  return (
    <div className="reservContainer">
      <div className="detailReserva">
        <figure className="figureImage">
          <img
            className="imgDescriptionReserva"
            src={service?.imagen[0]}
            alt="Imagen Principal"
          />
          <div className="capa">
            <h1 className="title-descriptionReserva">{service?.nombre}</h1>
            <p className="p-descriptionReserva">
              <ul>
                {service?.atributos.map((e, i) => (
                  <li
                    key={i}
                    style={{ listStyleType: "none", marginBottom: "5px" }}
                  >
                    <FontAwesomeIcon
                      icon={faScissors}
                      style={{ marginRight: "8px" }}
                    />
                    {e}
                  </li>
                ))}
              </ul>
              <br />
              <h1 className="title-descriptionprecio">
                ${formattedPrecioPunto}
              </h1>
            </p>
          </div>
        </figure>
        <div className="locationReserva">
          <div className="locationContain">
            <h4>Ciudad:</h4>{" "}
            <p>
              {service?.ubicaciones.length > 0
                ? service?.ubicaciones[0].ciudad
                : "Este servicio no tiene una ciudad asignada"}
            </p>
            <h4>Dirección</h4>{" "}
            <p>
              {service?.ubicaciones.length > 0
                ? service?.ubicaciones[0].direccion
                : "No definida"}
            </p>
          </div>
          <span className="puntuacion">
            <Star service={service} />
          </span>
        </div>
      </div>

      <div className="formReserva">
        <form action="submit" className="containerFormReserva">
          <div className="formField">
            <h3 className="tituloContainerInfoUser">
              ¡Nos alegra tenerte aquí! Estos son tus datos para la reserva:
            </h3>
            <h5 className="nombreInput">
              Selecciona la ciudad para reservar turno:*
            </h5>
            <Select
              value={busqueda.ciudad}
              onChange={handleUbicacionesChange}
              options={ciudades}
              placeholder="✂ Ciudad"
              isClearable
              isSearchable
            />
            <br />
            <h5 className="nombreInput">
              Elige un profesional entre nuestro increíble equipo de expertos:*
            </h5>
            <select
              className="formularioReserva"
              onChange={(e) => handleProfesionalSelectChange(e)}
              onClick={handleProfesionalClick}
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
            <br />
            <br />

            <h5 className="nombreInput">
              Elige la fecha y hora que mejor te convenga para nuestro
              encuentro:*
            </h5>
            <div className="pickerReserva" onClick={handlePickerClick}>
              <ReactDatePicker
                locale={es}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={60}
                minDate={new Date() - 1}
                monthsShown={2}
                filterTime={filterAvailableTimes}
                customInput={<CustomDatePickerInput />}
                onChange={handleDateChange}
                selected={startDate}
                filterDate={filterAvailableDates}
                isClearable
                excludeTimes={excludeTimes}
                dateFormat="MMMM d, yyyy h:mm aa"
              />
            </div>
            <br />

            <h4 className="nombreInput">Teléfono: </h4>
            <label htmlFor="telefono" className="datosOpcionales">
              En caso de no poder contactarte con tu número principal, ¿tienes
              un segundo número de teléfono?
            </label>
            <input
              id="telefono"
              className="formularioReserva"
              placeholder="Ejemplo: 3014568674"
              onChange={handleTelefonoChange}
              maxLength={10}
              pattern="[0-9]*"
              required
            ></input>
            {telLetras && (
              <div className="datosOpcionalesError">
                Solo puede ingresar numeros
              </div>
            )}
          </div>

          <div className="formField">
            <h4 className="nombreInput">¿Sufres de alergias?</h4>
            <div className="containerOptionCheckbox">
              <label htmlFor="sensibilidadSi" className="optionCheckBox">
                Sí
              </label>
              <input
                type="radio"
                id="opcionSi"
                name="opciones"
                className="checkboxReserva"
                onChange={() => setAlergiaConfirmada(true)}
              ></input>
              <label htmlFor="sensibilidadNo" className="optionCheckBox">
                No
              </label>
              <input
                type="radio"
                id="opcionNo"
                name="opciones"
                className="checkboxReserva"
                onChange={() => setAlergiaConfirmada(false)}
              ></input>
            </div>
          </div>

          <div className="formField">
            <label htmlFor="alergia" className="datosOpcionales">
              Si seleccionaste "si", cuentanos a qué eres alérgico
            </label>
            <input
              id="alergias"
              className="formularioReserva"
              placeholder="Ejemplo: Sulfatos, Fragancias..."
              onChange={handleAlergiasChange}
            ></input>
          </div>

          <div
            className="buttonFormReservaContainer"
            onClick={handleSubmitReservar}
          >
            <button className="buttonFormReserva">Reservar</button>
          </div>
        </form>

        <form className="datosUser">
          <h4 className="nombreDato">
            <FontAwesomeIcon icon={faUser} /> Nombre:
          </h4>
          <div type="text" className="datos">
            {clienteDataFetch?.nombre}
          </div>

          <h4 className="nombreDato">
            <FontAwesomeIcon icon={faEnvelope} /> Correo:
          </h4>
          <div type="email" className="datos">
            {clienteDataFetch?.email}
          </div>

          <h4 className="nombreDato">
            <FontAwesomeIcon icon={faMobile} /> Telefono:
          </h4>
          <div type="tel" className="datos">
            {clienteDataFetch?.telefono}
          </div>

          <h4 className="nombreDato">
            <FontAwesomeIcon icon={faAddressCard} /> Documento:
          </h4>
          <div type="text" className="datos">
            {clienteDataFetch?.documento}
          </div>
        </form>
      </div>

      <div className="barSearchReserva">
        <h4 className="tituloContainerBuscador">
          ¡Tenemos un espacio reservado para ti! ¿Te gustaría explorar otras
          opciones?
        </h4>
        <BarSearch
          setMostarCategorias={setMostarCategorias}
          setMostrarBusqueda={setMostrarBusqueda}
          setSearch={setSearch}
        />
        {mostrarBusqueda && <ServiceSearch search={search} />}
      </div>
    </div>
  );
};

export default Reserva;
