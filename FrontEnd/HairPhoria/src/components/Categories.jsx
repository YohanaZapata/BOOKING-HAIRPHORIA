import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../styles/Card.css";
import { useFetchCategories } from "../hooks/useFetchCategories";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "../Context/AuthContext";
import { useGlobalStates } from "../Context/Context";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useFetchServices } from "../hooks/useFetchServices";
import swal from "sweetalert";

const Categories = () => {

  //autenticacion de login
  const { token } = useContext(AuthContext);
  const isLoggedIn = !!token;

  const { getDataFilterIdByEmail, reloadPage } = useGlobalStates();
  const {
    clienteDataFetch,
  } = getDataFilterIdByEmail();

  const { dataFetch: dataFetchCategory, isLoading: isLoadingCategory } = useFetchCategories();
  console.log(dataFetchCategory);


  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const updateTotalPages = () => {
      const totalPages = Math.ceil(
        (dataFetchCategory?.length - deletedCategories.length) / cardsPerPage
      );
      setTotalPages(totalPages);
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    };

    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 480) {
        setCardsPerPage(1);
      } else if (screenWidth <= 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(4);
      }
    };

    handleResize();
    updateTotalPages();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dataFetchCategory, deletedCategories, cardsPerPage, currentPage]);


  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    const totalPages = Math.ceil(dataFetchCategory?.length / cardsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;

  //eliminar categoria
  const { deleteCategory, isDeleteCategory } = useDeleteCategory();
  const { dataFetch: dataFetchServices, isLoading: isLoadingServices } = useFetchServices();

  const listaServiciosPorCategoria = dataFetchServices;
  const listaNombreCategoria = dataFetchCategory;



  const handleDeleteCard = async (categoryId) => {
    const serviciosEnCategoria = listaServiciosPorCategoria.filter(
      (servicio) =>
        servicio.especialidad ===
        listaNombreCategoria.find((categoria) => categoria.id === categoryId)?.especialidad
    );

    if (serviciosEnCategoria.length > 0) {
      swal({
        text: "Primero debes eliminar todos los servicios de esta categoría",
        icon: "warning",
        buttons: "Aceptar",
      });
    } else {
      const confirmDelete = async () => {
        const result = await swal({
          text: "¿Estás seguro de que deseas eliminar esta categoría?",
          icon: "warning",
          buttons: ["Cancelar", "Eliminar"],
          dangerMode: true,
        });

        if (result) {
          try {
            await deleteCategory(categoryId);
            setDeletedCategories((prevDeletedCategories) => [...prevDeletedCategories, categoryId]);
            swal({
              text: "La categoría se ha eliminado exitosamente",
              icon: "success",
              buttons: ["Aceptar"],
            });
          } catch (error) {
            console.error(error);
            swal({
              text: "Ha ocurrido un error al eliminar la categoría",
              icon: "error",
              buttons: ["Aceptar"],
            });
          }
        }
      };

      confirmDelete();
    }
  };


  const currentCards = dataFetchCategory
    ?.filter((category) => !deletedCategories.includes(category.id))
    .slice(indexOfFirstCard, indexOfLastCard);

  return (
    <>
      <div className="containerTitleButton">
        <h2 className="titleCard">Categorias</h2>

      </div>
      <div className="cardContainer">
        {isLoadingCategory ? (
          <div className="spinner"><ClipLoader color="var(--color-primary-4)" size={80} /></div>
        ) : (
          currentCards.map((value, index) => (
            <div key={index} className="card">
              {isLoggedIn && clienteDataFetch?.rol === 'ADMIN' && (
                <FontAwesomeIcon
                  icon={faTrash}
                  className="iconDelete"
                  onClick={() => handleDeleteCard(value.id)}
                />
              )}
              <Link
                to={`/${value.especialidad}`}
                onClick={reloadPage}
              >
                <h3 className="title">{value.especialidad}</h3>
                <img className="img" src={value.imagen} alt="imagen categoria" />
              </Link>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button
          className="paginationButton"
          disabled={currentPage === 1}
          onClick={goToPreviousPage}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          className="paginationButton"
          disabled={currentPage === totalPages}
          onClick={goToNextPage}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

    </>
  );
};

export default Categories;