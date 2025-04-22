import React, { useEffect, useState } from "react";
import "./MyCity.css";
import { useLocation } from "react-router-dom";
import { useCity } from '../../context/cityContext';

const MyCity = () => {
  const location = useLocation();
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedObjectType, setSelectedObjectType] = useState("choice");
  const [selectedType, setSelectedType] = useState("");
  const [availableImages, setAvailableImages] = useState([]);
  const [resourceText, setResourceText] = useState("");
  const [isFormEnabled, setIsFormEnabled] = useState(false);

  const {
    budget,
    materials,
    workers,
    resources,
    typeImages,
    cells,
    updateCells,
    updateResources,
  } = useCity();

  useEffect(() => {
    if (location.hash === "#construction") {
      const el = document.getElementById("construction");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const handleAddClick = (index) => {
    const updated = cells.map((cell, i) => {
      if (i === index) {
        return { ...cell, isSelected: true };
      }
      return { ...cell, isSelected: false };
    });

    updateCells(updated);
    setSelectedCell(index);
    setIsFormEnabled(true);

    setTimeout(() => {
      const el = document.getElementById("construction");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  const handleCancelClick = (index) => {
    const updated = cells.map((cell, i) => {
      if (i === index) {
        return { ...cell, isSelected: false };
      }
      return cell;
    });

    updateCells(updated);
    setIsFormEnabled(false);
    setSelectedObjectType("choice");
    setSelectedType("");
    setAvailableImages([]); 
    setResourceText("");

    if (selectedCell === index) {
      setSelectedCell(null);
    }
  };

  const handleImproveClick = (index) => {
    const cell = cells[index];
  
    if (!cell.hasObject) {
      alert("На цій клітинці немає об'єкта для покращення!");
      return;
    }
  
    const match = cell.objectImage.match(/\/images\/(\w+)\.png/);
    const baseImageName = match ? match[1] : null;
  
    if (!baseImageName) {
      alert("Не вдалося визначити базове зображення об'єкта.");
      return;
    }
  
    if (baseImageName.startsWith("upgrade")) {
      alert("Цей об'єкт уже покращено!");
      return;
    }
  
    const objectTypeMatch = baseImageName.match(/^([a-zA-Z]+)/);
    const selectedObjectType = objectTypeMatch ? objectTypeMatch[1] : null;
  
    const typeNumberMatch = baseImageName.match(/\d+/);
    const selectedType = typeNumberMatch ? `type${typeNumberMatch[0]}` : null;
  
    if (!selectedObjectType || !selectedType) {
      alert("Не вдалося визначити тип об'єкта.");
      return;
    }
  
    const upgradeResources = resources[selectedObjectType]?.[selectedType];
  
    if (!upgradeResources) {
      alert("Немає ресурсів для покращення цього об'єкта.");
      return;
    }
  
    const hasEnoughMaterials = Object.entries(upgradeResources.materials).every(
      ([name, amount]) => {
        const materialAmount = materials[name];
        return materialAmount !== undefined && materialAmount >= amount;
      }
    );
  
    if (!hasEnoughMaterials) {
      alert("Недостатньо матеріалів для покращення!");
      return;
    }
  
    if (budget < upgradeResources.budget) {
      alert("Недостатньо коштів для покращення!");
      return;
    }
  
    if (workers < upgradeResources.workers) {
      alert("Недостатньо робітників для покращення!");
      return;
    }
  
    const updatedMaterials = { ...materials };
    Object.entries(upgradeResources.materials).forEach(([name, amount]) => {
      updatedMaterials[name] -= amount;
    });
  
    updateResources(
      updatedMaterials,
      budget - upgradeResources.budget,
      workers - upgradeResources.workers
    );
  
    const upgradedImage = `/images/upgrade${baseImageName}.png`;
  
    const updatedCells = cells.map((c, i) => {
      if (i === index) {
        return {
          ...c,
          objectImage: upgradedImage,
          isImproved: true,
        };
      }
      return c;
    });
  
    updateCells(updatedCells);
  };
  
  const handleObjectTypeChange = (e) => {
    const value = e.target.value;
    setSelectedObjectType(value);
    setSelectedType("");
    setResourceText("");
  
    if (typeImages[value]) {
      setAvailableImages(typeImages[value]);
    } else {
      setAvailableImages([]);
    }
  };

  const handleImageTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
  
    if (
      resources[selectedObjectType] &&
      resources[selectedObjectType][type]
    ) {
      const { materials, budget, workers } =
        resources[selectedObjectType][type];
  
      let resText = Object.entries(materials)
        .map(([mat, val]) => `${mat}: ${val}`)
        .join("\n");
      resText += `\nБюджет: ${budget}\nРобітники: ${workers}`;
  
      setResourceText(resText);
    } else {
      setResourceText("Невідомі ресурси");
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (
      selectedCell === null ||
      selectedObjectType === "choice" ||
      !selectedType ||
      !resources[selectedObjectType]?.[selectedType]
    ) {
      alert("Виберіть об'єкт, тип і клітинку!");
      return;
    }
  
    const selectedResources = resources[selectedObjectType][selectedType];
  
    const hasEnoughMaterials = Object.entries(selectedResources.materials).every(
      ([name, amount]) => {
        const materialAmount = materials[name];
        console.log(`Матеріал: ${name}, необхідно: ${amount}, доступно: ${materialAmount}`);
        if (materialAmount !== undefined) {
          return materialAmount >= amount;
        } else {
          console.error("Матеріал не знайдений у ресурсах:", name);
          return false;
        }
      }
    );
  
    if (!hasEnoughMaterials) {
      alert("Недостатньо матеріалів для побудови!");
      return;
    }
  
    if (budget < selectedResources.budget) {
      alert("Недостатньо коштів для побудови!");
      return;
    }

    if (workers < selectedResources.workers) {
      alert("Недостатньо робітників для побудови!");
      return;
    }
  
    const updatedMaterials = { ...materials };
    Object.entries(selectedResources.materials).forEach(([name, amount]) => {
      if (updatedMaterials[name] !== undefined) {
        updatedMaterials[name] -= amount;
      }
    });
  
    updateResources(updatedMaterials, budget - selectedResources.budget, workers - selectedResources.workers);
  
    const updatedCells = cells.map((cell, i) => {
      if (i === selectedCell) {
        return {
          ...cell,
          hasObject: true,
          isSelected: false,
          objectImage: `/images/${selectedObjectType}${selectedType.replace("type", "")}.png`,
        };
      }
      return cell;
    });
  
    updateCells(updatedCells);
    setSelectedCell(null);
    setIsFormEnabled(false);
    setSelectedObjectType("choice");
    setSelectedType("");
    setAvailableImages([]); 
    setResourceText("");

    setTimeout(() => {
      const el = document.getElementById("city");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };
  
  
  return (
    <div id="city">
      <h1 className="zagolovki">Моє місто</h1>
      <div className="wrapper">
        <div className="map-container">
          {cells.map((cell, index) => (
            <div
              key={index}
              className="map-cell"
              style={{
                backgroundColor: cell.isSelected ? "#ccc" : "",
              }}
            >
              {cell.hasObject && cell.objectImage && (
                <img src={cell.objectImage} alt="Об'єкт" className="map-object" />
              )}

              {/* Кнопка "Додати" */}
              {!cell.isSelected && !cell.hasObject && !cell.isImproved && (
                <button
                  className="cell-btn"
                  onClick={() => handleAddClick(index)}
                >
                  Додати
                </button>
              )}

              {/* Кнопка "Скасувати" */}
              {cell.isSelected && !cell.hasObject && !cell.isImproved && (
                <button
                  className="cell-btn"
                  onClick={() => handleCancelClick(index)}
                >
                  Скасувати
                </button>
              )}

              {/* Кнопка "Покращити" */}
              {cell.hasObject && !cell.isImproved && cell.objectImage && !cell.objectImage.includes("road") && (
                <button
                className="cell-btn"
                onClick={() => handleImproveClick(index)}
              >
                Покращити
                </button>
              )}
            </div>
          ))}
        </div>
      </div> 
      <div id="construction">
        <h1 className="zagolovki">Будівництво</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="construction-type">Виберіть об'єкт для побудови:</label>
            <select
              name="construction-type"
              id="construction-type"
              disabled={!isFormEnabled}
              value={selectedObjectType}
              onChange={handleObjectTypeChange}
            >
              <option value="choice">Вибрати</option>
              <option value="house">Будинок</option>
              <option value="institution">Установа</option>
              <option value="road">Дорога</option>
            </select>
          </div>

          {availableImages.length > 0 && (
            <div className="form-group">
              <label>Виберіть тип:</label>
              <div className="image-options">
                {availableImages.map((src, index) => (
                  <label key={index}>
                    <input
                      type="radio"
                      name="type"
                      value={`type${index + 1}`}
                      checked={selectedType === `type${index + 1}`}
                      onChange={handleImageTypeChange}
                    />
                    <img src={src} alt={`Тип ${index + 1}`} />
                  </label>
                ))}
              </div>
            </div>
          )}

          {resourceText && (
            <div className="form-group">
              <label htmlFor="needresources">Необхідні ресурси:</label>
              <textarea
                id="needresources"
                rows="5"
                readOnly
                value={resourceText}
              />
            </div>
          )}

          {resourceText && (
            <button type="submit">Додати об'єкт</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MyCity;
