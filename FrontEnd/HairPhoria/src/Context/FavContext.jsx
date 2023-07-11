import { createContext, useContext, useEffect, useState } from 'react'
import usePostStats from '../hooks/usePostStats';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import swal from 'sweetalert';
import { AuthContext } from './AuthContext';

const FavState = createContext();

const FavContext = ({ children, service }) => {
  const email = sessionStorage.getItem("email");
  const filteredStats = service?.stats?.filter((stat) => stat.email === email);
  const isFavorite = filteredStats?.length > 0 ? filteredStats[0].favorito : false;
  const [isFavoriteState, setIsFavoriteState] = useState(isFavorite);
  const { addStats } = usePostStats();

  //autenticacion de login
  const { token } = useContext(AuthContext);
  const isLoggedIn = !!token;

  useEffect(() => {
    setIsFavoriteState(isFavorite);
  }, [isFavorite]);


  const handleFavorite = (serviceId, newFavoriteState) => {
    if (isLoggedIn) {
      setIsFavoriteState((prevState) => !prevState);
      console.log("SERVICEID FAVCONTEXT", serviceId)
      addFavorito(serviceId, newFavoriteState);
    }
    else {
      if (!isLoggedIn) {
        swal({
          text: "Debes ingresar a tu cuenta para añadir a favoritos 😉",
          icon: "warning",
          button: "Aceptar",
        });
        return;
      }
    }

  };

  const iconFav = isFavoriteState ? faHeart : faHeartOutline;

  const addFavorito = (serviceId, newFavoriteState) => {
    const id = service?.id || serviceId;
    const favoritoValue = newFavoriteState === false ? newFavoriteState : !isFavoriteState;
    const dataFavorito = { favorito: favoritoValue, email: email };
    const url = `http://3.19.243.36:8080/stats/marcarfavorito/${id}`;
    addStats(url, dataFavorito);
  };

  return (
    <FavState.Provider value={{
      iconFav,
      handleFavorite,
      isFavoriteState
    }}>
      {children}
    </FavState.Provider>
  )
}

export default FavContext;

export const useFavState = () => useContext(FavState);