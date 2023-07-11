import "../styles/AddService.css";
import swal from "sweetalert";
import { useEffect, useState } from "react";
import { useFetchAddService } from "../hooks/useFetchAddService";
import { useFetchCategories } from "../hooks/useFetchCategories";
import { useFetchServices } from "../hooks/useFetchServices";
import usePostServiceImg from "../hooks/usePostServiceImg";
import useGetCitys from "../hooks/useGetCitys";
import FormAddService from "./FormAddService";

const AddService = () => {
  const { agregarServicio } = useFetchAddService();
  const { dataFetch } = useFetchCategories();
  const { dataFetch: servicios } = useFetchServices();
  const listServices = servicios;
  const { postServiceImg, response } = usePostServiceImg();
  const { cities } = useGetCitys();
  const [ubicacionesIndices, setUbicacionesIndices] = useState([]);
  const [nuevaCiudad, setNuevaCiudad] = useState({
    ciudad: "",
    coordenadas: {
      x: null,
      y: null
    },
    direccion: ""
  });

  const ciudadLocalStorage = JSON.parse(sessionStorage.getItem("ciudad"))
  const ubicacionesConcat = ciudadLocalStorage ? cities.concat(ciudadLocalStorage) : cities

  const handleChangeImg = async (event) => {
    const fileList = [...event.target.files];
    if (fileList.length > 0) {
      try {
        const imgUrls = await postServiceImg(fileList);
        setNuevoServicio((prevService) => ({
          ...prevService,
          imagen: imgUrls,
        }));
      } catch (error) {
        swal({
          text: "Error al subir las imágenes",
          icon: "error",
          button: "Aceptar",
        });
      }
    }
  };

  const handleUbicacionesChange = (event) => {
    const { value, checked } = event.target;
    setUbicacionesIndices((prevIndices) => {
      if (checked) {
        return [...prevIndices, parseInt(value)];
      } else {
        return prevIndices.filter((index) => index !== parseInt(value));
      }
    });
  };


  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: "",
    descripcion: "",
    especialidad: "",
    precio: "",
    palabrasClave: [],
    imagen: [],
    atributos: [],
    politicas:[],
    saludYSeguridad:[],
    cancelacion:[],
  });
  const [precioError, setPrecioError] = useState("");

  const validateForm = () => {
    let camposVacios = false;

    for (const key in nuevoServicio) {
      if (!nuevoServicio[key]) {
        camposVacios = true;
        break;
      }
    }

    if (camposVacios) {
      swal({
        text: "Todos los campos son requeridos",
        icon: "warning",
        button: "Aceptar",
      });
      return false;
    }
    const nombreServicio = nuevoServicio.nombre;
    const servicioExistente = servicios?.find(
      (servicio) => servicio.nombre === nombreServicio
    );


    if (servicioExistente) {
      swal({
        text: "El nombre de este servicio ya existe, por favor ingresa uno nuevo",
        icon: "warning",
        button: "Aceptar",
      });
      return false;
    }
    if (!nuevoServicio.atributos.length) {
      swal({
        text: "El campo 'atributos' es requerido",
        icon: "warning",
        button: "Aceptar",
      });
      return false;
    }
    if (!nuevoServicio.politicas.length) {
      swal({
        text: "El campo 'politicas' es requerido",
        icon: "warning",
        button: "Aceptar",
      });
      return false;
    }
    if (!nuevoServicio.saludYSeguridad.length) {
      swal({
        text: "El campo 'Salud y Seguridad' es requerido",
        icon: "warning",
        button: "Aceptar",
      });
      return false;
    }
    if (!nuevoServicio.cancelacion.length) {
      swal({
        text: "El campo 'cancelacion' es requerido",
        icon: "warning",
        button: "Aceptar",
      });
      return false;
    }

    if (!nuevoServicio.palabrasClave.length) {
      swal({
        text: "El campo 'palabras clave' es requerido",
        icon: "warning",
        button: "Aceptar",
      });
      return false;
    }

    if (nuevoServicio.imagen.length !== 5) {
      swal({
        text: "Debe seleccionar exactamente 5 imágenes",
        icon: "warning",
        button: "Aceptar",
      });
      return false;
    }

    if (ubicacionesIndices.length === 0) {
      swal({
        text: "Debe seleccionar al menos una ciudad",
        icon: "warning",
        button: "Aceptar",
      });
      return false;
    }

    return true;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const nuevoServicioObj = {
      nombre: nuevoServicio.nombre,
      precio: parseFloat(nuevoServicio.precio),
      imagen: nuevoServicio.imagen,
      descripcion: nuevoServicio.descripcion,
      especialidad: nuevoServicio.especialidad,
      palabrasClave: nuevoServicio.palabrasClave,
      atributos: nuevoServicio.atributos,
      ubicaciones: ubicacionesIndices.map((index) => ubicacionesConcat[index]),
      terminos: {politicas: nuevoServicio.politicas, saludYSeguridad:nuevoServicio.saludYSeguridad, cancelacion:nuevoServicio.cancelacion }
    };

    try {
      await agregarServicio(nuevoServicioObj);
      swal({
        text: "¡Servicio agregado exitosamente!",
        icon: "success",
        button: "Aceptar",
      });

      setNuevoServicio({
        nombre: "",
        precio: "",
        imagen: [],
        descripcion: "",
        especialidad: "",
        palabrasClave: [],
        atributos: [],
        politicas:[],
        saludYSeguridad:[],
        cancelacion:[]
      });
    } catch (error) {
      swal({
        text: "Error al agregar el servicio",
        icon: "error",
        button: "Aceptar",
      });
    }
  };

  useEffect(() => {
    if (response) {
      setNuevoServicio((prevService) => ({
        ...prevService,
        imagen: response,
      }));
    }
  }, [response]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "palabrasClave") {
      const palabrasClaveArray = value
        .split(",")
        .map((palabra) => palabra.trim());
      setNuevoServicio((prevServicio) => ({
        ...prevServicio,
        [name]: palabrasClaveArray,
      }));
    } else if (name === "atributos") {
      const atributoArray = value
        .split(",")
        .map((atributos) => atributos.replace(/^\s+/, ""));
      setNuevoServicio((prevServicio) => ({
        ...prevServicio,
        [name]: atributoArray,
      }));
    } else if (name === "politicas") {
      const politicasArray = value
        .split(",")
        .map((politicas) => politicas.replace(/^\s+/, ""));
      setNuevoServicio((prevServicio) => ({
        ...prevServicio,
        [name]: politicasArray,
      }));
    } else if (name === "saludYSeguridad") {
      const saludYSeguridadArray = value
        .split(",")
        .map((saludYSeguridad) => saludYSeguridad.replace(/^\s+/, ""));
      setNuevoServicio((prevServicio) => ({
        ...prevServicio,
        [name]: saludYSeguridadArray,
      }));
    } else if (name === "cancelacion") {
      const cancelacionArray = value
        .split(",")
        .map((cancelacion) => cancelacion.replace(/^\s+/, ""));
      setNuevoServicio((prevServicio) => ({
        ...prevServicio,
        [name]: cancelacionArray,
      }));

    } else if (name === "imagen") {
      const imgFiles = event.target.files;
      if (imgFiles.length !== 5) {
        swal({
          text: "Debe seleccionar 5 imágenes",
          icon: "error",
          button: "Aceptar",
        });
        return false;
      }
    } else if (name === "precio") {
      if (!/^\d*\.?\d*$/.test(value)) {
        setPrecioError("Recuerda que solo debes ingresar números");
      } else {
        setPrecioError("");
      }
      setNuevoServicio((prevServicio) => ({
        ...prevServicio,
        [name]: value,
      }));
    } else {
      setNuevoServicio((prevServicio) => ({
        ...prevServicio,
        [name]: value,
      }));
    }
  };

  return (
    <FormAddService handleSubmit={handleSubmit} handleChange={handleChange} handleChangeImg={handleChangeImg} nuevoServicio={nuevoServicio} ubicacionesIndices={ubicacionesIndices} ubicacionesConcat={ubicacionesConcat} handleUbicacionesChange={handleUbicacionesChange} listServices={listServices} nuevaCiudad={nuevaCiudad} setNuevaCiudad={setNuevaCiudad} precioError={precioError} dataFetch={dataFetch} />
  );
};

export default AddService;