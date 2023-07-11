import { useState } from 'react';

export function useFetchPostAddTurno() {
  const [dataFetch, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const addTurno= async (turno) => {
    console.log("turno post", turno)
    const url = 'http://3.19.243.36:8080/turnos';

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(turno),
      });

      if (response.ok) {
        const data = await response.json();
        setData(data);
        console.log('Turno agendado correctamente');
      } else {
        throw new Error('Error al agendar el turno');
      }

      setIsLoading(false);
    } catch (error) {
      console.error("error", error);
      setIsLoading(false);
      throw error;
    }
  };

  return { addTurno, isLoading, dataFetch };
}