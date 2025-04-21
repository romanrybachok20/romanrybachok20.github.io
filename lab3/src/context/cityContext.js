import React, { createContext, useState, useContext, useEffect } from 'react';

const CityContext = createContext();

export const useCity = () => {
  return useContext(CityContext);
};

export const CityProvider = ({ children }) => {
  const [cells, setCells] = useState([]); // Стан для клітинок
  const [budget, setBudget] = useState(); // Початковий бюджет
  const [materials, setMaterials] = useState({}); // Початкові матеріали
  const [workers, setWorkers] = useState(); // Початкова кількість робітників
  const [typeImages, setTypeImages] = useState({}); // Початкові зображення типів
  const [resources, setResources] = useState({}); // Початкові ресурси

  useEffect(() => {
    const loadResources = async () => {
      try {
        const response = await fetch('data.json');
        const data = await response.json();

        // Завантажуємо дані в глобальні змінні
        setBudget(data.budget);
        setMaterials(data.materials);
        setWorkers(data.workers);
        setTypeImages(data.typeImages);
        setResources(data.resources);

      } catch (error) {
        console.error('Помилка при завантаженні data.json:', error);
      }
    };

    loadResources();
  }, []);

  const updateResources = (newMaterials, newBudget, newWorkers) => {
    setMaterials(newMaterials);
    setBudget(newBudget);
    setWorkers(newWorkers);
  };

  useEffect(() => {
    // Очищаємо sessionStorage при перезавантаженні сторінки
    sessionStorage.removeItem('cells');

    const savedCells = sessionStorage.getItem('cells');
    if (savedCells) {
      setCells(JSON.parse(savedCells)); // Завантажуємо клітинки з sessionStorage
    } else {
      // Ініціалізація порожніх клітинок
      const initialCells = Array.from({ length: 10000 }, (_, index) => ({
        id: index,
        isSelected: false,
        hasObject: false,
        isImproved: false,
        objectImage: '',
      }));
      updateCells(initialCells); // збереження в sessionStorage
    }
  }, []);

  const updateCells = (newCells) => {
    setCells(newCells);
    sessionStorage.setItem('cells', JSON.stringify(newCells));  // Зберігаємо стан клітинок у sessionStorage
  };

  return (
    <CityContext.Provider value={{
      cells,
      budget,
      materials,
      workers,
      typeImages,
      resources,
      updateCells,
      updateResources,
    }}>
      {children}
    </CityContext.Provider>
  );
};
