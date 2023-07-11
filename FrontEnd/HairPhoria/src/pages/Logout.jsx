import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { useGlobalStates } from '../Context/Context';
import { AuthContext } from '../Context/AuthContext';
import "../styles/Logout.css"

const Logout = () => {
  const navigate = useNavigate();
  const { dispatch, token } = useContext(AuthContext);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    window.location.reload();
  };

  const handleRedirectProfile = () => {
    navigate("/dashboard")
    window.location.reload();
  }

  const { getDataFilterIdByEmail } = useGlobalStates();
  const {
    clienteDataFetch,
  } = getDataFilterIdByEmail();


  return (
    <div className="logoutPage">
      <div className="svgShape"></div>
      <div className="logoutContainer">
      <h3>¿Deseas cerrar sesión?</h3>
      ¡{clienteDataFetch?.nombre} gracias por elegir nuestros servicios! Cualquier consulta puedes contactar nuestras redes.
        <div className="logoutButtons">
          <button onClick={handleRedirectProfile}>Cancelar</button>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  )
}

export default Logout
