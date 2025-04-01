document.addEventListener("DOMContentLoaded", function () {
    const mapContainer = document.querySelector(".map-container");
    const constructionType = document.getElementById("construction-type");
    const submitButton = document.querySelector("button[type='submit']");
    const imageOptions = document.querySelector(".image-options");
    const resourceInput = document.getElementById("needresources");
    const formGroupType = document.querySelector('.form-group:nth-child(2)');
    const radioButtons = document.querySelectorAll('input[name="workers"]');
    const labels = document.querySelectorAll('.image-options label');

    let typeImages = {};
    let selectedCell = null;
    let materials = {}; 
    let resources = {}; 
    let budget;
    let workers;

    function addButton(cell) {
        let img = cell.querySelector("img");
        if (img && (img.src.includes("upgrade") || img.src.includes("road"))) return;

        let addButton = document.createElement("button");
        addButton.textContent = img ? "Покращити" : "Додати";
        addButton.classList.add("add-btn");
        cell.appendChild(addButton);

        addButton.addEventListener("click", function (e) {
            e.stopPropagation();
            if (img) {
                improveObject(cell);
            } else {
                selectedCell = cell;
                document.getElementById("construction").scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    function improveObject(cell) {
        let img = cell.querySelector("img");
        if (!img || img.src.includes("upgrade") || img.src.includes("road")) return;
    
        const selectedObject = constructionType.value;
        const selectedType = document.querySelector('input[name="workers"]:checked')?.value;
        
    
        // Логування для перевірки наявності ресурсів
        console.log("Об'єкт:", selectedObject);
        console.log("Тип:", selectedType);
        console.log("Ресурси для об'єкта:", resources[selectedObject]);
        console.log("Ресурси для типу:", resources[selectedObject]?.[selectedType]);
    
        const upgradeResources = resources[selectedObject]?.[selectedType]?.upgrade;
    
        if (!upgradeResources) {
            alert("Дані про покращення для цього об'єкта відсутні.");
            return;
        }
    
        for (let material in upgradeResources.materials) {
            if ((materials[material] || 0) < upgradeResources.materials[material]) {
                alert("Недостатньо ресурсів для покращення!");
                return;
            }
        }
    
        if ((budget || 0) < upgradeResources.budget) {
            alert("Недостатньо коштів для покращення!");
            return;
        }
    
        if ((workers || 0) < upgradeResources.workers) {
            alert("Недостатньо робітників для покращення!");
            return;
        }
    
        for (let material in upgradeResources.materials) {
            materials[material] -= upgradeResources.materials[material];
        }
        budget -= upgradeResources.budget;
        workers -= upgradeResources.workers;
    
        updateResourcesTable();
    
        img.src = img.src.replace(/(\w+\.png)/, "upgrade$1");
        cell.querySelector(".add-btn")?.remove();
    }

    for (let i = 0; i < 10000; i++) {
        let cell = document.createElement("div");
        cell.classList.add("map-cell");
        cell.addEventListener("mouseenter", () => addButton(cell));
        cell.addEventListener("mouseleave", () => cell.querySelector(".add-btn")?.remove());
        mapContainer.appendChild(cell);
    }

    submitButton.addEventListener("click", function (e) {
        e.preventDefault();
        const selectedObject = constructionType.value;
        const selectedType = document.querySelector('input[name="workers"]:checked')?.value;
        if (!selectedCell || !selectedObject || !selectedType) return;
    
        const selectedResources = resources[selectedObject]?.[selectedType];
        if (!selectedResources) return;
    
        // Перевірка на наявність достатніх матеріалів
        for (let material in selectedResources.materials) {
            if ((materials[material] || 0) < selectedResources.materials[material]) {
                alert("Недостатньо матеріалів для побудови!");
                return;
            }
        }
    
        // Перевірка на наявність достатнього бюджету
        const requiredBudget = selectedResources.budget;
        if ((budget || 0) < requiredBudget) {
            alert("Недостатньо коштів для побудови!");
            return;
        }
    
        // Перевірка на наявність достатньої кількості робітників
        const requiredWorkers = selectedResources.workers;
        if ((workers || 0) < requiredWorkers) {
            alert("Недостатньо робітників для побудови!");
            return;
        }
    
        // Віднімаємо матеріали, бюджет та робітників
        for (let material in selectedResources.materials) {
            materials[material] -= selectedResources.materials[material];
        }
        budget -= requiredBudget;
        workers -= requiredWorkers;
    
        updateResourcesTable(); // Оновлюємо таблицю матеріалів
    
        // Створюємо об'єкт на карті
        let img = document.createElement("img");
        img.src = `/lab2/images/${selectedObject}${selectedType.replace("type", "")}.png`;
        img.classList.add("map-object");
        selectedCell.innerHTML = "";
        selectedCell.appendChild(img);
        selectedCell = null;
        mapContainer.scrollIntoView({ behavior: "smooth" });
    });
    
    function updateResourcesTable() {
        // Оновлення таблиці матеріалів
        const materialsTableBody = document.getElementById("materials-table-body");
        materialsTableBody.innerHTML = "";
        Object.entries(materials).forEach(([material, amount]) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${material}</td><td>${amount.toLocaleString()}</td>`;
            materialsTableBody.appendChild(row);
        });
    
        // Оновлення бюджету
        document.getElementById("budget").textContent = budget.toLocaleString();
    
        // Оновлення кількості робітників
        document.getElementById("workers-count").textContent = workers.toLocaleString();
    }
    

    async function loadJSON() {
        try {
            const response = await fetch("data.json");
            const data = await response.json();
    
            // Оновлення бюджету
            document.getElementById("budget").textContent = data.budget.toLocaleString();
            document.getElementById("workers-count").textContent = data.workers.toLocaleString();
            // Збереження даних
            materials = data.materials;
            resources = data.resources;
            budget = data.budget;
            workers = data.workers;
            typeImages = data.typeImages;
    
            // Оновлення таблиці матеріалів
            updateResourcesTable();

        } catch (error) {
            console.error("Помилка завантаження JSON:", error);
        }
    }
    
    // Викликаємо завантаження JSON перед використанням
    loadJSON();

    // Спочатку ховаємо все, крім вибору об'єкта
    formGroupType.style.display = "none";
    imageOptions.style.display = "none";
    resourceInput.parentElement.style.display = "none";
    submitButton.style.display = "none";

    // Оновлення доступних типів об'єкта
    function updateTypeOptions(selectedObject) {
        // Якщо об'єкт не обрано, ховаємо блоки
        if (!typeImages[selectedObject]) {
            formGroupType.style.display = "none";
            imageOptions.style.display = "none";
            return;
        }

        // Показуємо вибір типу
        formGroupType.style.display = "block";
        imageOptions.style.display = "block";

        // Оновлюємо картинки та радіокнопки
        labels.forEach((label, index) => {
            const img = label.querySelector("img");
            const radio = label.querySelector("input");

            if (typeImages[selectedObject][index]) {
                img.src = typeImages[selectedObject][index];
                radio.value = `type${index + 1}`;
                label.style.display = "inline-block";
            } else {
                label.style.display = "none";
            }
        });

        // Ховаємо ресурси та кнопку
        resourceInput.parentElement.style.display = "none";
        submitButton.style.display = "none";
    }

    // Коли змінюється вибір об’єкта
    constructionType.addEventListener("change", function () {
        const selectedObject = constructionType.value;

        // Якщо вибрано "Вибрати" - ховаємо все
        if (selectedObject === "choice") {
            formGroupType.style.display = "none";
            imageOptions.style.display = "none";
            resourceInput.parentElement.style.display = "none";
            submitButton.style.display = "none";
            return;
        }

        updateTypeOptions(selectedObject);
    });

    // Коли змінюється вибір типу
    radioButtons.forEach(input => {
        input.addEventListener("change", function () {
            const selectedObject = constructionType.value;
            const selectedType = this.value;
    
            // Перевіряємо, чи є ресурси для цього типу
            if (resources[selectedObject] && resources[selectedObject][selectedType]) {
                const selectedResources = resources[selectedObject][selectedType];
    
                // Форматуємо ресурси у вигляді багаторядкового тексту
                let resourceText = '';
                for (let material in selectedResources.materials) {
                    resourceText += `${material}: ${selectedResources.materials[material]}\n`;
                }
                resourceText += `Бюджет: ${selectedResources.budget}\nРобітники: ${selectedResources.workers}`;
    
                resourceInput.value = resourceText;
                resourceInput.parentElement.style.display = "block";
                submitButton.style.display = "block"; // Показуємо кнопку
            } else {
                resourceInput.value = "Невідомі ресурси";
            }
        });
    });
});

