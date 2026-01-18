async function writeProfileDetails() {
    const htmlBody = document.body;
    try {
        const res = await fetch('/user-data');

        if (res.status === 401) {
            document.getElementById('user-info').textContent =
                "Niste prijavljeni.";
            return;
        }

        const user = await res.json();
        
        const userData = document.createElement('div');
        userData.style.display = 'flex';
        userData.style.flexDirection = 'column';
        userData.style.alignItems = 'center';
        userData.style.justifyContent = 'center';
        userData.innerHTML = '';
        atribs = ["name", "nickname", "email"];
        for (const [ind, atrib] of atribs.entries()) {
            let alts = ["Korisničko ime:", "Nadimak:", "Email:"];
            let data = document.createElement('p');
            data.innerHTML = `${alts[ind]} ${user[atrib]}`;
            data.style.fontSize = '3vh';
            userData.appendChild(data);
        };
        htmlBody.appendChild(userData);
        
        const logoutButton = document.createElement('div');
        logoutButton.className = 'buttons';
        logoutButton.innerHTML = "<a href='/logout'>Odjava</a>";
        htmlBody.appendChild(logoutButton);

    } catch (err) {
        document.getElementById('user-info').textContent = "Greška pri dohvaćanju korisničkih podataka.";
    }
}

writeProfileDetails();