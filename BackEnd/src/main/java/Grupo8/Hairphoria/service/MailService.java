package Grupo8.Hairphoria.service;

import Grupo8.Hairphoria.Util.Utils;
import Grupo8.Hairphoria.entity.Profesional;
import Grupo8.Hairphoria.entity.Servicio;
import Grupo8.Hairphoria.entity.Turno;
import Grupo8.Hairphoria.entity.Usuario;
import Grupo8.Hairphoria.service.Interfaces.IMailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.text.Format;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class MailService implements IMailService {

    private static final String HOST = "http://3.19.243.36:8080";
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    @Value("${spring.mail.username}")
    private String MAIL;
    @Value("${email.expiration.minutes}")
    private String EXPIRATION_MINUTES;

    @Override
    public void send(Usuario usuario) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper;

        try {

            helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
            helper.setFrom(MAIL);
            helper.setTo(usuario.getEmail());
            Context context = new Context();

            LocalDateTime expirationDate = LocalDateTime.now().plusMinutes(Long.parseLong(EXPIRATION_MINUTES));

            context.setVariable("nombre", usuario.getNombre());
            context.setVariable("apellido", usuario.getApellido());
            context.setVariable("link", String.format("%s/verify?code=%s-%s-%s", HOST,
                    Utils.generatorCode(),
                    Utils.encodeString(usuario.getId().toString()),
                    Utils.encodeString(expirationDate.toString())));

            String html = templateEngine.process("ValidationEmail", context);

            helper.setText(html, true);
            helper.setSubject("Validación de cuenta - Hairphoria");

            mailSender.send(message);

        } catch (
                MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void confirmTurno(Turno turno) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper;

        try {

            helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
            helper.setFrom(MAIL);
            helper.setTo(turno.getCliente().getUsuario().getEmail());
            Context context = new Context();

            context.setVariable("nombre", turno.getCliente().getUsuario().getNombre());
            context.setVariable("apellido", turno.getCliente().getUsuario().getApellido());
            context.setVariable("nombreDelServicio", turno.getServicio().getNombre());
            context.setVariable("nombreProfesional", turno.getProfesional().getUsuario().getNombre());
            context.setVariable("apellidoProfesional", turno.getProfesional().getUsuario().getApellido());
            context.setVariable("ciudad", turno.getProfesional().getUbicacion().getCiudad());

            NumberFormat formatterPrice = NumberFormat.getCurrencyInstance(new Locale("es", "CO"));
            context.setVariable("precioDelServicio", formatterPrice.format(turno.getServicio().getPrecio()));

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            context.setVariable("fechaYHora", formatter.format(turno.getFecha_hora_inicio()));

            String html = templateEngine.process("ValidationTurno", context);

            helper.setText(html, true);
            helper.setSubject("Confirmación de turno - Hairphoria");

            mailSender.send(message);

        } catch (
                MessagingException e) {
            throw new RuntimeException(e);
        }
    }

}
