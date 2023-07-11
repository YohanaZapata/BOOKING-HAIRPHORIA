package Grupo8.Hairphoria.dto.Profesional;

import Grupo8.Hairphoria.Util.UtilDateTime;
import Grupo8.Hairphoria.dto.Horario.HorarioResponse;
import Grupo8.Hairphoria.dto.HorasOcupadas.HorasOcupadasResponse;
import Grupo8.Hairphoria.dto.Ubicacion.UbicacionResponse;
import Grupo8.Hairphoria.entity.Categoria;
import Grupo8.Hairphoria.entity.HorarioHora;
import Grupo8.Hairphoria.entity.Profesional;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

import static Grupo8.Hairphoria.Util.SafeUtil.safeStream;
import static java.util.Objects.nonNull;

@Data
@AllArgsConstructor
public class ProfesionalResponse {
    private String nombre;
    private String apellido;
    private Integer documento;
    private String email;
    private Integer telefono;
    private String rol;
    private Long id;
    private UbicacionResponse ubicacion;
    private List<String> especialidades;
    private List<HorarioResponse> horarios;
    private List<HorasOcupadasResponse> horasOcupadas;


    public ProfesionalResponse(Profesional profesional) {
        this.nombre = profesional.getUsuario().getNombre();
        this.apellido = profesional.getUsuario().getApellido();
        this.documento = profesional.getUsuario().getDocumento();
        this.email = profesional.getUsuario().getEmail();
        this.telefono = profesional.getUsuario().getTelefono();
        this.especialidades = profesional.getCategorias().stream().map(Categoria::getEspecialidad).toList();
        this.id = profesional.getId();
        this.ubicacion = nonNull(profesional.getUbicacion()) ? new UbicacionResponse(profesional.getUbicacion()) : null;
        this.horarios = profesional.getHorario().getHorarioDias().stream()
                .map(horario -> new HorarioResponse(horario.getHorarioHoras().stream()
                        .map(HorarioHora::getHora).collect(Collectors.toList()), horario.getDia().name())).toList();
        this.rol = profesional.getUsuario().getRol().getUsuarioRol().name();
        this.horasOcupadas = safeStream(profesional.getTurno())
                .map(turno -> new HorasOcupadasResponse(turno.getServicio().getId(),UtilDateTime.getDateTimeSpace(turno.getFecha_hora_inicio() , turno.getFecha_hora_final())))
                .toList();
    }
}
