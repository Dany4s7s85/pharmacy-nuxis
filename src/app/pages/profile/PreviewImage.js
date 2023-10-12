import React from "react";

const PreviewImage = ({ file }) => {
  return (
    <div style={{ position: "relative" }}>
      {<img src={file} className="PreviewImageContainer" />}
    </div>
  );
};

export default PreviewImage;
