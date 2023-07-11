package Grupo8.Hairphoria.Util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UtilDateTime {

    public static Integer periodBetweenDateTime(LocalDateTime date1, LocalDateTime date2) {
        return Math.toIntExact(ChronoUnit.HOURS.between(date1, date2));
    }

    public static List<LocalDateTime> getDateTimeSpace(LocalDateTime startDateTime, LocalDateTime endDateTime) {

        List<LocalDateTime> dates = new ArrayList<>();
        int diffHours = periodBetweenDateTime(startDateTime, endDateTime);

        for (int i = 0; i < diffHours; i++) {
            dates.add(startDateTime.plusHours(i));
        }

        dates.add(endDateTime);

        return dates;

    }

}
