let igre = [];
let filtrirano = igre; 

async function initTablice() {
    const res = await fetch("/api/v1/igre");
    igre = await res.json();
    igre = igre.response;
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

async function filtriraj() {
    const forma = document.getElementById("filter-forma");
    const formData = new FormData(forma);

    const raw = (formData.get("param") || "").toString().trim();
    const value = raw.toLowerCase();
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

    const key = keyMap[kategorija] || null;

    const body = {
        key,
        value
    };

    const res = await fetch("/filter", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });

    filtrirano = await res.json();
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

    if (!res.ok) {
        alert("Greška pri preuzimanju datoteke!");
        return;
    }

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = format === "CSV" ? 'filtrirano.csv' : 'filtrirano.json';

    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

    const notif = document.createElement("div");
    notif.textContent = "Uspješno preuzeto!";
    notif.className = "floating-notif";
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add("show"), 50);

    setTimeout(() => {
        notif.classList.remove("show");
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}

initTablice();
