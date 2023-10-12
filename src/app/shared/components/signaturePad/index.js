import React, { useRef, useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { Grid, ButtonGroup, IconButton, Button, Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import ClearIcon from "@mui/icons-material/Clear";
import SignaturePad from "react-signature-canvas";
import {
  deleteObject,
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import "./style.scss";
import BrushIcon from "@mui/icons-material/Brush";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/Upload";
import {
  base64ToFile,
  imageToDataUri,
  resizeFile,
} from "../../../helpers/imageResizer";
import { storage } from "../../../firebase";
import { ClipLoader } from "react-spinners";
export default function SignaturePadModal({
  setShowSigPad,
  showSigPad,
  props,
}) {
  const sigCanvas = useRef(null);
  const [showUpload, setShowUpload] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = React.useState("");
  const [value, setValue] = React.useState("");
  const [drawLoading, setDrawLoading] = useState(false);
  const sigRef = useRef(null);

  const revokeImageURL = () => {
    if (imageURL) {
      URL.revokeObjectURL(imageURL);
      setImageURL(undefined);
    }
  };

  useEffect(() => revokeImageURL, []);

  useEffect(() => {
    if (value && imageURL && sigCanvas?.current) {
      sigCanvas?.current?.fromDataURL(value);
    }
  }, [showUpload]);

  const readImage = (file) => {
    const reader = new FileReader();
    const onLoad = () => {
      // setValue(reader.result)

      setValue(reader.result);

      reader.removeEventListener("load", onLoad);
    };
    reader.addEventListener("load", onLoad);
    reader.readAsDataURL(file);
  };

  const onFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      readImage(file);
      revokeImageURL();
      setImageURL(URL.createObjectURL(file));
    }
  };

  const onClear = () => {
    setImageURL(undefined);
    sigCanvas?.current?.clear();
    setValue("");
    revokeImageURL();
  };

  const save = async () => {
    setLoading(true);
    let uri = await imageToDataUri(value);

    let file = await base64ToFile(uri);

    if (!file) return;

    const storageRef = ref(
      storage,
      `member/signatures/${file.name}-${Date.now()}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        setLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setLoading(false);

          props.setFieldValue("signature", downloadURL);
          setShowSigPad(false);
        });
      }
    );
  };

  return (
    <>
      <Modal
        open={showSigPad}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          borderRadius: "11px",
          overflow: "hidden",
        }}
      >
        <Box
          className="modal-mui"
          style={{
            borderRadius: "11px",
            overflow: "hidden",
          }}
        >
          <Box className="modal-header-mui">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Signature Pad
            </Typography>
            <IconButton
              className="modal-clear-btn"
              onClick={() => {
                setShowSigPad(false);
              }}
            >
              <ClearIcon />
            </IconButton>
            <Divider style={{ borderColor: "#ccc" }} />
          </Box>
          <Box className="modal-content-mui" style={{ padding: 0 }}>
            <Box
              sx={{ width: "100%", maxWidth: "500px" }}
              className="signature-pad-container"
            >
              <div className="signature-pad-header">
                {showUpload ? (
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    sx={{ gridGap: "4px", color: "#fff" }}
                  >
                    Upload your signature :
                    <Button
                      onClick={() => sigRef.current.click()}
                      my={3}
                      className="outlined-white"
                      variant="outlined"
                    >
                      Browser Image
                    </Button>
                  </Box>
                ) : (
                  <Typography color="#fff">Draw Your Signature</Typography>
                )}

                <ButtonGroup
                  disableElevation
                  aria-label="Disabled elevation buttons"
                >
                  <Button
                    startIcon={<BrushIcon />}
                    variant="contained"
                    className="containedWhite"
                    color="info"
                    disabled={!showUpload}
                    onClick={() => setShowUpload(!showUpload)}
                  >
                    Draw
                  </Button>
                  <Button
                    startIcon={<UploadIcon />}
                    variant="contained"
                    className="containedWhite"
                    color="info"
                    disabled={showUpload}
                    onClick={() => setShowUpload(!showUpload)}
                  >
                    Upload
                  </Button>
                </ButtonGroup>
              </div>
              <div className="signature-pad-body">
                {!showUpload && (
                  <SignaturePad
                    // minWidth={0.5}
                    // maxWidth={0.5}
                    // minDistance={3}
                    onBegin={() => setDrawLoading(true)}
                    onEnd={() => {
                      setDrawLoading(false);
                      setValue(
                        sigCanvas?.current
                          ?.getTrimmedCanvas()
                          ?.toDataURL("image/png")
                      );
                    }}
                    // onChange={onChange}  // onChange={onChange}  // onChange={onChange}  // onChange={onChange}  // onChange={onChange}  // onChange={onChange}
                    ref={sigCanvas}
                    // backgroundColor={"white"}
                    clearOnResize={false}
                    canvasProps={{
                      className: "signaturePad",
                    }}
                  />
                )}

                {showUpload && (
                  <>
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => onFileSelect(e)}
                      ref={sigRef}
                    />

                    {imageURL ? (
                      <img
                        width="735px"
                        height="300px"
                        src={imageURL}
                        alt="KendoReact Signature uploaded image"
                        title="Uploaded signature"
                        draggable="false"
                      />
                    ) : (
                      <Typography>
                        Please, browse an image to preview here.
                      </Typography>
                    )}
                  </>
                )}

                {drawLoading == false && !showUpload && value ? (
                  <IconButton
                    aria-label="delete"
                    className="signature-clear"
                    onClick={onClear}
                  >
                    <CancelIcon style={{ color: "#000" }} />
                  </IconButton>
                ) : (
                  <>
                    {drawLoading == false && imageURL ? (
                      <>
                        <IconButton
                          aria-label="delete"
                          className="signature-clear"
                          onClick={onClear}
                        >
                          <CancelIcon style={{ color: "#000" }} />
                        </IconButton>
                      </>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </div>
              <div className="signature-pad-footer">
                <Button
                  disabled={!value || loading}
                  onClick={save}
                  variant="contained"
                  className="containedWhite"
                  startIcon={<SaveIcon />}
                >
                  {loading ? (
                    <ClipLoader size={25} color="white" loading />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  onClick={onClear}
                  className="outlined-white"
                  variant="outlined"
                >
                  Clear
                </Button>
              </div>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
