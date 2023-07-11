import React from 'react'
import { useFavState } from '../Context/FavContext';

const FavoriteText = () => {
  //importe favoritos context
  const { isFavoriteState } = useFavState();
  console.log("isFavorite Favorite textt:", isFavoriteState)

  return (
    <div>
      {isFavoriteState ? "Añadido a favoritos" : "Añadir a favorito"}
    </div>
  )
}

export default FavoriteText