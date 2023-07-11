package Grupo8.Hairphoria.repository;

import Grupo8.Hairphoria.entity.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITurnoRepository extends JpaRepository<Turno, Long> {
    List<Turno> findAllByProfesional_UsuarioEmail(String email);
    List<Turno> findAllByCliente_UsuarioEmail(String email);
}
