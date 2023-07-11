package Grupo8.Hairphoria.controller;

import Grupo8.Hairphoria.dto.Profesional.ProfesionalResponse;
import Grupo8.Hairphoria.dto.Servicio.ServicioFavoritoResponse;
import Grupo8.Hairphoria.dto.Servicio.ServicioRequest;
import Grupo8.Hairphoria.dto.Servicio.ServicioResponse;
import Grupo8.Hairphoria.service.ServicioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/servicios")
public class ServicioController {

    private final ServicioService servicioService;

    @GetMapping
    public ResponseEntity<List<ServicioResponse>> listarServicios() {
        return ResponseEntity.ok(servicioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicioResponse> buscarServicio(@PathVariable Long id) {
        return ResponseEntity.ok(servicioService.findById(id));
    }

    @GetMapping("/profesionales/{especialidad}")
    public ResponseEntity<List<ProfesionalResponse>> buscarProfesionalesPorEspecialidad(@PathVariable String especialidad) {
        return ResponseEntity.ok(servicioService.findAllProfesionalesByServicioNombre(especialidad));
    }

    @GetMapping("/busqueda")
    public ResponseEntity<List<ServicioFavoritoResponse>> buscarServiciosPorCategoriaCiudadyFechaHora(@RequestParam String categoria, @RequestParam String ciudad, @RequestParam String fechaHora){
        return ResponseEntity.ok(servicioService.findAllByCategoriaAndCiudadAndFechaHora(categoria, ciudad, fechaHora));
    }

    @PostMapping
    public ResponseEntity<ServicioResponse> guardarServicio(@RequestBody ServicioRequest servicio) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicioService.save(servicio));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServicioResponse> updateById(@PathVariable Long id, @RequestBody ServicioRequest servicio) {
        return ResponseEntity.status(HttpStatus.OK).body(servicioService.update(id, servicio));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarServicio(@PathVariable Long id) {
        servicioService.deleteById(id);
        return ResponseEntity.ok("Se elimino el servicio de id: " + id);
    }

}
