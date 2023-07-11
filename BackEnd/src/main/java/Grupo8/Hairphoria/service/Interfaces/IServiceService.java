package Grupo8.Hairphoria.service.Interfaces;

import Grupo8.Hairphoria.dto.Profesional.ProfesionalResponse;
import Grupo8.Hairphoria.dto.Servicio.ServicioFavoritoResponse;
import Grupo8.Hairphoria.dto.Servicio.ServicioRequest;
import Grupo8.Hairphoria.dto.Servicio.ServicioResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface IServiceService {

    List<ServicioResponse> findAll();
    List<ServicioFavoritoResponse> findAllByCategoriaAndCiudadAndFechaHora(String categoria, String ciudad, String fechahora);

    ServicioResponse findById(Long id);

    List<ProfesionalResponse> findAllProfesionalesByServicioNombre(String nombre);

    ServicioResponse save(ServicioRequest servicio);

    ServicioResponse update(Long id, ServicioRequest servicio);

    void deleteById(Long id);


}
