package Grupo8.Hairphoria.dto.Usuario;

import Grupo8.Hairphoria.entity.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioTurnoResponse {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;

    public UsuarioTurnoResponse(Usuario usuario) {
        this.id = usuario.getId();
        this.nombre = usuario.getNombre();
        this.apellido = usuario.getApellido();
        this.email = usuario.getEmail();
    }
}
