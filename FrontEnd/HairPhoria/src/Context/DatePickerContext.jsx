import { createContext, useContext, useState, useEffect } from 'react';

const DatePickerContext = createContext();

export const useDatePicker = () => useContext(DatePickerContext);

export const DatePickerProvider = ({ children }) => {
  const [startDate, setStartDate] = useState(null);
  const [diasDisponibles, setDiasDisponibles] = useState(["Domingo", "Lunes", "Miércoles", "Jueves", "Viernes", "Sábado"]);
  const [categorias, setCategorias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [busqueda, setBusqueda] = useState({
    ciudad: '',
    categoria: '',
    fecha: '',
    hora: ''
  });
  const [horarioOcupado, setHorarioOcupado] = useState([])
  

  const handleDateChange = (date) => {
    setStartDate(date);
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setBusqueda({ ...busqueda, fecha: formattedDate, hora: formattedTime });
  };

  const CustomDatePickerInput = ({ value, onClick }) => (
    <div className="custom-datepicker-input" onClick={onClick}>
      <span className="filtroFecha">{value ? value : "✂ Fecha / Hora"}</span>
    </div>
  );

  const filterAvailableDates = (date) => {
    const dayOfWeek = date.getDay();
    return diasDisponibles.includes(getDayOfWeekName(dayOfWeek));
  };

  const getDayOfWeekName = (dayOfWeek) => {
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return daysOfWeek[dayOfWeek];
  };

  


  // const filterAvailableTimes = (time) => {
  //   const today = new Date();
  //   if (busqueda.fecha !== '') {
  //     const currentHour = today.getHours();
  //     const isToday = new Date(busqueda.fecha).toDateString() === today.toDateString();
  //     const isAfter8PM = time.getHours() <= 20;

  //     if (isToday) {
  //       return time.getHours() >= currentHour + 1 && isAfter8PM;
  //     } else {
  //       return time.getHours() >= 8 && time.getHours() <= 20;
  //     }
  //   }
  // };


  

  const handleUbicacionesChange = (selectedOption) => {
    if (selectedOption === null) {
      selectedOption = ''
    }
    setBusqueda({ ...busqueda, ciudad: selectedOption });
  };

  console.log(busqueda.ciudad)

  
  

  console.log("OH Si",horarioOcupado)

  const [horarioOcupadoFlat, setHorarioFlat] = useState([])

    useEffect(() => {
      if (horarioOcupado && horarioOcupado.length >= 1) {
       setHorarioFlat(horarioOcupado.flatMap(objeto => objeto.horas || [])) 
       console.log("Flat",horarioOcupadoFlat)
      }
    }, [horarioOcupado]);

    

    const formattedArray = horarioOcupadoFlat?.map((fecha) => {
      const dateObj = new Date(fecha);
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      const formattedFecha = `${month}/${day}/${dateObj.getFullYear()}`;
      return formattedFecha;
    });
    
    const horasArray = horarioOcupadoFlat?.map((fecha)=>{
      return parseInt(fecha.slice(11,13))
    })

    const filterAvailableTimes = (time) => {
      if (time && busqueda.fecha) {
        return !formattedArray.some((fecha, i) => {
          return (
            fecha.toString() === busqueda.fecha.toString() && time.getHours() === horasArray[i]
          );
        });
      }
      return true;
    };

    useEffect(() => {
      filterAvailableTimes();
    }, [busqueda]);
    
    
      

    const datePickerState = {
      startDate,
      handleDateChange,
      CustomDatePickerInput,
      filterAvailableDates,
      filterAvailableTimes,
      diasDisponibles,
      busqueda,
      setBusqueda,
      categorias, 
      setCategorias,
      ciudades,
      setCiudades,
      handleUbicacionesChange,
      horarioOcupado,
      setHorarioOcupado,
     
    };
    


  return (
    <DatePickerContext.Provider value={datePickerState}>
      {children}
    </DatePickerContext.Provider>
  );
};
