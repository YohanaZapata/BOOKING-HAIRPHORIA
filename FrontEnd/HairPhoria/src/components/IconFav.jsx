import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFavState } from '../Context/FavContext';

const IconFav = () => {

  const { iconFav, handleFavorite } = useFavState();

  return (
    <div>
      <FontAwesomeIcon icon={iconFav} onClick={handleFavorite} />
    </div>
  );
};

export default IconFav;