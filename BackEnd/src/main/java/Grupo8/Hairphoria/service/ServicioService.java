package Grupo8.Hairphoria.service;

import Grupo8.Hairphoria.dto.HorasOcupadas.HorasOcupadasResponse;
import Grupo8.Hairphoria.dto.Profesional.ProfesionalResponse;
import Grupo8.Hairphoria.dto.Servicio.ServicioFavoritoResponse;
import Grupo8.Hairphoria.dto.Servicio.ServicioRequest;
import Grupo8.Hairphoria.dto.Servicio.ServicioResponse;
import Grupo8.Hairphoria.entity.*;
import Grupo8.Hairphoria.exceptions.BadRequestException;
import Grupo8.Hairphoria.exceptions.ResourceNotFoundException;
import Grupo8.Hairphoria.repository.*;
import Grupo8.Hairphoria.service.Interfaces.IServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static Grupo8.Hairphoria.Util.SafeUtil.safeStream;

@Service
@RequiredArgsConstructor
public class ServicioService implements IServiceService {


    private final IServicioRepository servicioRepository;
    private final ICategoriaRepository categoriaRepository;
    private final IPalabraClaveRepository palabraClaveRepository;
    private final IImagenRepository imagenRepository;
    private final IAtributoRepository atributoRepository;
    private final IUbicacionRepository ubicacionRepository;
    private final ITerminoRepository terminoRepository;
    private final ITerminoCampoRepository  terminoCampoRepository;


    @Override
    @Cacheable("servicios")
    public List<ServicioResponse> findAll() {
        return servicioRepository.findAll().stream()
                .map(servicio -> new ServicioResponse(servicio)).toList();
    }

    @Override
    @Cacheable("servicio")
    public ServicioResponse findById(Long id) {
        return servicioRepository.findById(id)
                .map(servicio -> new ServicioResponse(servicio))
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra el servicio con id " + id));
    }

    @Override
    @Cacheable("serviciosbusqueda")
    public List<ServicioFavoritoResponse> findAllByCategoriaAndCiudadAndFechaHora(String categoria, String ciudad, String fechahora) {

        try {
            return safeStream(categoriaRepository.findByEspecialidad(categoria)
                    .orElseThrow(() -> new BadRequestException(String.format("La categoria que fue ingresada: %s no existe", categoria)))
                    .getProfesionals())
                    .filter(profesional -> profesional.getUbicacion().getCiudad().equalsIgnoreCase(ciudad))
                    .map(ProfesionalResponse::new)
                    .filter(profesional -> !safeStream(profesional.getHorasOcupadas()).map(HorasOcupadasResponse::getHoras).flatMap(Collection::stream).toList().contains(LocalDateTime.parse(fechahora)))
                    .map(profesional -> ubicacionRepository.findByCiudad(profesional.getUbicacion().getCiudad())
                    .orElseThrow(() -> new BadRequestException(String.format("La ubicacion que fue ingresada: %s no existe", profesional.getUbicacion().getCiudad()))))
                    .map(Ubicacion::getServicios)
                    .flatMap(Collection::stream)
                    .map(ServicioFavoritoResponse::new)
                    .sorted(Comparator.comparing(ServicioFavoritoResponse::getNombre))
                    .toList();
        }catch (DateTimeException e) {
            throw new BadRequestException("La fecha ingresada no es valida");
        }
    }

    @Override
    public List<ProfesionalResponse> findAllProfesionalesByServicioNombre(String nombre) {
        return servicioRepository.findByNombre(nombre)
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra el servicio con el nombre " + nombre))
                .getCategoria()
                .getProfesionals()
                .stream().map(profesional -> new ProfesionalResponse(profesional))
                .toList();
    }

    @Override
    @Caching(evict = {@CacheEvict(value = "servicios", allEntries = true), @CacheEvict(value = "servicio", allEntries = true), @CacheEvict(value = "serviciosbusqueda", allEntries = true)})
    public ServicioResponse save(ServicioRequest servicio) {
        Servicio servicioToSave = new Servicio();
        servicioToSave.setNombre(servicio.getNombre());
        servicioToSave.setDescripcion(servicio.getDescripcion());
        servicioToSave.setPrecio(servicio.getPrecio());
        servicioToSave.setCategoria(categoriaRepository.findByEspecialidad(servicio.getEspecialidad())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la especialidad dada: " + servicio.getEspecialidad())));

        if (servicio.getTerminos() != null){
            if (servicio.getTerminos().getId() != null) {
                Termino terminoObtenido = terminoRepository.findById(servicio.getTerminos().getId()).orElseThrow(() -> new ResourceNotFoundException(String.format("El termino con este id: %s no fue encontrado", servicio.getTerminos().getId())));
                servicioToSave.setTermino(terminoObtenido);
            } else {
                if (servicio.getTerminos().getPoliticas() == null || servicio.getTerminos().getSaludYSeguridad() == null || servicio.getTerminos().getCancelacion() == null) {
                    throw new BadRequestException("Para ingresar los términos de un servicio es obligatorio, llenar los campos de políticas, cancelación, salud y seguridad");
                }
                Termino terminoToSave = new Termino();
                terminoToSave.setTerminoHairphoria(servicio.getTerminos().getPoliticas().stream().map(politica -> {
                    TerminoCampo terminoCampo = new TerminoCampo();
                    terminoCampo.setNombre(politica);
                    return terminoCampoRepository.save(terminoCampo);
                }).collect(Collectors.toSet()));

                terminoToSave.setTerminoSaludySeguridad(servicio.getTerminos().getSaludYSeguridad().stream().map(saludyserguridad -> {
                    TerminoCampo terminoCampo = new TerminoCampo();
                    terminoCampo.setNombre(saludyserguridad);
                    return  terminoCampoRepository.save(terminoCampo);
                }).collect(Collectors.toSet()));

                terminoToSave.setTerminosCancelacion(servicio.getTerminos().getCancelacion().stream().map(cancelacion -> {
                    TerminoCampo terminoCampo = new TerminoCampo();
                    terminoCampo.setNombre(cancelacion);
                    return terminoCampoRepository.save(terminoCampo);
                }).collect(Collectors.toSet()));

                servicioToSave.setTermino(terminoRepository.save(terminoToSave));
            }
        }

        Servicio savedServicio = servicioRepository.save(servicioToSave); // Guardar el servicio primero

        if (servicio.getUbicaciones() != null) {
            servicioToSave.setUbicaciones(servicio.getUbicaciones().stream().map(ubicacion -> {
                        Ubicacion ubicacionToSave = ubicacionRepository.findByCiudad(ubicacion.getCiudad()).orElse(new Ubicacion());
                        if (ubicacionToSave.getId() != null) {
                            Set<Servicio> ubicacionToAdd = ubicacionToSave.getServicios();
                            ubicacionToAdd.add(servicioToSave);
                            ubicacionToSave.setCoordenadas(ubicacion.getCoordenadas());
                            ubicacionToSave.setDireccion(ubicacion.getDireccion());
                            ubicacionToSave.setServicios(ubicacionToAdd);
                            return ubicacionRepository.save(ubicacionToSave);
                        }
                        ubicacionToSave.setCiudad(ubicacion.getCiudad());
                        ubicacionToSave.setCoordenadas(ubicacion.getCoordenadas());
                        ubicacionToSave.setDireccion(ubicacion.getDireccion());

                        Set<Servicio> servicios =  ubicacionToSave.getServicios() != null && !ubicacionToSave.getServicios().isEmpty() ? ubicacionToSave.getServicios() : new LinkedHashSet<>();
                        servicios.add(servicioToSave);

                        ubicacionToSave.setServicios(servicios);
                        return ubicacionRepository.save(ubicacionToSave);
                    })
                    .collect(Collectors.toSet()));

        }

        if(servicio.getPalabrasClave() != null) {
            Set<PalabraClave> palabrasClave = servicio.getPalabrasClave().stream()
                    .map(palabra -> {
                        PalabraClave clave = new PalabraClave();
                        clave.setPalabra(palabra);
                        clave.getServicios().add(servicioToSave); // Agregar servicio al conjunto de servicios de PalabraClave
                        servicioToSave.getPalabrasClave().add(clave); // Agregar palabra clave al conjunto de palabras clave de Servicio
                        return palabraClaveRepository.save(clave);
                    })
                    .collect(Collectors.toSet());

            savedServicio.setPalabrasClave(palabrasClave);
        }

        if (servicio.getImagen() != null) {
            List<Imagen> imagenes = servicio.getImagen().stream()
                    .map(imagenUrl -> {
                        Imagen imagen = new Imagen();
                        imagen.setImagen(imagenUrl);
                        imagen.setServicio(savedServicio); // Establecer la referencia al servicio guardado
                        return imagenRepository.save(imagen);
                    })
                    .collect(Collectors.toList());

            savedServicio.setImagen(imagenes);
        }

        if (servicio.getAtributos() != null) {
            List<Atributo> atributos = servicio.getAtributos().stream()
                    .map(palabraAtributo -> {
                        Atributo atributo = new Atributo();
                        atributo.setAtributo(palabraAtributo);
                        atributo.setServicio(savedServicio); // Establecer la referencia al servicio guardado
                        return atributoRepository.save(atributo);
                    })
                    .collect(Collectors.toList());

            savedServicio.setAtributo(atributos);
        }

        return new ServicioResponse(savedServicio);
    }


    @Override
    @Caching(evict = {@CacheEvict(value = "servicios", allEntries = true), @CacheEvict(value = "servicio", allEntries = true), @CacheEvict(value = "serviciosbusqueda", allEntries = true)})
    public ServicioResponse update(Long id, ServicioRequest servicio) {
        Servicio servicioExistente = servicioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el servicio con id " + id));

        if (servicio.getNombre() != null) {
            servicioExistente.setNombre(servicio.getNombre());
        }
        if (servicio.getDescripcion() != null) {
            servicioExistente.setDescripcion(servicio.getDescripcion());
        }
        if (servicio.getTerminos() != null) {
            if (servicio.getTerminos().getId() != null) {
                Termino terminoObtenido = terminoRepository.findById(servicio.getTerminos().getId()).orElseThrow(() -> new ResourceNotFoundException(String.format("El termino con este id: %s no fue encontrado", servicio.getTerminos().getId())));
                servicioExistente.setTermino(terminoObtenido);
            } else {
                if (servicio.getTerminos().getPoliticas() == null || servicio.getTerminos().getSaludYSeguridad() == null || servicio.getTerminos().getCancelacion() == null) {
                    throw new BadRequestException("Para ingresar los términos de un servicio es obligatorio, llenar los campos de políticas, cancelación, salud y seguridad");
                }
                Termino terminoToUpdate = new Termino();
                terminoToUpdate.setTerminoHairphoria(servicio.getTerminos().getPoliticas().stream().map(politica -> {
                    TerminoCampo terminoCampo = new TerminoCampo();
                    terminoCampo.setNombre(politica);
                    return terminoCampoRepository.save(terminoCampo);
                }).collect(Collectors.toSet()));

                terminoToUpdate.setTerminoSaludySeguridad(servicio.getTerminos().getSaludYSeguridad().stream().map(saludyserguridad -> {
                    TerminoCampo terminoCampo = new TerminoCampo();
                    terminoCampo.setNombre(saludyserguridad);
                    return terminoCampoRepository.save(terminoCampo);
                }).collect(Collectors.toSet()));

                terminoToUpdate.setTerminosCancelacion(servicio.getTerminos().getCancelacion().stream().map(cancelacion -> {
                    TerminoCampo terminoCampo = new TerminoCampo();
                    terminoCampo.setNombre(cancelacion);
                    return terminoCampoRepository.save(terminoCampo);
                }).collect(Collectors.toSet()));

                servicioExistente.setTermino(terminoRepository.save(terminoToUpdate));
            }
        }
        if (servicio.getImagen() != null) {
            List<Imagen> imagenes = servicio.getImagen().stream()
                    .map(imagenUrl -> {
                        Imagen imagen = new Imagen();
                        imagen.setImagen(imagenUrl);
                        imagen.setServicio(servicioExistente);
                        return imagen;
                    })
                    .collect(Collectors.toList());
            servicioExistente.setImagen(imagenes);
        }
        if (servicio.getUbicaciones() != null && !servicio.getUbicaciones().isEmpty()) {
            servicioExistente.setUbicaciones(servicio.getUbicaciones().stream().map(ubicacion -> {
                        Ubicacion ubicacionExistente = ubicacionRepository.findByCiudad(ubicacion.getCiudad()).orElse(new Ubicacion());
                        if (ubicacionExistente.getId() != null) {
                            ubicacionExistente.setCoordenadas(ubicacion.getCoordenadas());
                            ubicacionExistente.setDireccion(ubicacion.getDireccion());
                            return ubicacionRepository.save(ubicacionExistente);
                        }
                        ubicacionExistente.setCiudad(ubicacion.getCiudad());
                        ubicacionExistente.setCoordenadas(ubicacion.getCoordenadas());
                        ubicacionExistente.setDireccion(ubicacion.getDireccion());

                        Set<Servicio> servicios = ubicacionExistente.getServicios() != null && !ubicacionExistente.getServicios().isEmpty() ? ubicacionExistente.getServicios() : new LinkedHashSet<>();
                        servicios.add(servicioExistente);
                        return ubicacionRepository.save(ubicacionExistente);
                    })
                    .collect(Collectors.toSet()));

        }
        if (servicio.getPrecio() != null) {
            servicioExistente.setPrecio(servicio.getPrecio());
        }
        if (servicio.getEspecialidad() != null) {
            servicioExistente.setCategoria(categoriaRepository.findByEspecialidad(servicio.getEspecialidad())
                    .orElseThrow(() -> new ResourceNotFoundException("No se encontró la especialidad dada: " + servicio.getEspecialidad())));
        }
        if (servicio.getPalabrasClave() != null && !servicio.getPalabrasClave().isEmpty()) {
            Set<PalabraClave> palabraClaveToUpdate = servicio.getPalabrasClave().stream().map(palabraClave -> palabraClaveRepository.findByPalabra(palabraClave)
                    .orElseThrow(() -> new BadRequestException(String.format("La palabra  %s no fue encontrada", palabraClave)))).collect(Collectors.toSet());
            servicioExistente.setPalabrasClave(palabraClaveToUpdate);
        }

        return new ServicioResponse(servicioRepository.save(servicioExistente));

    }

    @Override
    @Caching(evict = {@CacheEvict(value = "servicios", allEntries = true), @CacheEvict(value = "servicio", allEntries = true), @CacheEvict(value = "serviciosbusqueda", allEntries = true)})
    public void deleteById(Long id) throws ResourceNotFoundException {
        Servicio servicioExistente = servicioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el servicio con id " + id));

        servicioExistente.getUbicaciones().forEach(ubicacion -> {
            ubicacion.getServicios().removeIf(servicio -> servicio.getId().equals(id));
            ubicacionRepository.save(ubicacion);
        });

        servicioRepository.deleteById(id);
    }
}
