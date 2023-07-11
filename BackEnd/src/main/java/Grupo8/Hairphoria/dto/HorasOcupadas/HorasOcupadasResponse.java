package Grupo8.Hairphoria.dto.HorasOcupadas;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class HorasOcupadasResponse {
    private Long servicioId;
    private List<LocalDateTime> horas;
}
