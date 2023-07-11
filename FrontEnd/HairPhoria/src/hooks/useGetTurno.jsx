import { useEffect, useState } from 'react';
import axios from 'axios';

const useGetTurno = () => {
  const apiUrl = `http://3.19.243.36:8080/turnos/${id}`;
  const [turno, setTurno] = useState([]);
  const [error, setError] = useState(null);

  const getTurnos = async () => {
    try {
      const response = await axios.get(apiUrl);
      setTurno(response.data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    getTurnos();
  }, []);

  return { turno, error, getTurnos };
};

export default useGetTurno;