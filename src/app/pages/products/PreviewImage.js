import React from "react";

const PreviewProductImage = ({ imgUrl }) => {
  return (
    <div className="image-preview">
      <img src={imgUrl} />
    </div>
  );
};

export default PreviewProductImage;
