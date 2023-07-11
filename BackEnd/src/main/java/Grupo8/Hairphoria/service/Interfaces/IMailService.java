package Grupo8.Hairphoria.service.Interfaces;

import Grupo8.Hairphoria.entity.Turno;
import Grupo8.Hairphoria.entity.Usuario;


public interface IMailService {
    void send(Usuario usuario);
    void confirmTurno(Turno turno);
}
