import Resizer from "react-image-file-resizer";
import { generateRandom } from "./formatting";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../firebase";

export const resizeFile = (file, width, height) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      width,
      height,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file",
      width,
      height
    );
  });

export async function imageToDataUri(
  base64Str,
  MAX_WIDTH = 450,
  MAX_HEIGHT = 450
) {
  let resized_base64 = await new Promise((resolve) => {
    let img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL()); // this will return base64 image results after resize
    };
  });
  return resized_base64;
}

export async function base64ToFile(base64) {
  const res = await fetch(base64);
  const buf = await res.arrayBuffer();
  const file = new File([buf], `signature?${generateRandom()}.png`, {
    type: "image/png",
  });
  return file;
}

export function removeImageFromFireBase(url) {
  let pictureRef = ref(storage, url);
  //2.
  deleteObject(pictureRef)
    .then(() => {
      console.log("deleted");
    })
    .catch((err) => {
      alert(err);
    });

  return true;
}

export async function urlToBase64(imgUrl) {
  let resized_base64 = await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl + "?not-from-cache-please";

    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
    };
    img.onerror = function () {
      reject("The image could not be loaded.");
    };
  });

  return resized_base64;
}
