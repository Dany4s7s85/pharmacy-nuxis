import React, { useState } from 'react';

const PreviewImage = ({ file }) => {
  return (
    <div className="image-preview">
      <img src={file} sx={{ width: '100%' }} />
    </div>
  );
};

export default PreviewImage;
