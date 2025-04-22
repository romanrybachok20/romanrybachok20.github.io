import React, { createContext, useState, useContext, useEffect } from 'react';

const CityContext = createContext();

export const useCity = () => {
  return useContext(CityContext);
};

export const CityProvider = ({ children }) => {
  const [cells, setCells] = useState([]); 
  const [budget, setBudget] = useState();
  const [materials, setMaterials] = useState({}); 
  const [workers, setWorkers] = useState();
  const [typeImages, setTypeImages] = useState({});
  const [resources, setResources] = useState({});

  useEffect(() => {
    const loadResources = async () => {
      try {
        const response = await fetch('data.json');
        const data = await response.json();

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
    sessionStorage.removeItem('cells');

    const savedCells = sessionStorage.getItem('cells');
    if (savedCells) {
      setCells(JSON.parse(savedCells));  // Перетворюємо рядок JSON в масив об'єктів
    } else {
      const initialCells = Array.from({ length: 10000 }, (_, index) => ({
        id: index,
        isSelected: false,
        hasObject: false,
        isImproved: false,
        objectImage: '',
      }));
      updateCells(initialCells); 
    }
  }, []);

  const updateCells = (newCells) => {
    setCells(newCells);
    sessionStorage.setItem('cells', JSON.stringify(newCells)); 
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
