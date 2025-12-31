const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const checkBtn = document.getElementById("checkBtn");
const loadingText = document.getElementById("loadingText");
const result = document.getElementById("result");
const plantName = document.getElementById("plantName");
const progressBar = document.getElementById("progressBar");
const healthText = document.getElementById("healthText");
const languageSelect = document.getElementById("languageSelect");

/* Image preview */
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
        previewImage.src = URL.createObjectURL(file);
        previewImage.style.display = "block";
    }
});

/* REAL PlantNet analysis */
checkBtn.addEventListener("click", async () => {
    const file = imageInput.files[0];
    if (!file) {
        alert("Please upload an image first");
        return;
    }

    loadingText.style.display = "block";
    result.style.display = "none";

    try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("http://localhost:3000/analyze", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        loadingText.style.display = "none";
        result.style.display = "block";

        if (!data.results || data.results.length === 0) {
            plantName.innerText = "No disease detected";
            healthText.innerText = "Plant looks healthy 🌿";
            progressBar.style.width = "100%";
            progressBar.style.background = "green";
            return;
        }

        const top = data.results[0];
        const confidence = Math.round(top.score * 100);
        const health = 100 - confidence;

        plantName.innerText = top.description;
        progressBar.style.width = health + "%";

        if (health > 70) {
            progressBar.style.background = "green";
            healthText.innerText = `Healthy (${health}%) 🌿`;
        } else if (health > 30) {
            progressBar.style.background = "orange";
            healthText.innerText = `Moderate issue (${health}%) ⚠️`;
        } else {
            progressBar.style.background = "red";
            healthText.innerText = `Severe disease (${health}%) 🚨`;
        }

    } catch (err) {
        loadingText.style.display = "none";
        alert("Error analyzing image");
    }
});

/* Language switch */
languageSelect.addEventListener("change", () => {
    if (languageSelect.value === "hi") {
        checkBtn.innerText = "पौधे की जांच करें";
    } else if (languageSelect.value === "gu") {
        checkBtn.innerText = "છોડની તપાસ કરો";
    } else {
        checkBtn.innerText = "Check Plant Health";
    }
});
