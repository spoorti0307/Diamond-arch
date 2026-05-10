
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyC6NVccXN8rtR2ME3dv9RoTg-9BeaxWbaFZg4frCEn0HzHRs_0kwwA5MOghvEtz-woeA/exec";


// ===============================
// PLOT SLIDER (UNCHANGED)
// ===============================
const plots = [
    {img:"Plot1.jpeg", price:"₹24,00,000 (40R)", location:"Kanand village<br>Velle taluka<br>Pune"},
    {img:"Plot2.jpeg", price:"₹16,00,000 (20R)", location:"Kanand village<br>Velle taluka<br>Pune"},
    {img:"Plot3.jpeg", price:"₹9,00,000 (11R)", location:"Kanand village<br>Velle taluka<br>Pune"},
    {img:"Plot4.jpeg", price:"₹24,00,000 (40R)", location:"Kanand village<br>Velle taluka<br>Pune"},
    {img:"Plot5.jpeg", price:"₹16,00,000 (20R)", location:"Kanand village<br>Velle taluka<br>Pune"}
];

let index = 0;

function updatePlot(){
    document.getElementById("plotImage").src = plots[index].img;
    document.getElementById("plotPrice").innerHTML = plots[index].price;
    document.getElementById("plotLocation").innerHTML = plots[index].location;
}

function nextPlot(){
    index = (index + 1) % plots.length;
    updatePlot();
}

function prevPlot(){
    index = (index - 1 + plots.length) % plots.length;
    updatePlot();
}

function showMsg(el, text, type="info", timeout=2000){
    el.className = "form-msg " + type;
    el.textContent = text;
    if(timeout){
        setTimeout(() => el.textContent = "", timeout);
    }
}


document.getElementById("bookingForm").addEventListener("submit", function(e){
    e.preventDefault();

    const btn = this.querySelector("button");
    const msg = document.getElementById("successMsg");

    // ✅ Instant UI feedback
    btn.disabled = true;
    btn.innerText = "Submitted ✔";
    msg.innerText = "✅ Booking successful!";

    // send request in background (no waiting)
    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
            type: "booking",
            name: this.name.value,
            phone: this.phone.value,
            date: this.date.value,
            message: this.message.value
        })
    });

    this.reset();
});

document.getElementById("popupForm").addEventListener("submit", function(e){
    e.preventDefault();

    const btn = document.getElementById("popupBtn");

    btn.disabled = true;
    btn.innerText = "Submitted ✔";

    // close instantly (no delay)
    document.getElementById("popup").style.display = "none";

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
            type: "popup",
            name: document.getElementById("pname").value,
            phone: document.getElementById("pphone").value,
            email: document.getElementById("pemail").value,
            service: document.getElementById("pservice").value
        })
    });

    this.reset();
});



function submitReview(){

    const name = document.getElementById("rname").value;
    const text = document.getElementById("rtext").value;
    const msg = document.getElementById("reviewMsg");
    const btn = document.getElementById("reviewSubmitBtn");

    if(!name || !text){
        msg.innerText = "Fill all fields";
        return;
    }

    // ✅ instant feedback
    btn.disabled = true;
    btn.innerText = "Submitted ✔";
    msg.innerText = "🙏 Thank you for your response!";

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
            type: "review",
            name: name,
            message: text
        })
    });

    document.getElementById("rname").value = "";
    document.getElementById("rtext").value = "";
}

window.addEventListener("DOMContentLoaded", function(){

    fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {

        const list = document.getElementById("reviewList");
        list.innerHTML = "";

        data.reverse().forEach(row => {

            const div = document.createElement("div");
            div.className = "review-box";

            div.innerHTML = `
                <h4>${row[1]}</h4>
                <p>${row[2]}</p>
            `;

            list.appendChild(div);
        });

    })
    .catch(err => console.error("Error loading reviews:", err));
});


function closePopup(){
    document.getElementById("popup").style.display = "none";
}

// Close when clicking outside popup box
window.addEventListener("click", function(e){

    const popup = document.getElementById("popup");

    if(e.target === popup){
        popup.style.display = "none";
    }
});

// Close popup on ESC key
document.addEventListener("keydown", function(e){

    if(e.key === "Escape"){
        document.getElementById("popup").style.display = "none";
    }
});
