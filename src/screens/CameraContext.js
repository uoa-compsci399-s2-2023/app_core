import React, { createContext, useContext, useState } from 'react';

const CameraContext = createContext();

export const useCameraContext = () => {
  return useContext(CameraContext);
};

export const CameraProvider = ({ children }) => {
  const [photos, setPhotos] = useState([]);

  const addPhoto = (photo) => {
    setPhotos((prevPhotos) => [...prevPhotos, photo]);
  };

  const clearPhotos = () => {
    setPhotos([]);
  };

  return (
    <CameraContext.Provider value={{ photos, addPhoto, clearPhotos }}>
      {children}
    </CameraContext.Provider>
  );
};