import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase/firebase';

const db = getFirestore(app);
const auth = getAuth(app);

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

  const loadResources = async () => {
    try {
      const totalCityResourcesRef = doc(db, "UBMdatabase", "total_city_resources");
      const imagesLinksRef = doc(db, "UBMdatabase", "images_links");
      const needResourcesRef = doc(db, "UBMdatabase", "need_resources");

      const [totalSnap, imagesSnap, needSnap] = await Promise.all([ // Виконуємо всі запити паралельно
        getDoc(totalCityResourcesRef),
        getDoc(imagesLinksRef),
        getDoc(needResourcesRef),
      ]);

      if (totalSnap.exists() && imagesSnap.exists() && needSnap.exists()) {
        const totalCityData = totalSnap.data();
        setBudget(totalCityData.budget);
        setMaterials(totalCityData.materials);
        setWorkers(totalCityData.workers);
        setTypeImages(imagesSnap.data());
        setResources(needSnap.data());
      }
    } catch (error) {
      console.error('Помилка при завантаженні ресурсів з Firestore:', error);
    }
  };

  const loadUserCityFromFirestore = async (userId) => {
    try {
      const docRef = doc(db, "userCities", userId);
      const docSnap = await getDoc(docRef);

      const baseCells = generateInitialCells();

      if (docSnap.exists()) {
        const data = docSnap.data();
        const changedCells = data.changedCells || [];

        changedCells.forEach(({ id, ...rest }) => {
          Object.assign(baseCells[id], rest);
        });

        setCells(baseCells);
        setBudget(data.budget);
        setMaterials(data.materials);
        setWorkers(data.workers);
      } else {
        setCells(baseCells);
      }
    } catch (error) {
      console.error("Помилка при завантаженні користувацьких даних:", error);
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

  const saveUserCityToFirestore = async (userId, cityData) => {
    try {
      await setDoc(doc(db, "userCities", userId), {
        changedCells: getCellsWithObjects(cityData.cells),
        budget: cityData.budget,
        materials: cityData.materials,
        workers: cityData.workers,
        lastUpdated: new Date().toISOString(),
      });
      console.log("Дані збережено в Firestore (тільки клітинки з hasObject).");
    } catch (error) {
      console.error("Помилка при збереженні даних:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadResources();
        loadUserCityFromFirestore(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const timeout = setTimeout(() => {
      saveUserCityToFirestore(user.uid, {
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
