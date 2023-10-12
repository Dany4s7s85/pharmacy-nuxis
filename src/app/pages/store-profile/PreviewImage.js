import React from "react";
import avatar from "../../assets/images/avatar.png";
const PreviewImage = ({ file }) => {
  return (
    <div>
      {file == undefined ? (
        <img src={avatar} style={{ width: "335px" }} />
      ) : (
        <img src={file} width="335px" />
      )}
    </div>
  );
};

export default PreviewImage;
