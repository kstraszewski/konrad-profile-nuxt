# Źródła katalogu demonstracyjnego Oferteo

Data opracowania: 26 września 2026. Katalog `shared/data/oferteo-contractors.json` zawiera sześć publicznych profili usług remontowych z Warszawy i Pruszkowa. Jest małą próbką danych do demonstracji wyszukiwania, a nie pełnym ani oficjalnym rankingiem Oferteo.

## Metoda i zakres

Profile znaleziono przez wyszukiwarkę i odczytano z publicznych stron Oferteo za pomocą narzędzia internetowego. Zachowano nazwę profilu, miasto, opis usług, agregat ocen, liczbę opinii i bezpośredni link źródłowy. Opisy napisano własnymi słowami. Nie skopiowano recenzji, zdjęć, telefonu, e-maila, adresu ulicznego, danych rejestrowych ani danych zleceniodawców. `imageUrl` i `district` pozostają `null`.

`retrievedAt` oznacza datę pobrania materiału źródłowego przez narzędzie podczas przygotowania demo, nie gwarantuje aktualizacji samej strony w tym dniu. Narzędzie może zwracać zindeksowaną wersję strony. Opinie i zakres działalności mogą ulec zmianie; przed kontaktem należy przejść do bieżącego profilu Oferteo.

Nie pobierano informacji zza logowania, formularzy kontaktowych ani API odkrywających dane kontaktowe. [robots.txt Oferteo](https://www.oferteo.pl/robots.txt) odczytany podczas przygotowania dopuszcza publiczne wyszukiwanie i użycie jako dane wejściowe AI (`search=yes`, `ai-input=yes`), a zabrania wykorzystania do treningu (`ai-train=no`); wyklucza też m.in. prywatne strony konta i wybrane formularze. Katalog służy wyłącznie jako wejście do rekomendacji w demo. Ta obserwacja nie zastępuje odrębnej licencji na zdjęcia ani materiałów marketingowych.

## Zweryfikowane rekordy

| Profil | Miasto | Ocena w odczytanym profilu | Liczba opinii | Podstawa zakresu usług |
| --- | --- | --- | --- | --- |
| [Mistrz Łazienek](https://www.oferteo.pl/dabudinwest-spolka-z-ograniczona-odpowiedzialnoscia/firma/5683720) | Warszawa | 4,62/5 | 8 | Sekcja „O nas”: remonty łazienek i WC, demontaż, hydroizolacja, instalacje wodno-kanalizacyjne i elektryczne, płytki, biały montaż, projekt techniczny. |
| [Mykola Zubyk](https://www.oferteo.pl/mykola-zubyk/firma/6199496) | Warszawa | 5/5 | 23 | Sekcja „O nas”: Warszawa i okolice, remonty łazienek, wykończenie kuchni, malowanie, G-K, panele i płytki. |
| [Usługi remontowe](https://www.oferteo.pl/uslugi-remontowe/firma/3973006) | Warszawa | 5/5 | 4 | Sekcja „O nas”: remonty i wykończenie wnętrz w Warszawie, prace glazurnicze, biały montaż, łazienki od podstaw. |
| [ARTEX](https://www.oferteo.pl/artex/firma/7171362) | Warszawa | 5/5 | 3 | Sekcja „O nas”: łazienki i kuchnie, płytki, instalacje elektryczne i hydrauliczne, sufity podwieszane, malowanie. |
| [Polecani Budowlańcy](https://www.oferteo.pl/polecani-budowlancy/firma/6032875) | Warszawa | 5/5 | 2 | Sekcja „O nas”: remonty pod klucz, łazienki, aranżacja wnętrz, posadzki, ogrzewanie podłogowe, hydraulika. |
| [Royal Remont](https://www.oferteo.pl/vasyl-pavliuk-royal-remont/firma/7004785) | Pruszków | 5/5 | 10 | Sekcja „O nas”: remonty mieszkań i domów, płytki, modernizacje łazienek, G-K, malowanie, drzwi i pomoc w zakupie materiałów. |

Oceny przytoczono jako agregat prezentowany na Oferteo. Według objaśnienia przy ocenach agregat obejmuje opinie potwierdzone i niepotwierdzone, z wyłączeniem ocen Google. Sam odczyt wyniku nie oznacza niezależnej weryfikacji jakości wykonawcy.

W wynikach wyszukiwania widoczne były różne wersje liczby opinii (m.in. Mykola Zubyk: 22, Royal Remont: 11 lub większe liczby na stronie kategorii). W katalogu zachowano liczby z bezpośrednio otwartych profili: odpowiednio 23 i 10. Nie połączono niespójnych snapshotów w jeden rzekomo bieżący wynik. Profil Glazrem pominięto, ponieważ otwarcie jego adresu przekierowało na stronę kategorii. Dwa inne profile pominięto po błędach odczytu.

## Zasady dla asystenta demo

- Rekomendować wyłącznie rekordy znajdujące się w katalogu; uzasadniać dopasowanie usługami z rekordu.
- Warszawa jest domyślnym scenariuszem. Pruszków prezentować jawnie jako miejscowość w okolicy, bez obietnicy dojazdu do konkretnej dzielnicy.
- Ceny, wolne terminy, odpowiedź w określonym czasie i szczegóły umowy wymagają potwierdzenia u wykonawcy. Katalog nie zawiera tych danych.
- Budżet i termin podany przez użytkownika opisują jego potrzeby; nie potwierdzają dopasowania ofert pod tym względem.
- Link otwiera źródłowy profil. Demo nie składa zapytania ofertowego ani nie kontaktuje się z wykonawcami.
- Usługi w opisie są deklaracjami profilu. Nie przypisywać wykonawcy certyfikatów, ubezpieczenia, gwarancji, dostępności ani statusu „zweryfikowany” na podstawie samej obecności w katalogu.

## Proponowany scenariusz

Hipoteza projektowa: osoba remontująca łazienkę opisuje efekt, który chce osiągnąć, zamiast znać nazwy usług. Przykładowy brief: „Mam łazienkę 5 m² na Mokotowie. Chcę zamienić wannę na prysznic, wymienić płytki i instalację. Budżet to 25 tys. zł, najlepiej w listopadzie”. To fikcyjny brief demonstracyjny, a nie zgłoszenie istniejącego klienta.

Asystent zbiera lokalizację i zakres, pyta w razie potrzeby o stan obecnej łazienki, a potem wskazuje profile z odpowiednim zakresem prac i linkami do Oferteo. Wyjaśnia np., że Mistrz Łazienek deklaruje demontaż, instalacje i hydroizolację, a ARTEX remont łazienki oraz przeróbki instalacji. Budżet i listopadowy termin ujmuje jako elementy briefu do indywidualnej wyceny, bez sugerowania potwierdzonej ceny lub dostępności.
