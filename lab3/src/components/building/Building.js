import React, { useState } from "react";
import "./Building.css";
import { useCity } from "../../context/cityContext";

const Building = ({ isFormEnabled, selectedCell, setIsFormEnabled, setSelectedCell }) => {
  const [selectedObjectType, setSelectedObjectType] = useState("choice");
  const [selectedType, setSelectedType] = useState("");
  const [availableImages, setAvailableImages] = useState([]);
  const [resourceText, setResourceText] = useState("");

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

    const res = resources[selectedObjectType]?.[type];
    if (res) {
      const { materials, budget, workers } = res;
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
      return;
    }

    const selectedResources = resources[selectedObjectType][selectedType];
    const hasEnoughMaterials = Object.entries(selectedResources.materials).every(
      ([name, amount]) => materials[name] !== undefined && materials[name] >= amount
    );

    if (!hasEnoughMaterials) {
      return;
    }

    if (budget < selectedResources.budget) {
      return;
    }

    if (workers < selectedResources.workers) {
      return;
    }

    const updatedMaterials = { ...materials };
    Object.entries(selectedResources.materials).forEach(([name, amount]) => {
      updatedMaterials[name] -= amount;
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
    <div id="construction">
      <h1 className="zagolovki">Будівництво</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="construction-type">Виберіть об'єкт для побудови:</label>
          <select
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
            <textarea id="needresources" rows="5" readOnly value={resourceText} />
          </div>
        )}

        {resourceText && (
          <button type="submit">Додати об'єкт</button>
        )}
      </form>
    </div>
  );
};

export default Building;
