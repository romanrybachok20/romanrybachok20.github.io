let typeImages = {};
let selectedCell = null;
let materials = {}; 
let resources = {}; 
let budget;
let workers;

async function loadJSON() {
    try {
        const response = await fetch("data.json"); 
        const data = await response.json(); 

        materials = data.materials; 
        resources = data.resources;
        budget = data.budget;
        workers = data.workers;
        typeImages = data.typeImages;

        updateResourcesTable();

    } catch (error) {
        console.error("Помилка завантаження JSON:", error);
    }
}

function updateResourcesTable() {

    const materialsTableBody = document.getElementById("materials-table-body");
    materialsTableBody.innerHTML = ""; // Очищення таблиці
    Object.entries(materials).forEach(([material, amount]) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${material}</td><td>${amount.toLocaleString()}</td>`;
        materialsTableBody.appendChild(row); // Додаємо рядок до таблиці
    });
    
    document.getElementById("budget").textContent = budget.toLocaleString();
    
    document.getElementById("workers-count").textContent = workers.toLocaleString();
    }


document.addEventListener("DOMContentLoaded", function () {
    const mapContainer = document.querySelector(".map-container");
    const constructionType = document.getElementById("construction-type");
    const submitButton = document.querySelector("button[type='submit']");
    const imageOptions = document.querySelector(".image-options");
    const resourceInput = document.getElementById("needresources");
    const formGroupType = document.querySelector('.form-group:nth-child(2)');
    const radioButtons = document.querySelectorAll('input[name="workers"]');
    const labels = document.querySelectorAll('.image-options label');

    for (let i = 0; i < 10000; i++) {
        let cell = document.createElement("div");
        cell.classList.add("map-cell");
    
        let addButton = document.createElement("button");
        addButton.textContent = "Додати";
        addButton.classList.add("cell-btn");
    
        let cancelButton = document.createElement("button");
        cancelButton.textContent = "Скасувати";
        cancelButton.classList.add("cell-btn");
        cancelButton.style.display = "none";
    
        let improveButton = document.createElement("button");
        improveButton.textContent = "Покращити";
        improveButton.classList.add("cell-btn");
        improveButton.style.display = "none";
    
        cell.appendChild(addButton);
        cell.appendChild(cancelButton);
        cell.appendChild(improveButton);
    
        mapContainer.appendChild(cell);

        addButton.addEventListener("click", function (e) {
    
            // Якщо оберемо іншу клітинку, скидаємо попередню
            if (selectedCell && selectedCell !== cell) {
                let previousAdd = selectedCell.querySelector("button:nth-child(1)");
                let previousCancel = selectedCell.querySelector("button:nth-child(2)");
                let previousImprove = selectedCell.querySelector("button:nth-child(3)");
    
                selectedCell.style.backgroundColor = "";
                previousAdd.style.display = "";
                previousCancel.style.display = "none";
                previousImprove.style.display = "none";
            }
    
            cell.style.backgroundColor = "#ccc";
            addButton.style.display = "none";
            cancelButton.style.display = "";
            improveButton.style.display = "none";
    
            selectedCell = cell;
    
            constructionType.disabled = false;
            document.getElementById("construction").scrollIntoView({ behavior: "smooth" });
        });
    
        cancelButton.addEventListener("click", function (e) {
    
            cell.style.backgroundColor = "";
            addButton.style.display = "";
            cancelButton.style.display = "none";
            improveButton.style.display = "none";
            
            if (selectedCell === cell) {
                selectedCell = null;
            }
            constructionType.disabled = true;
        });

        improveButton.addEventListener("click", function (e) {

            const success = improveObject(cell);

            if (success) {

                improveButton.style.display = "none";
                cancelButton.style.display = "none";
                addButton.style.display = "none";

                selectedCell = null;
            }
        });
    }

    function improveObject(cell) {
        let img = cell.querySelector("img");

        const selectedObject = constructionType.value;
        const selectedType = document.querySelector('input[name="workers"]:checked')?.value; // ? - повертає undefined, якщо не знайдено

        const upgradeResources = resources[selectedObject]?.[selectedType]?.upgrade; // ? - повертає undefined, якщо не знайдено

        if (!upgradeResources) {
            alert("Дані про покращення для цього об'єкта відсутні.");
            return false;
        }

        for (let material in upgradeResources.materials) {
            if (materials[material]  < upgradeResources.materials[material]) {
                alert("Недостатньо ресурсів для покращення!");
                return false;
            }
        }

        if (budget < upgradeResources.budget) {
            alert("Недостатньо коштів для покращення!");
            return false;
        }

        if (workers  < upgradeResources.workers) {
            alert("Недостатньо робітників для покращення!");
            return false;
        }

        for (let material in upgradeResources.materials) {
            materials[material] -= upgradeResources.materials[material];
        }
        budget -= upgradeResources.budget;
        workers -= upgradeResources.workers;

        updateResourcesTable();

        img.src = img.src.replace(/([^/]+)\.png$/, "upgrade$1.png");

        return true; 
    }

    submitButton.addEventListener("click", function (e) {
        e.preventDefault(); // Зупиняємо стандартну поведінку кнопки від браузера
        const selectedObject = constructionType.value;
        const selectedType = document.querySelector('input[name="workers"]:checked')?.value; // ? - повертає undefined, якщо не знайдено
        if (!selectedCell || !selectedObject || !selectedType) return;
    
        const selectedResources = resources[selectedObject]?.[selectedType];
        if (!selectedResources) return;
    
        for (let material in selectedResources.materials) {
            if (materials[material] < selectedResources.materials[material]) {
                alert("Недостатньо матеріалів для побудови!");
                return;
            }
        }
    
        if (budget < selectedResources.budget) {
            alert("Недостатньо коштів для побудови!");
            return;
        }
    
        if (workers < selectedResources.workers) {
            alert("Недостатньо робітників для побудови!");
            return;
        }
    
        for (let material in selectedResources.materials) {
            materials[material] -= selectedResources.materials[material];
        }
        budget -= selectedResources.budget;
        workers -= selectedResources.workers;
    
        updateResourcesTable();
    
        const img = document.createElement("img");
        img.src = `/lab2/images/${selectedObject}${selectedType.replace("type", "")}.png`;
        img.classList.add("map-object");
    
        selectedCell.appendChild(img);
    
        const buttons = selectedCell.querySelectorAll("button");
        const addButton = buttons[0];
        const cancelButton = buttons[1];
        const improveButton = buttons[2];
    
        addButton.style.display = "none";
        cancelButton.style.display = "none";
        
        if (selectedObject !== "road") {
            improveButton.style.display = "";
        } else {
            improveButton.style.display = "none";
        }
    
        selectedCell = null;
    
        mapContainer.scrollIntoView({ behavior: "smooth" });
        constructionType.disabled = true;
        formGroupType.style.display = "none";
        imageOptions.style.display = "none";
        resourceInput.parentElement.style.display = "none";
        submitButton.style.display = "none";
    });
    
    loadJSON();

    formGroupType.style.display = "none";
    imageOptions.style.display = "none";
    resourceInput.parentElement.style.display = "none";
    submitButton.style.display = "none";

    function updateTypeOptions(selectedObject) {

        // якщо у обєкті фоток нема вибраного обєкта то не показуємо варіанти зображень
        if (!typeImages[selectedObject]) {
            formGroupType.style.display = "none";
            imageOptions.style.display = "none";
            return;
        }

        formGroupType.style.display = "block";
        imageOptions.style.display = "block";

        labels.forEach((label, index) => {
            const img = label.querySelector("img");
            const radio = label.querySelector("input");

            if (typeImages[selectedObject][index]) {
                img.src = typeImages[selectedObject][index];
                radio.value = `type${index + 1}`;
                label.style.display = "inline-block"; // Показуємо лише ті варіанти, які є у typeImages
            } else {
                label.style.display = "none"; // Сховуємо варіанти, яких немає
            }
        });
    }

    constructionType.addEventListener("change", function () {
        const selectedObject = constructionType.value;

        if (selectedObject === "choice") {
            formGroupType.style.display = "none";
            imageOptions.style.display = "none";
            resourceInput.parentElement.style.display = "none";
            submitButton.style.display = "none";
            return;
        }

        updateTypeOptions(selectedObject);
    });

    radioButtons.forEach(input => {
        input.addEventListener("change", function () {
            const selectedObject = constructionType.value;
            const selectedType = this.value; // Отриання значення поточної вибраної радіо-кнопки

            if (resources[selectedObject][selectedType]) {
                const selectedResources = resources[selectedObject][selectedType];

                let resourceText = '';
                for (let material in selectedResources.materials) {
                    resourceText += `${material}: ${selectedResources.materials[material]}\n`;
                }
                resourceText += `Бюджет: ${selectedResources.budget}\nРобітники: ${selectedResources.workers}`;
    
                resourceInput.value = resourceText;
                resourceInput.parentElement.style.display = "block";
                submitButton.style.display = "block"; 
            } else {
                resourceInput.value = "Невідомі ресурси";
            }
        });
    });
});

