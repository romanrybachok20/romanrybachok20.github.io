import React, { useEffect, useState } from "react";
import "./MyCity.css";
import Building from "../building/Building";
import Resources from "../resources/Resources";

const MyCity = () => {
  const [materials, setMaterials] = useState({});
  const [resources, setResources] = useState({});
  const [budget, setBudget] = useState(0);
  const [workers, setWorkers] = useState(0);
  const [typeImages, setTypeImages] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedObject, setSelectedObject] = useState("choice");
  const [selectedType, setSelectedType] = useState("");
  const [resourceText, setResourceText] = useState("");
  const [showBuilding, setShowBuilding] = useState(false);  // Додано для відображення компонента Building

  const loadJSON = async () => {
    try {
      const response = await fetch("/data.json");
      const data = await response.json();
      setBudget(data.budget);
      setWorkers(data.workers);
      setMaterials(data.materials);
      setResources(data.resources);
      setTypeImages(data.typeImages);
    } catch (error) {
      console.error("Помилка завантаження JSON:", error);
    }
  };

  useEffect(() => {
    loadJSON();
  }, []);

  const updateResourcesTable = () => {
    // Оновлення таблиці матеріалів, бюджету та кількості робітників
  };

  const handleConstructionChange = (e) => {
    const selectedObject = e.target.value;
    setSelectedObject(selectedObject);
    if (selectedObject !== "choice") {
      // Зміна вибору об'єкта
    }
  };

  const handleRadioChange = (e) => {
    const selectedType = e.target.value;
    setSelectedType(selectedType);

    // Отримуємо ресурси для обраного типу
    const selectedResources = resources[selectedObject]?.[selectedType];
    if (selectedResources) {
      let resourceText = '';
      for (let material in selectedResources.materials) {
        resourceText += `${material}: ${selectedResources.materials[material]}\n`;
      }
      resourceText += `Бюджет: ${selectedResources.budget}\nРобітники: ${selectedResources.workers}`;
      setResourceText(resourceText);
    } else {
      setResourceText("Невідомі ресурси");
    }
  };

  const handleAddButtonClick = () => {
    // Логіка додавання об'єкта (як у вашому JS коді)
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
    setBudget((prevBudget) => prevBudget - requiredBudget);
    setWorkers((prevWorkers) => prevWorkers - requiredWorkers);
    setMaterials({ ...materials }); // Оновлюємо стан матеріалів

    updateResourcesTable(); // Оновлюємо таблицю матеріалів

    // Створюємо об'єкт на карті
    let img = document.createElement("img");
    img.src = `/images/${selectedObject}${selectedType.replace("type", "")}.png`;
    img.classList.add("map-object");
    selectedCell.innerHTML = "";
    selectedCell.appendChild(img);
    setSelectedCell(null); // Скидаємо вибір клітинки

    setShowBuilding(true);  // Показуємо компонент після додавання об'єкта
  };

  const addButton = (cell) => {
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
        setSelectedCell(cell);
        document.getElementById("construction").scrollIntoView({ behavior: "smooth" });
      }
    });
  };

  const improveObject = (cell) => {
    let img = cell.querySelector("img");
    if (!img || img.src.includes("upgrade") || img.src.includes("road")) return;

    const selectedResources = resources[selectedObject]?.[selectedType]?.upgrade;

    if (!selectedResources) {
      alert("Дані про покращення для цього об'єкта відсутні.");
      return;
    }

    for (let material in selectedResources.materials) {
      if ((materials[material] || 0) < selectedResources.materials[material]) {
        alert("Недостатньо ресурсів для покращення!");
        return;
      }
    }

    if ((budget || 0) < selectedResources.budget) {
      alert("Недостатньо коштів для покращення!");
      return;
    }

    if ((workers || 0) < selectedResources.workers) {
      alert("Недостатньо робітників для покращення!");
      return;
    }

    for (let material in selectedResources.materials) {
      materials[material] -= selectedResources.materials[material];
    }
    setBudget((prevBudget) => prevBudget - selectedResources.budget);
    setWorkers((prevWorkers) => prevWorkers - selectedResources.workers);
    setMaterials({ ...materials });

    updateResourcesTable();

    img.src = img.src.replace(/(\w+\.png)/, "upgrade$1");
    cell.querySelector(".add-btn")?.remove();
    setShowBuilding(true);  // Показуємо компонент після покращення об'єкта
  };

  return (
    <div id="city">
      <h1 className="zagolovki">Моє місто</h1>
      <div className="wrapper">
        <div className="map-container"></div>
      </div>
      <Building />
      <Resources />
    </div>
  );
};

export default MyCity;
