package Grupo8.Hairphoria.dto.Servicio;

import Grupo8.Hairphoria.entity.Servicio;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ServicioTurnoResponse {
    private Long id;
    private String nombre;
    private Double precio;
    private String especialidad;

    public ServicioTurnoResponse(Servicio servicio) {
        this.id = servicio.getId();
        this.nombre = servicio.getNombre();
        this.precio = servicio.getPrecio();
        this.especialidad = servicio.getCategoria().getEspecialidad();
    }
}
