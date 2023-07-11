import { createContext, useContext, useState } from "react";

const BarSearchResultContext = createContext();

export const useBarSearchResult = () => useContext(BarSearchResultContext)

export const BarSearchResultProvider = ({children}) => {

    const [mostarCategorias , setMostarCategorias] = useState(true);
    const [mostrarBusqueda , setMostrarBusqueda] = useState(false);

    
    const [search , setSearch] = useState()
    

    const barSearchResultState = {
        mostarCategorias,
        setMostarCategorias,
        mostrarBusqueda,
        setMostrarBusqueda,
        search,
        setSearch
    }

    return (
        <BarSearchResultContext.Provider value={barSearchResultState}>
            { children }
        </BarSearchResultContext.Provider>
    )
}