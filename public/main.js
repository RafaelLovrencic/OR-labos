let igre = [];
let filtrirano = igre; 

async function initTablice() {
    const res = await fetch("/api/igre");
    igre = await res.json();
    prikaziTablicu(igre);
}

function prikaziTablicu(tablica) {
    const tbody = document.querySelector('#igre-tablica tbody');
    tbody.innerHTML = '';

    const heading = document.createElement('tr');
    heading.innerHTML = `
        <th>Naziv</th>
        <th>Godina</th>
        <th>Veličina (KB)</th>
        <th>Žanr</th>
        <th>Broj igrača</th>
        <th>Regija</th>
        <th>Izdavač</th>
        <th>Spremanje</th>
        <th>CRC</th>
        <th>Varijante</th>
        <th>Platforma</th>
    `;
    tbody.appendChild(heading);

    tablica.forEach(igra => {
        const row = document.createElement('tr');

        let varijanteHTML = '';
        if (Array.isArray(igra.varijante) && igra.varijante.length > 0) {
            varijanteHTML = `
                <table class="varijante-tablica">
                    <tr>
                        <th>Regija</th>
                        <th>Godina</th>
                    </tr>
                    ${igra.varijante.map(v => `
                        <tr>
                            <td>${v.regija || ''}</td>
                            <td>${v.godina || ''}</td>
                        </tr>
    `).join('')}
                </table>
            `;
        }

        row.innerHTML = `
            <td>${igra.naziv || ''}</td>
            <td>${igra.godina || ''}</td>
            <td>${igra.velicina_KB || ''}</td>
            <td>${igra.zanr || ''}</td>
            <td>${igra.broj_igraca || ''}</td>
            <td>${igra.regija || ''}</td>
            <td>${igra.izdavac || ''}</td>
            <td>${igra.spremanje ? 'DA' : 'NE'}</td>
            <td>${igra.CRC || ''}</td>
            <td>${varijanteHTML}</td>
            <td>${igra.platforma || ''}</td>
        `;

        tbody.appendChild(row);
    });
}

function filtriraj() {
    const forma = document.getElementById("filter-forma");
    const formData = new FormData(forma);

    const vrijednostRaw = (formData.get("param") || "").toString().trim();
    const vrijednost = vrijednostRaw.toLowerCase();
    const kategorija = formData.get("cats");

    const keyMap = {
        "Naziv": "naziv",
        "Godina": "godina",
        "Velicina": "velicina_KB",
        "Velicina_KB": "velicina_KB",
        "Zanr": "zanr",
        "Žanr": "zanr",
        "Broj_igraca": "broj_igraca",
        "Broj_igrača": "broj_igraca",
        "Regija": "regija",
        "Izdavac": "izdavac",
        "Izdavač": "izdavac",
        "Spremanje": "spremanje",
        "CRC": "CRC",
        "Varijante": "varijante",
        "Platforma": "platforma",
        "Wildcard": null
    };

    if (!vrijednost) {
        filtrirano = igre;
        prikaziTablicu(filtrirano);
        return;
    }

    const key = keyMap[kategorija] !== undefined ? keyMap[kategorija] : null;

    function parseBoolFromString(s) {
        if (s === null || s === undefined)
            return null;

        const t = s.toString().trim().toLowerCase();
        if (["da", "yes", "true", "1"].includes(t))
            return true;
        if (["ne", "no", "false", "0"].includes(t))
            return false;

        return null;
    }

    if (kategorija === "Wildcard") {
        filtrirano = igre.filter(igra => {
            return Object.values(igra).some(v => {
                if (v === null || v === undefined)
                    return false;

                if (typeof v === "object") {
                    try {
                        return JSON.stringify(v).toLowerCase().includes(vrijednost);
                    } catch {
                        return false;
                    }
                }

                return String(v).toLowerCase().includes(vrijednost);
            });
        });

        prikaziTablicu(filtrirano);
        return;
    }

    if (key === "varijante") {
        filtrirano = igre.filter(igra => {
            const vs = igra.varijante;
            if (!Array.isArray(vs) || vs.length === 0) return false;
            return vs.some(v => {
                return Object.values(v).some(x => {
                    if (x === null || x === undefined) return false;
                    return String(x).toLowerCase().includes(vrijednost);
                });
            });
        });

    prikaziTablicu(filtrirano);
    return;
    }

    if (key === "spremanje") {
        const boolVal = parseBoolFromString(vrijednostRaw);
        if (boolVal !== null) {
            filtrirano = igre.filter(igra => Boolean(igra.spremanje) === boolVal);
        } else {
            filtrirano = igre.filter(igra => String(igra.spremanje).toLowerCase().includes(vrijednost));
        }

        prikaziTablicu(filtrirano);
        return;
    }

    filtrirano = igre.filter(igra => {
        const val = igra[key];
        
        if (val === null || val === undefined)
            return false;

        if (typeof val === "object") {
            try {
                return JSON.stringify(val).toLowerCase().includes(vrijednost);
            } catch {
                return false;
            }
        }

        return String(val).toLowerCase().includes(vrijednost);
    });

    prikaziTablicu(filtrirano);
}

function resetTablice() {
    filtrirano = igre;
    const forma = document.getElementById("filter-forma");
    forma.querySelector('input[name="param"]').value = '';

    prikaziTablicu(igre);
}

async function spremiFiltrirano(format) {
    const res = await fetch('/filter-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, data: filtrirano })
    });

    const resp = await res.json();
    const stat = resp.stat;

    if (stat === "succ") {
        const notif = document.createElement("div");
        notif.textContent = "Uspješno spremljeno!";
        notif.className = "floating-notif";
        document.body.appendChild(notif);

        setTimeout(() => notif.classList.add("show"), 50);

        setTimeout(() => {
            notif.classList.remove("show");
            setTimeout(() => notif.remove(), 500);
        }, 3000);
    }
}

initTablice();
