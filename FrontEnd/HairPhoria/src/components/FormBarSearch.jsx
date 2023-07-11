import ReactDatePicker from "react-datepicker"
import Select from 'react-select'
import { es } from 'date-fns/locale';


const FormBarSearch = ({submitCheck, busqueda, handleUbicacionesChange, ciudades, handleCategoriaChange, categorias, filterAvailableTimes, filterAvailableDates, handleDateChange, startDate, CustomDatePickerInput}) => {

  return (
    <div className="container-buscador">
        <div className="titulo">
          <h1>Hairphoria</h1>
        </div>
        <span className='mensajeSearch'>Reserva tu cita en cualquiera de nuestras sedes, para un día de mimos y cuidados</span>
        <div className='form-container'>
          <form onSubmit={submitCheck}>
            <div style={{ minHeight: "42px", minWidth: "250px" }} className="inputSearch">
              <Select
                className="ciudad-select"
                value={busqueda.ciudad}
                onChange={handleUbicacionesChange}
                options={ciudades}
                placeholder="✂ Ciudad"
                isClearable
                isSearchable
              />
            </div>
            <div style={{ minHeight: "42px", minWidth: "250px" }} className="inputSearch">
              <Select
                className="categoria-select"
                value={busqueda.categoria}
                onChange={handleCategoriaChange}
                options={categorias}
                placeholder="✂ Categoria"
                isClearable
                isSearchable
              />
            </div>
            <div className='picker'>
            <ReactDatePicker
                locale={es}
                // closeOnScroll={true}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={60}
                dateFormat="MMM d, yy h:mm aa"
                minDate={new Date() - 1}
                monthsShown={2}
                filterTime={filterAvailableTimes}
                customInput={<CustomDatePickerInput />}
                onChange={handleDateChange}
                selected={startDate}
                filterDate={filterAvailableDates} 
                isClearable
              />
            </div>
            
            <button className='buttonSearch'>Buscar</button>
          </form>
        </div>
      </div>
  )
}

export default FormBarSearch
