import Location from "./Location";

const FormAddService = ({ handleSubmit, handleChange, handleChangeImg, handleUbicacionesChange, ubicacionesConcat, ubicacionesIndices, nuevoServicio, nuevaCiudad, listServices, setNuevaCiudad, precioError, dataFetch }) => {
  return (
    <div className="contenedor">
      <div className="contenedorForm">
        <h3 className="ServiceTitulo">Agregar Servicio</h3>
        <form>
          <div>
            <label htmlFor="nombre">Servicio: *</label>
            <input
              type="text"
              id="nombre"
              className="input"
              name="nombre"
              value={nuevoServicio.nombre}
              onChange={handleChange}
              placeholder="Agregar el Servicio"
            />
          </div>
          <div>
            <label htmlFor="descripcion">Descripción: *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="input"
              value={nuevoServicio.descripcion}
              onChange={handleChange}
              placeholder="Descripción del servicio"
            />
          </div>
          <div>
            <label htmlFor="especialidad">Categoría: *</label>
            <select
              id="especialidad"
              name="especialidad"
              className="input"
              value={nuevoServicio.especialidad}
              onChange={handleChange}
            >
              <option value="" className="input">
                ✂ Categorías
              </option>
              {dataFetch &&
                dataFetch.map((categorias) => (
                  <option key={categorias.id} value={categorias.especialidad}>
                    {categorias.especialidad}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="precio">Precio: *</label>
            <input
              type="text"
              id="precio"
              name="precio"
              className="inputPrecio"
              value={nuevoServicio.precio}
              onChange={handleChange}
              placeholder="Agregar el Precio, solo ingresar numeros..."
            />
            {precioError && <p className="errorText">{precioError}</p>}
          </div>
          <div>
            <label htmlFor="palabrasClave">Palabras Clave: *</label>
            <input
              type="text"
              id="palabrasClave"
              className="inputPalabraClave"
              name="palabrasClave"
              value={nuevoServicio.palabrasClave.join(", ")}
              onChange={handleChange}
              placeholder="Ingrese palabras claves separados por comas. Ejemplo: Palabra1., Palabra2., Palabra3.,"
            />
          </div>
          <div>
            <label htmlFor="atributos">Atributo: *</label>
            <input
              type="text"
              id="atributos"
              className="inputAtributos"
              name="atributos"
              value={nuevoServicio.atributos.join(", ")}
              onChange={handleChange}
              placeholder="Ingrese atributo separados por comas. Ejemplo: Primer Atributo., Segundo Atributo.,"
            />
          </div>
          <div>
            <label htmlFor="politicas">Politicas: *</label>
            <input
              type="text"
              id="politicas"
              className="inputPoliticas"
              name="politicas"
              value={nuevoServicio.politicas.join(", ")}
              onChange={handleChange}
              placeholder="Ingrese politicas separados por comas. Ejemplo: Primera politica., Segunda politica.,"
            />
          </div>
          <div>
            <label htmlFor="saludYSeguridad">Salud y Seguridad: *</label>
            <input
              type="text"
              id="saludYSeguridad"
              className="inputsaludYSeguridad"
              name="saludYSeguridad"
              value={nuevoServicio.saludYSeguridad.join(", ")}
              onChange={handleChange}
              placeholder="Ingrese terminos de Salud y Seguridad separados por comas. Ejemplo: Primer termino., Segundo termino.,"
            />
          </div>
          <div>
            <label htmlFor="cancelacion">Cancelacion: *</label>
            <input
              type="text"
              id="cancelacion"
              className="inputcancelacion"
              name="cancelacion"
              value={nuevoServicio.cancelacion.join(", ")}
              onChange={handleChange}
              placeholder="Ingrese terminos de cancelacion separados por comas. Ejemplo: Primer termino., Segundo termino.,"
            />
          </div>
          <div>
            <Location listServices={listServices} nuevaCiudad={nuevaCiudad} setNuevaCiudad={setNuevaCiudad} />
          </div>
          <div>
            <label htmlFor="ubicaciones">Ciudad: *</label>
            <br /><br />
            {ubicacionesConcat &&
              ubicacionesConcat.map((ciudad, index) => (
                <div key={index} className="containerCheckbox">
                  <input
                    type="checkbox"
                    id={`ciudad-${index}`}
                    name="ubicaciones"
                    value={index}
                    checked={ubicacionesIndices.includes(index)}
                    onChange={handleUbicacionesChange}
                    className="inputCiudad"
                  />
                  <label htmlFor={`ciudad-${index}`} className="ciudadNombre">{ciudad.ciudad}</label>
                </div>
              ))}
          </div>
          <div>
            <label htmlFor="imagen">Imagen: *</label>
            <input
              className="inputFile"
              type="file"
              id="imagen"
              name="imagen"
              onChange={handleChangeImg}
              multiple
            />
          </div>
          {nuevoServicio?.imagen?.length === 5 ? (
            <div className="containerImageSelected">
              <label>Imagenes Seleccionadas: </label>
              <img src={nuevoServicio.imagen[0]} alt="Imagen seleccionada" className="imageSelected" />
              <img src={nuevoServicio.imagen[1]} alt="Imagen seleccionada" className="imageSelected" />
              <img src={nuevoServicio.imagen[2]} alt="Imagen seleccionada" className="imageSelected" />
              <img src={nuevoServicio.imagen[3]} alt="Imagen seleccionada" className="imageSelected" />
              <img src={nuevoServicio.imagen[4]} alt="Imagen seleccionada" className="imageSelected" />
            </div>
          ) : (
            ""
          )}

          <button
            className="buttonSubmit"
            type="submit"
            onClick={handleSubmit}>
            Agregar
          </button>
        </form>
      </div>
    </div>
  )
}

export default FormAddService