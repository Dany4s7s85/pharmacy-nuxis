import React, { useState } from 'react';

const PreviewProductImage = ({ imgUrl }) => {
  return (
    <div className="image-preview">
      <img src={imgUrl} sx={{ width: '100%' }} />
    </div>
  );
};

export default PreviewProductImage;
