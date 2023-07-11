import { createContext, useContext, useEffect, useState } from 'react';
import { useGetProfesionales } from '../hooks/useGetProfesionales';
import { useFetchServices } from '../hooks/useFetchServices';
import { useParams } from 'react-router';
import { useDatePicker } from './DatePickerContext';

const ProfesionalFechaContext = createContext();

export const useProfesionalFecha = () => useContext(ProfesionalFechaContext);

export const ProfesionalFechaProvider = ({ children }) => {

    const { nombreServicio } = useParams();
    const { dataFetchProfesionales, isLoadingProfesionales } =
    useGetProfesionales();
    const { dataFetch, isLoading } = useFetchServices();
  const profesionales = dataFetchProfesionales;

  const {
    busqueda
  } = useDatePicker();
  const ciudadSeleccionada = busqueda.ciudad.value
    const [profesionalSelected, setProfesionalSelected] = useState({});
    const [service, setService] = useState(null);
    const categoriaServicio = service?.especialidad;

    const handleProfesionalSelectChange = (event) => {
        const selectedValue = JSON.parse(event.target.value);
        setProfesionalSelected(selectedValue);
      };

      const filteredProfesionales = profesionales?.filter(
        (profesional) =>
          profesional?.especialidades?.includes(categoriaServicio) &&
          profesional?.ubicacion?.ciudad.includes(busqueda.ciudad.value)
      );

  const profesionalFechaState = {
    profesionalSelected,
    setProfesionalSelected, 
    handleProfesionalSelectChange,
    filteredProfesionales,
    profesionales,
    service,
    setService,
    categoriaServicio,
    busqueda,
    ciudadSeleccionada

  };

  return (
    <ProfesionalFechaContext.Provider value={profesionalFechaState}>
      {children}
    </ProfesionalFechaContext.Provider>
  );
};

