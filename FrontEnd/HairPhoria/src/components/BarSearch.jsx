import { useState, useEffect } from 'react';
import video from '../assets/headerVideo/videoheader.mp4';
import swal from "sweetalert";
import '../styles/BarSearch.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useFetchCategories } from '../hooks/useFetchCategories';
import { useFetchUbicaciones } from '../hooks/useFetchUbicaciones';
import FormBarSearch from './FormBarSearch';
import { useDatePicker } from '../Context/DatePickerContext';



const BarSearch = ({setMostarCategorias, setMostrarBusqueda, setSearch}) => {

  const { startDate, handleDateChange, CustomDatePickerInput, filterAvailableDates, filterAvailableTimes, diasDisponibles, busqueda, setBusqueda, categorias, setCategorias, ciudades, setCiudades } = useDatePicker();

  // Filtro Ciudad y categorias
  const { dataFetch , isLoading} = useFetchCategories();
  const { dataFetchUbicaciones, isLoadingUbUbicaciones} = useFetchUbicaciones();
  
  useEffect(() => {
    if (!isLoading) {
      const categorias = dataFetch.map((e) => ({
        value: e.especialidad,
        label: e.especialidad
      }));
      setCategorias(categorias);
    }
    if (!isLoadingUbUbicaciones) {
      const ciudades = dataFetchUbicaciones.map((e) => ({
        value: e.ciudad,
        label: e.ciudad
      }));
      setCiudades(ciudades);
    }
  }, [dataFetch, dataFetchUbicaciones, isLoading, isLoadingUbUbicaciones]);


  const getDayOfWeekName = (dayOfWeek) => {
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return daysOfWeek[dayOfWeek];
  };
  const handleCategoriaChange = (selectedOption) => {
    if (selectedOption === null) {
      selectedOption = ''
    }
    setBusqueda({ ...busqueda, categoria: selectedOption });
  };
  const handleUbicacionesChange = (selectedOption) => {
    if (selectedOption === null) {
      selectedOption = ''
    }
    setBusqueda({ ...busqueda, ciudad: selectedOption });
  };
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const { ciudad, categoria, fecha, hora } = busqueda;
    if (!ciudad || !categoria || !fecha || !hora) {
      swal({
        text: "Todos los campos son requeridos",
        icon: "warning",
        button: "Aceptar",
      });
      return false;
    }
    return true;
  };


  const submitCheck = (event) => {
    event.preventDefault();

    if (validateForm()) {
      setMostarCategorias(false);
      setMostrarBusqueda(true);
      setSearch(busqueda);
    }
  };

  return (
    <section className="section-buscador">
      <video autoPlay loop muted id="video" className='loopVideo'>
        <source src={video} type="video/mp4" />
      </video>
      <FormBarSearch submitCheck={submitCheck} busqueda={busqueda} handleUbicacionesChange={handleUbicacionesChange} ciudades={ciudades} handleCategoriaChange={handleCategoriaChange} categorias={categorias} filterAvailableTimes={filterAvailableTimes} filterAvailableDates={filterAvailableDates} handleDateChange={handleDateChange} startDate={startDate} CustomDatePickerInput={CustomDatePickerInput} />
    </section>
  );
};

export default BarSearch;



