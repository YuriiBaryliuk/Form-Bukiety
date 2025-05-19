listaObjektow = [];
class Zamowienie {
    constructor(image, bukiet, ilosc, adres, dodatki, kwota) {
        this.image = image;
        this.bukiet = bukiet;
        this.ilosc = ilosc;
        this.adres = adres;
        this.dodatki = dodatki;
        this.kwota = kwota;
    }

    get getImage() { return this.image; }
    get getBukiet() { return this.bukiet; }
    get getIlosc() { return this.ilosc; }
    get getAdres() { return this.adres; }
    get getDodatki() { return this.dodatki; }
    get getKwota() { return this.kwota; }
}

// Dla liczb bukietow
const amount = document.getElementById("amount");
const number = document.getElementById("number");

// Dla nazw bukietów i kwoty
const selection = document.getElementById("selection");
let kwota = document.getElementById("kwota");

// Dla checkbox dodatkowych usług
const checkboxDostawaAdres = document.getElementById("checkboxDostawaAdres");
const checkboxDekoracja = document.getElementById("checkboxDekoracja");

updateKwota();

// Selection update
selection.addEventListener("click", () => {
    updateKwota();
})

// Amount update
amount.addEventListener("click", () => {
    number.value = amount.value;
    updateKwota();
});

// Dla sprawdzenia czy wartosc input ilosc bukietow nie jest wieksza za 100
number.addEventListener("change", function (event) {
    updateKwota();
    amount.value = number.value;
    if (number.value > 100) {
        event.preventDefault();
        number.style = "border: 2px solid red";
        number.setCustomValidity("Można zamówić do 100 bukietów");
    }
});



//------------------------------------------------------------------------------
// Główna funkcja submitu
document.getElementById("myForm").addEventListener("submit", function (event) {
    let isValid = true;

    const imie = document.getElementById("imie");
    const nazwisko = document.getElementById("nazwisko");
    const telefon = document.getElementById("telefon");
    const email = document.getElementById("email");

    if (!regexCheck(imie, nazwisko, telefon, email)) {
        event.preventDefault();
        isValid = false;
    }

    if (checkboxDostawaAdres.checked && !inputDostawaAdres) {
        event.preventDefault();
        inputRedBorder(inputDostawaAdres);
        inputDostawaAdres.setCustomValidity("Wpisz Adres");
        isValid = false;
    }

    if (!dostawaDlaMnie.checked) {
        if (!regexCheck(dostawaImie, dostawaNazwisko, dostawaTelefon, dostawaEmail)) {
            event.preventDefault();
            isValid = false;
        }
    }
    if (isValid)
        window.open("animation.html", "_blank"); //animacja z https://www.geeksforgeeks.org/pulsing-heart-animation-effect-using-html-css/
});
//------------------------------------------------------------------------------


//-------Funkcje dla dodatkowych uslug------------------------------------------

// Dla checkbox pytania czy dodac dodatkowe uslugi
document.getElementById("czyDodatkoweUslugi").addEventListener("change", () => {
    dodatkowe.style = "display: block;"
})

// Głowna obliczjąca kwotę
const dodatkowe = document.getElementById("dodatkowe");
dodatkowe.addEventListener("click", () => {
    updateKwota();
});

// Dostawa --> uzupelnic dane
checkboxDostawaAdres.addEventListener("change", () => {
    document.getElementById("dostawaInformacje").hidden = false;

    const dostawaImie = document.getElementById("dostawaImie");
    const dostawaNazwisko = document.getElementById("dostawaNazwisko");
    const dostawaTelefon = document.getElementById("dostawaTelefon");
    const dostawaEmail = document.getElementById("dostawaEmail");
    const dostawaAdres = document.getElementById("inputDostawaAdres");

    dostawaImie.value = imie.value;
    dostawaNazwisko.value = nazwisko.value;
    dostawaTelefon.value = telefon.value;
    dostawaEmail.value = email.value;
});

// Dostawa: Inny adres
const dostawaDlaMnie = document.getElementById("dostawaDlaMnie");
dostawaDlaMnie.addEventListener("change", () => {
    dostawaImie.value = "";
    dostawaImie.disabled = false;
    dostawaNazwisko.value = "";
    dostawaNazwisko.disabled = false;
    dostawaTelefon.value = "";
    dostawaTelefon.disabled = false;
    dostawaEmail.value = "";
    dostawaEmail.disabled = false;
});

// Dekoracja --> pokazac tresc
checkboxDekoracja.addEventListener("change", () => {
    document.getElementById("inputDekoracja").hidden = false;

    const brokat = document.getElementById("brokat");
    const wstazki = document.getElementById("wstazki");
    const sznurki = document.getElementById("sznurki");
    const tkaniny = document.getElementById("tkaniny");
});

// Uwagi --> pokazać treść
document.getElementById("checkboxUwagi").addEventListener("change", () => {
    document.getElementById("inputUwagi").hidden = false;
});

// Dodać object i info zamówienia
document.getElementById("dodajBtn").addEventListener("click", function (event) {
    event.preventDefault();
    const uslugiDodatkowe = document.getElementById("uslugiDodatkowe");

    const object = new Zamowienie(
        chooseImage(),
        chooseName(),
        number.value,
        uslugiDodatkowe.checked ? (checkboxDostawaAdres.checked ? "dostawa na adres" : "odbiór w sklepie") : "-",
        uslugiDodatkowe.checked ? (checkboxDekoracja.checked ? chooseDodatki() : "-") : "-",
        kwota.value
    );
    listaObjektow.push(object);
    console.log(object.getAdres);
    createTable(object);
});


// Funkcja pomocnicza dla RED border
function inputRedBorder(element) {
    element.style = "border: 2px solid red";
}

// Update Kwota
function updateKwota() {
    currentKwota = kwota.value;
    currentKwota = Number(number.value * selection.value);

    // Dostawa
    if (checkboxDostawaAdres.checked) {
        currentKwota += Number(checkboxDostawaAdres.value);
    }

    // Dodatkowa dekoracja
    // 1. Brokat
    if (brokat.checked) {
        currentKwota += Number(brokat.value);
    }
    // 2. Wstążki
    if (wstazki.checked) {
        currentKwota += Number(wstazki.value);
    }
    // 3. Sznurki jutowe
    if (sznurki.checked) {
        currentKwota += Number(sznurki.value);
    }
    // 4. Tkaniny ozdobne
    if (tkaniny.checked) {
        currentKwota += Number(tkaniny.value);
    }

    kwota.value = currentKwota;
}

// Regex check
function regexCheck(regexImie, regexNazwisko, regexTelefon, regexEmail) {
    const imieNazwiskoRegex = /^[A-Za-zĄąĆćĘęŁłÓóŚśŻżŹź]+$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const telefonRegex = /^[0-9]{9,15}$/;

    if (!regexImie.value || !regexNazwisko.value || !regexTelefon.value || !regexEmail.value) {
        inputRedBorder(regexImie); inputRedBorder(regexNazwisko); inputRedBorder(regexTelefon); inputRedBorder(regexEmail);
        alert("Uzupełnij wszystkie pola");
        return 0;
    }

    if (!imieNazwiskoRegex.test(regexImie.value)) {
        inputRedBorder(regexImie);
        regexImie.setCustomValidity("Wpisz poprane imię");
        return 0;
    }

    if (!imieNazwiskoRegex.test(regexNazwisko.value)) {
        inputRedBorder(regexNazwisko);
        regexNazwisko.setCustomValidity("Wpisz poprane nazwisko");
        return 0;
    }

    if (!telefonRegex.test(regexTelefon.value)) {
        inputRedBorder(regexTelefon);
        regexTelefon.setCustomValidity("Wpisz poprany telefon");
        return 0;
    }

    if (!emailRegex.test(regexEmail.value)) {
        inputRedBorder(regexEmail);
        regexEmail.setCustomValidity("Wpisz poprany email");
        return 0;
    }
    return 1;
}

// Wybór rysunku dla informacji
function chooseImage() {
    if (selection.value > 45) {
        const imgRozany = new Image();
        imgRozany.src = "https://sklep.cebulekwiatowe.pl/hpeciai/56a1d5df2da48a58c0dd0ed15ae07a32/pol_pl_Jaskier-Ranunculus-Rozowy-5-szt-690_1.jpg";
        imgRozany.style = "width: 100px; height: 100px";
        return imgRozany;
    }
    else if (selection.value < 45) {
        const imgChryzantemy = new Image();
        imgChryzantemy.src = "https://kwiatynacmentarz.pl/wp-content/uploads/2024/06/IMG_1547.jpg";
        imgChryzantemy.style = "width: 100px; height: 100px";
        return imgChryzantemy;
    }
    else {
        const imgLilak = new Image();
        imgLilak.src = "https://i.wpimg.pl/648x0/portal-parenting.wpcdn.pl/imageCache/2019/05/10/26625426-m_7cbd.jpg";
        imgLilak.style = "width: 100px; height: 100px";
        return imgLilak;
    }
}

// Wybór nazwy bukietu dla informacji
function chooseName() {
    if (selection.value > 45)
        return "Różowe różany";
    else if (selection.value < 45)
        return "Bordowe chryzantemy";
    else
        return "Biały lilak";
}

// Przechowywanie dodatków
function chooseDodatki() {
    let temp = [];

    if (brokat.checked) {
        temp.push("brokat");
    }
    // 2. Wstążki
    if (wstazki.checked) {
        temp.push("wstążki");
    }
    // 3. Sznurki jutowe
    if (sznurki.checked) {
        temp.push("Sznurki jutowe");
    }
    // 4. Tkaniny ozdobne
    if (tkaniny.checked) {
        temp.push("Tkaniny ozdobne");
    }

    return temp;
}

// Create structure (table) with info
function createTable(object) {
    if (!listaObjektow.length)
        return;
    tempItems = [object.getImage, object.getBukiet, object.getIlosc, object.getAdres, object.getDodatki, object.getKwota];
    oznaczenia = ["", "Nazwa: ", "Ilość: ", "Adres: ", "Dodatki: ", "Kwota: "];

    const tableRow = document.createElement("tr");
    tableRow.style = "border: 2px solid black";
    for (let i = 0; i < tempItems.length; i++) {
        const tableData = document.createElement("td");
        tableData.append(oznaczenia[i], tempItems[i]);
        tableRow.appendChild(tableData);
    }
    
    document.getElementById("koszykTable").appendChild(tableRow);
}