import { useState } from 'react';
import axios from 'axios';

export const useDeleteCategory = () => {
    const [isDeleteCategory, setIsDeleteCategory] = useState(false);
    const deleteCategory = async (id) => {
        const url = `http://3.19.243.36:8080/categorias/${id}`;
        try {
            setIsDeleteCategory(true)
            const token = sessionStorage.getItem('token');
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });

            if (response.status === 200) {
                console.log("Categoria eliminada exitosamente");
            }

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsDeleteCategory(false);
        }
    };

    return { deleteCategory, isDeleteCategory };
};