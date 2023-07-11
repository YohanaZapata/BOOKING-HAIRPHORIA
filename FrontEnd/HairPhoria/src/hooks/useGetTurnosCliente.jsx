import { useEffect, useState } from 'react';
import axios from 'axios';

const useGetTurnosCliente = () => {
    const [turnosCliente, setTurnosCliente] = useState([]);
    const [error, setError] = useState(null);
    
    const getTurnosClientes = async () => {
        try {
            const email = sessionStorage.getItem("email");
            const url = `http://3.19.243.36:8080/turnos/cliente/${email}`;
            const token = sessionStorage.getItem("token");
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setTurnosCliente(response.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        getTurnosClientes();
    }, []);

    return { turnosCliente, error, getTurnosClientes };
};

export default useGetTurnosCliente;