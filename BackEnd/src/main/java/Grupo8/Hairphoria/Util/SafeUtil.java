package Grupo8.Hairphoria.Util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Collection;
import java.util.Objects;
import java.util.stream.Stream;


@NoArgsConstructor(access= AccessLevel.PRIVATE)
public class SafeUtil {
    public static <T> Stream<T> safeStream(Collection<T> collection) {
        return collection == null ? Stream.empty() : collection.stream().filter(Objects::nonNull);
    }
}

