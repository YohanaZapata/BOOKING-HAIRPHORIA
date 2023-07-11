import { useState } from "react";
import axios from "axios";

export const usePutPoliticas = () => {
    const [isEditPoliticas, setIsEditPoliticas] = useState(false);

    const editPoliticas = async (politicas) => {
        console.log(politicas);
        const url = `http://3.19.243.36:8080/ubicaciones/${ciudad}`;
        try {
            setIsEditPoliticas(true);
            const token = sessionStorage.getItem("token");
            const response = await axios.put(url, politicas, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                console.log("Politicas editadas exitosamente");
            }
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsEditPoliticas(false);
        }
    };

    return { editPoliticas, isEditPoliticas };
};