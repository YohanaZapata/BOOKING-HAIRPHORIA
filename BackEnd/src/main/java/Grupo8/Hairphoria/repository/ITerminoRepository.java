package Grupo8.Hairphoria.repository;

import Grupo8.Hairphoria.entity.Termino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITerminoRepository extends JpaRepository<Termino, Long> {
}
