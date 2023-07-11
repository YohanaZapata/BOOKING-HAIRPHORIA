package Grupo8.Hairphoria.dto.Turno;

import Grupo8.Hairphoria.dto.Cliente.ClienteResponse;
import Grupo8.Hairphoria.dto.Profesional.ProfesionalResponse;
import Grupo8.Hairphoria.dto.Servicio.ServicioResponse;
import Grupo8.Hairphoria.dto.Servicio.ServicioTurnoResponse;
import Grupo8.Hairphoria.dto.Usuario.UsuarioTurnoResponse;
import Grupo8.Hairphoria.entity.Turno;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TurnoResponse {
    private Long id;
    private LocalDateTime fecha_hora_inicio;
    private LocalDateTime fecha_hora_final;
    private UsuarioTurnoResponse cliente;
    private UsuarioTurnoResponse profesional;
    private ServicioTurnoResponse servicio;
    private Long segundoTelefono;
    private Boolean alergiasConfirmadas;
    private String alergias;

    public TurnoResponse(Turno turno) {
        this.id = turno.getId();
        this.cliente = new UsuarioTurnoResponse(turno.getCliente().getUsuario());
        this.profesional = new UsuarioTurnoResponse(turno.getProfesional().getUsuario());
        this.servicio = new ServicioTurnoResponse(turno.getServicio());
        this.fecha_hora_inicio = turno.getFecha_hora_inicio();
        this.fecha_hora_final = turno.getFecha_hora_final();
        this.segundoTelefono = turno.getSegundoTelefono();
        this.alergias = turno.getAlergias();
        this.alergiasConfirmadas = turno.getAlergiasConfirmadas();
    }
}
