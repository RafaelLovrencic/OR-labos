async function exportAll() {
    try {
        var igre = await fetch('/api/v1/igre');
        igre = await igre.json();
        igre = igre.response;
        
        var format = 'CSV';
        var res = await fetch('/filter-export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ format: 'CSV', data: igre })
        });
        if (!res.ok) {
            alert("Greška pri preuzimanju datoteke!");
            return;
        }
        var blob = await res.blob();

        var url = window.URL.createObjectURL(blob);

        var a = document.createElement('a');
        a.href = url;
        a.download = format === "CSV" ? 'gameboy-igre.csv' : 'gameboy-igre.json';

        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);

        format = 'JSON';
        var res = await fetch('/filter-export', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ format: 'JSON', data: igre })
        });
        if (!res.ok) {
            alert("Greška pri preuzimanju datoteke!");
            return;
        }
        var blob = await res.blob();

        var url = window.URL.createObjectURL(blob);

        var a = document.createElement('a');
        a.href = url;
        a.download = format === "CSV" ? 'gameboy-igre.csv' : 'gameboy-igre.json';

        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);

    } catch (err) {
        console.log("Greška pri osvježavanju preslika");
    }
}

async function generateHeaderButton() {
    try {
        const res = await fetch('/get-auth-status');
        var authStatus = await res.json();
        authStatus = authStatus.status;
        
        const header = document.getElementById('text-center');
        
        var button = document.createElement('a');
        button.href = authStatus ? '/profile' : '/login';
        button.textContent = authStatus ? 'PROFIL' : 'PRIJAVA';
        button.setAttribute('id', 'api-button');
        
        header.appendChild(button);
    } catch (err) {
        console.log("Problem kod dohvaćanja statusa autorizacije", err);
    }
}

async function generateBodyButton() {
    try {
        const res = await fetch('/get-auth-status');
        var authStatus = await res.json();
        authStatus = authStatus.status;
        
        if (authStatus) {
            const buttonSpace = document.getElementById('all-buttons');

            var button = document.createElement('div');
            button.className = 'buttons';
            button.innerHTML = `<button onclick='exportAll()'>Osvježi preslike</button>`;
            buttonSpace.appendChild(button);
        }
    } catch (err) {
        console.log("Problem kod generiranja gumba za osvježavanje preslika");
    }
}

generateHeaderButton();
generateBodyButton();