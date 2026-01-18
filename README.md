# Licencija

## GNU General Public License v3.0

Program se može slobodno koristiti u bilo koju svrhu.

Izvorni kod je dostupan i može se mijenjati prema vlastitim potrebama.

Kopije programa, originalne ili izmijenjene, smiju se slobodno dijeliti, ali uvijek pod istom licencijom (copyleft).

Nije dopušteno pretvaranje GPL koda u vlasnički zatvoreni softver.

Licencija sprječava tehnička ograničenja koja bi onemogućila pokretanje izmijenjenih verzija.

Distribucijom programa pod GPLv3 automatski se daje dozvola za korištenje povezanih patenata, čime se korisnici štite od tužbi.

Zabranjeno je dodavanje mehanizama koji ograničavaju korisnička prava, poput DRM sustava.

Svi projekti koji koriste izvorni kod licenciran pod GNU GLP v3 licencijom, moraju se licencirati u cijelosti pod istom licencijom. Nije moguće izvedene projekte licencirati djelomično.

# Opći podaci

Katalog Game Boy igara otvorena je baza podataka koja sadrži informacije o igrama razvijenima za konzole Game Boy, Game Boy Color i Game Boy Advance. Sadrži podatke o nazivima, godinama izdanja, žanrovima, izdavačima, veličini ROM-ova te mogućnosti spremanja stanja igre. Baza je izrađena u sklopu laboratorijskih vježbi kolegija Otvoreno računarstvo Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu te je dostupna u JSON, CSV i BSON formatima pod GNU GPL v3.0 licencijom.

#### Autor: Rafael Lovrenčić
#### Licencija: GNU GPL v3.0
#### Verzija: v4.0
#### Jezik: hrvatski

##### Ključne riječi: gameboy, videoigre, igre
##### Platforme pokrivene skupom podataka: Game Boy, Game Boy Color, Game Boy Advance
##### Formati podataka: JSON, CSV, BSON
##### Godina izdavanja: 2026.

# Opis baze
#### Naziv: Katalog Game Boy igara
#### Opis: Baza podataka s nazivima i detaljima popularnih igara za igraću konzolu Gameboy iz 1989. i revizije Game Boy Color i Game Boy Advance.

## Atributi

| Atribut     | Opis |
| -------     | ---- |
| naziv       | Službeni naziv videoigre |
| godina      | Godina izdavanja |
| velicina_KB | Veličina igre u KB |
| zanr        | Žanr igre |
| broj_igraca | Maksimalan broj ljudi koji može istovremeno igrati |
| regija      | Regija u kojoj je igra najranije izdana |
| izdavac     | Izdavač igre u regiji gdje je najranije izdana |
| spremanje   | Podržava li igra spremanje stanja (DA - true / NE - false ) |
| CRC         | Zaštitna suma igre za provjeru integriteta ROM-a |
| varijante   | Regionalne varijante iste igre s godinom izdavanja |
| platforma   | Inačica Game Boya za koju je igra dostupna |

# Web aplikacija

Web aplikacija izrađena je kao proširenje prethodne laboratorijske vježbe i omogućuje pregled, filtriranje i preuzimanje podataka iz baze kroz jednostavno i responzivno web sučelje. Cilj aplikacije je povećati pristupačnost i vidljivost skupa podataka putem grafičkog prikaza i strojno čitljivih formata.

### Pokretanje

1. Klonirati repozitorij
    - git clone https://github.com/RafaelLovrencic/OR-labos.git
    - **alternativno** skinuti i raspakirati Release v2.0+
2. napraviti cd u direktorij OR-labos
3. u komandnu liniju upisati ```npm ci```
4. pokrenuti aplikaciju s ```npm start```
5. otvoriti localhost na portu 8080 u web-pregledniku

### Funkcionalnosti

Početna stranica index.html s osnovnim metapodacima o skupu podataka i poveznicama na dostupne formate (CSV i JSON).

Tablični prikaz podataka datatable.html koji dohvaća sadržaj baze podataka asinkrono. 

Filtriranje podataka pomoću jednostavnog HTML obrasca:

- Polje za unos teksta omogućuje pretragu po svim atributima (tzv. wildcard pretraga).

- Padajući izbornik omogućuje sužavanje pretrage na određeni atribut.

- Rezultati se automatski ažuriraju i prikazuju u tablici.

- Preuzimanje trenutnog prikaza u CSV i JSON formatima, uz mogućnost dohvaćanja filtriranih rezultata.

Metapodaci su prikazani u čitljivom obliku na početnoj stranici te u strojno čitljivom obliku putem datoteke schema.json izrađene prema JSON Schema Draft-07 specifikaciji.
