import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebase/firebase'

const db = getFirestore(app); // Ініціалізація Firestore

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

  // Функція для отримання даних з Firestore
  const loadResources = async () => {
    try {
      const totalCityResourcesRef = doc(db, "UBMdatabase", "total_city_resources");
      const imagesLinksRef = doc(db, "UBMdatabase", "images_links");
      const needResourcesRef = doc(db, "UBMdatabase", "need_resources");
  
      const totalCityResourcesSnap = await getDoc(totalCityResourcesRef);
      const imagesLinksSnap = await getDoc(imagesLinksRef);
      const needResourcesSnap = await getDoc(needResourcesRef);
  
      if (totalCityResourcesSnap.exists() && imagesLinksSnap.exists() && needResourcesSnap.exists()) {
        const totalCityData = totalCityResourcesSnap.data();
        const imagesData = imagesLinksSnap.data();
        const resourcesData = needResourcesSnap.data();
  
        console.log("Завантажені зображення:", imagesData);
        console.log("Ключі typeImages:", Object.keys(imagesData)); // Лог для перевірки ключів


        setBudget(totalCityData.budget);
        setMaterials(totalCityData.materials);
        setWorkers(totalCityData.workers);
        setTypeImages(imagesData);
        setResources(resourcesData);
      } else {
        console.log("Документи не знайдено");
      }
    } catch (error) {
      console.error('Помилка при завантаженні даних з Firestore:', error);
    }
  };  

  useEffect(() => {
    loadResources(); // Завантажуємо дані з Firestore під час завантаження компонента
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
