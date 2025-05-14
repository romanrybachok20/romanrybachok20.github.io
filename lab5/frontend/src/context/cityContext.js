import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const CityContext = createContext();
export const useCity = () => useContext(CityContext);

export const CityProvider = ({ children }) => {
  const [cells, setCells] = useState([]);
  const [budget, setBudget] = useState();
  const [materials, setMaterials] = useState({});
  const [workers, setWorkers] = useState();
  const [typeImages, setTypeImages] = useState({});
  const [resources, setResources] = useState({});

  const generateInitialCells = () => {
    return Array.from({ length: 10000 }, (_, index) => ({
      id: index,
      isSelected: false,
      hasObject: false,
      isImproved: false,
      objectImage: '',
    }));
  };

  const loadMetaResources = async () => {
    if (Object.keys(resources).length > 0) return;

    try {
      const [imagesRes, needRes] = await Promise.all([
        fetch('http://localhost:5001/api/ubm/images_links'),
        fetch('http://localhost:5001/api/ubm/need_resources'),
      ]);

      const [imagesData, needData] = await Promise.all([
        imagesRes.json(),
        needRes.json(),
      ]);

      setTypeImages(imagesData);
      setResources(needData);

      localStorage.setItem('resources', JSON.stringify({
        resources: needData,
      }));
    } catch (error) {
      console.error('Помилка при завантаженні мета-ресурсів з бекенду:', error);
    }
  };

  const loadUserCityFromBackend = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/userCities/${userId}`);
      if (!response.ok) throw new Error("User not found");

      const data = await response.json();
      const baseCells = generateInitialCells();
      const changedCells = data.changedCells || [];

      changedCells.forEach(({ id, ...rest }) => {
        Object.assign(baseCells[id], rest);
      });

      setCells(baseCells);

      if (data.budget !== undefined) setBudget(data.budget);
      if (data.materials !== undefined) setMaterials(data.materials);
      if (data.workers !== undefined) setWorkers(data.workers);

    } catch (error) {
      console.error("Помилка при завантаженні міста користувача з бекенду:", error);
      setCells(generateInitialCells());
    } finally {
    await loadMetaResources();
    }
  };

  const updateResources = (newMaterials, newBudget, newWorkers) => {
    setMaterials(newMaterials);
    setBudget(newBudget);
    setWorkers(newWorkers);
  };

  const updateCells = (newCells) => {
    setCells(newCells);
    sessionStorage.setItem('cells', JSON.stringify(newCells));
  };

  const getCellsWithObjects = (allCells) => {
    return allCells.filter(cell => cell.hasObject);
  };

  const saveUserCityToBackend = async (userId, cityData) => {
    try {
      const response = await fetch(`http://localhost:5001/api/userCities/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          changedCells: getCellsWithObjects(cityData.cells),
          budget: cityData.budget,
          materials: cityData.materials,
          workers: cityData.workers,
          lastUpdated: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to save user data");

      console.log("Дані збережено через backend.");
    } catch (error) {
      console.error("Помилка при збереженні через backend:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadUserCityFromBackend(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    if (budget == null || materials == null || workers == null) return;

    const timeout = setTimeout(() => {
      saveUserCityToBackend(user.uid, {
        cells,
        budget,
        materials,
        workers,
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [cells, budget, materials, workers]);

  return (
    <CityContext.Provider
      value={{
        cells,
        budget,
        materials,
        workers,
        typeImages,
        resources,
        updateCells,
        updateResources,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};
