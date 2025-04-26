import React, { useEffect, useState } from "react";
import "./MyCity.css";
import { useLocation } from "react-router-dom";
import { useCity } from '../../context/cityContext';
import Building from "../building/Building";

const MyCity = () => {
  const location = useLocation();
  const [selectedCell, setSelectedCell] = useState(null);
  const [isFormEnabled, setIsFormEnabled] = useState(false);

  const {
    budget,
    materials,
    workers,
    resources,
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
    const updated = cells.map((cell, i) => ({
      ...cell,
      isSelected: i === index,
    }));

    updateCells(updated);
    setSelectedCell(index);
    setIsFormEnabled(true);

    setTimeout(() => {
      const el = document.getElementById("construction");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleCancelClick = (index) => {
    const updated = cells.map((cell, i) => ({
      ...cell,
      isSelected: false,
    }));

    updateCells(updated);
    setIsFormEnabled(false);
    setSelectedCell(null);
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
      ([name, amount]) => materials[name] !== undefined && materials[name] >= amount
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

              {!cell.isSelected && !cell.hasObject && !cell.isImproved && (
                <button
                  className="cell-btn"
                  onClick={() => handleAddClick(index)}
                >
                  Додати
                </button>
              )}

              {cell.isSelected && !cell.hasObject && !cell.isImproved && (
                <button
                  className="cell-btn"
                  onClick={() => handleCancelClick(index)}
                >
                  Скасувати
                </button>
              )}

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
      <Building
        selectedCell={selectedCell}
        setSelectedCell={setSelectedCell}
        isFormEnabled={isFormEnabled}
        setIsFormEnabled={setIsFormEnabled}
      />
    </div>
  );
};

export default MyCity;
