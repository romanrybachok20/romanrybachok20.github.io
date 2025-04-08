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
            e.stopPropagation();
    
            // Якщо вже є вибрана клітинка — скидаємо її
            if (selectedCell && selectedCell !== cell) {
                let previousAdd = selectedCell.querySelector("button:nth-child(1)");
                let previousCancel = selectedCell.querySelector("button:nth-child(2)");
                let previousImprove = selectedCell.querySelector("button:nth-child(3)");
    
                selectedCell.style.backgroundColor = "";
                previousAdd.style.display = "block";
                previousCancel.style.display = "none";
                previousImprove.style.display = "none";
            }
    
            // Активуємо нову клітинку
            cell.style.backgroundColor = "#ccc";
            addButton.style.display = "none";
            cancelButton.style.display = "";
            improveButton.style.display = "none";
    
            selectedCell = cell;
    
            constructionType.disabled = false;
            document.getElementById("construction").scrollIntoView({ behavior: "smooth" });
        });
    
        cancelButton.addEventListener("click", function (e) {
            e.stopPropagation();
    
            cell.style.backgroundColor = "";
            addButton.style.display = "";
            cancelButton.style.display = "none";
            improveButton.style.display = "none";
            
            // Якщо користувач скасував саме цю клітинку — обнуляємо selectedCell
            if (selectedCell === cell) {
                selectedCell = null;
            }
            constructionType.disabled = true;
        });

    // Додаємо обробник події на кнопку "Покращити"
// Додаємо обробник події на кнопку "Покращити"
improveButton.addEventListener("click", function (e) {
    e.stopPropagation();

    // Викликаємо функцію покращення і перевіряємо результат
    const success = improveObject(cell);

    if (success) {
        // Якщо покращення відбулося — ховаємо кнопки
        improveButton.style.display = "none";
        cancelButton.style.display = "none";
        addButton.style.display = "none";

        // Скидаємо вибір клітинки
        selectedCell = null;
    }
});
}

function improveObject(cell) {
    let img = cell.querySelector("img");

    const selectedObject = constructionType.value;
    const selectedType = document.querySelector('input[name="workers"]:checked')?.value;

    const upgradeResources = resources[selectedObject]?.[selectedType]?.upgrade;

    if (!upgradeResources) {
        alert("Дані про покращення для цього об'єкта відсутні.");
        return false;
    }

    // Перевірка на наявність ресурсів
    for (let material in upgradeResources.materials) {
        if ((materials[material] || 0) < upgradeResources.materials[material]) {
            alert("Недостатньо ресурсів для покращення!");
            return false;
        }
    }

    if ((budget || 0) < upgradeResources.budget) {
        alert("Недостатньо коштів для покращення!");
        return false;
    }

    if ((workers || 0) < upgradeResources.workers) {
        alert("Недостатньо робітників для покращення!");
        return false;
    }

    // Віднімаємо ресурси
    for (let material in upgradeResources.materials) {
        materials[material] -= upgradeResources.materials[material];
    }
    budget -= upgradeResources.budget;
    workers -= upgradeResources.workers;

    updateResourcesTable();

    // Оновлюємо зображення — додаємо "upgrade" в ім'я
    img.src = img.src.replace(/([^/]+)\.png$/, "upgrade$1.png");

    return true; // Повертаємо успіх
}

    /*Додавання об'єкта на клітинку*/
    submitButton.addEventListener("click", function (e) {
        e.preventDefault();
        const selectedObject = constructionType.value;
        const selectedType = document.querySelector('input[name="workers"]:checked')?.value;
        if (!selectedCell || !selectedObject || !selectedType) return;
    
        const selectedResources = resources[selectedObject]?.[selectedType];
        if (!selectedResources) return;
    
        // Перевірка ресурсів
        for (let material in selectedResources.materials) {
            if ((materials[material] || 0) < selectedResources.materials[material]) {
                alert("Недостатньо матеріалів для побудови!");
                return;
            }
        }
    
        if ((budget || 0) < selectedResources.budget) {
            alert("Недостатньо коштів для побудови!");
            return;
        }
    
        if ((workers || 0) < selectedResources.workers) {
            alert("Недостатньо робітників для побудови!");
            return;
        }
    
        // Віднімаємо ресурси
        for (let material in selectedResources.materials) {
            materials[material] -= selectedResources.materials[material];
        }
        budget -= selectedResources.budget;
        workers -= selectedResources.workers;
    
        updateResourcesTable();
    
        // Додаємо зображення, не очищаючи кнопки
        const img = document.createElement("img");
        img.src = `/lab2/images/${selectedObject}${selectedType.replace("type", "")}.png`;
        img.classList.add("map-object");
    
        // Перевіряємо, чи вже є зображення, якщо так — замінюємо
        const existingImg = selectedCell.querySelector("img");
        if (existingImg) {
            selectedCell.replaceChild(img, existingImg);
        } else {
            selectedCell.insertBefore(img, selectedCell.firstChild); // вставляємо перед кнопками
        }
    
        // Показуємо кнопку "Покращити"
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
    
        // Скидаємо активну клітинку
        selectedCell = null;
    
        mapContainer.scrollIntoView({ behavior: "smooth" });
        constructionType.disabled = true;
        formGroupType.style.display = "none";
        imageOptions.style.display = "none";
        resourceInput.parentElement.style.display = "none";
        submitButton.style.display = "none";
    });
    
    
    /*Оновлення таблиці ресурсів*/
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

