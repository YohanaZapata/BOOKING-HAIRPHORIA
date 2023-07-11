import React, { useEffect, useState } from 'react'
import "../styles/Card.css"
import { useGlobalStates } from '../Context/Context';
import { routes } from '../routes';
import { Link } from 'react-router-dom';
import { ClipLoader } from "react-spinners";
import { useFavState } from '../Context/FavContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Favorites = () => {

  const [loading, setLoading] = useState(true);
  const { getDataFilterIdByEmail } = useGlobalStates();
  const { clienteDataFetch } = getDataFilterIdByEmail();
  const [favorites, setFavorites] = useState([]);


  useEffect(() => {
    setLoading(true);
    if (clienteDataFetch && clienteDataFetch?.serviciosFavoritos) {
      const initialFavorites = clienteDataFetch.serviciosFavoritos.map(servicio => ({
        ...servicio,
        isFavorite: true
      }));

      setFavorites(initialFavorites);
      setLoading(false);
    }
  }, [clienteDataFetch?.serviciosFavoritos]);


  const { handleFavorite } = useFavState();

  const toggleFavorite = (servicio) => {
    setFavorites(prevFavorites => {
      return prevFavorites.map(prevServicio => {
        if (prevServicio.id === servicio.id) {
          const newFavoriteState = !prevServicio.isFavorite;
          const serviceId = servicio?.id
          handleFavorite(serviceId, newFavoriteState);
          return {
            ...prevServicio,
            isFavorite: newFavoriteState
          };
        }
        return prevServicio;
      });
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFavorites(prevFavorites => prevFavorites.filter(servicio => servicio.isFavorite));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [favorites]);


  return (
    <div className='favoritesContainer'>
      <div className="containerTitleButton">
        <h2 className='titleCard'>¡Aquí están tus servicios favoritos!</h2>
      </div>
      <div className='cardContainer'>
        {loading ? (
          <div className="spinner">
            <ClipLoader color="var(--color-primary-4)" size={80} />
          </div>
        ) : (
          favorites.length > 0 ? (
            favorites.map((servicio) => (
              <div className='card' key={servicio.id}>
                <div className="favList">
                  <FontAwesomeIcon
                    icon={servicio.isFavorite ? faHeart : faHeartOutline}
                    onClick={() => toggleFavorite(servicio)}
                  />
                </div>
                <Link to={`${routes.details}/${servicio.nombre}`}>
                  <h3 className='title'>{servicio.nombre}</h3>
                </Link>
                <img className="img" src={servicio.imagen[0]} alt="imagen categoria" />
              </div>
            ))
          ) : (
            <p>Todavía no has agregado ningún favorito.</p>
          )
        )}
      </div>
    </div>
  )
}

export default Favorites