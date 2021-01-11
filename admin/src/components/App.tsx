import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ImageContext, ModalContext, ReviewContext } from '../context';
import { InitialImage, InitialReview } from '../utils/Const';
import { TypeImage, TypeReview } from '../utils/Type';

import PageTemplate from './PageTemplate';

function App() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [review, setReview] = useState<TypeReview>(InitialReview);
  const [image, setImage] = useState<TypeImage>(InitialImage);

  return (
    <div className="App">
      <BrowserRouter>
        <ModalContext.Provider value={{
          isModalOpen: isModalOpen,
          setModalOpen: (isOpen: boolean) => setModalOpen(isOpen)}}>     
        <ReviewContext.Provider value={{
          review: review,
          setReview: (review: TypeReview) => setReview(review)}}>
        <ImageContext.Provider value={{
          image: image,
          setImage: (image: TypeImage) => setImage(image)}}>
           
            <PageTemplate/> 

        </ImageContext.Provider>
        </ReviewContext.Provider>
        </ModalContext.Provider> 
      </BrowserRouter>
    </div>
  );
}

export default App;
