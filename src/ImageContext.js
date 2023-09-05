import { createContext, useContext, useState} from 'react';

const ImageContext = createContext();

export function ImageProvider({children}){
    const [capturedPhotos, setCapturedPhotos] = useState([]);

    return(
        <ImageContext.Provider value={{capturedPhotos, setCapturedPhotos}}>{children}</ImageContext.Provider>
    )
}

export function usePhoto() {
    return useContext(ImageContext);
  }