import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import JOBDETAILSData from "./status.json";
import { Box, Card, Typography } from "@mui/material";
import "./orderDetailStepper.scss";

const OrderDetailStepper = ({ stateOrder }) => {
  let JOBDETAILS = JOBDETAILSData?.JOBDETAILS;
  const { user } = useSelector((state) => state?.auth);
  const userToken = user?.store?.vaistat_token;

  const [state, setState] = useState({
    pendingObj: undefined,
    acceptedObj: {},
    ownershipObj: {},
    cancelledObj: {},
    returnObj: {},
    transferredObj: {},
    notDeliveredObj: {},
    completedObj: {},
    transferDriverName: "",
    notDeliveredNote: "",
    notDeliveredReason: "",
  });

  useEffect(() => {
    if (stateOrder?.jobId) {
      getSingleJob();
    }
  }, [stateOrder?.jobId]);

  const getSingleJob = async () => {
    const jobDetail = {
      job_id: stateOrder?.jobId,
    };
    try {
      let jobDetails = await axios.post(
        `${process?.env?.REACT_APP_VAISTAT_BASE_URL}/api/v5/jobs/getSingleJob`,
        jobDetail,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      let job_details = jobDetails?.data.result;

      let tempObj = {};
      for (let step of job_details?.stepper_status) {
        if (step.status_type == "1") {
          //pending
          tempObj.pendingObj = step;
        } else if (step.status_type == "2") {
          //accepted
          tempObj.acceptedObj = step;
        } else if (step.status_type == "3") {
          //ownershiped
          tempObj.ownershipObj = step;
        } else if (step.status_type == "4") {
          //cancelled by pharmacy
          tempObj.cancelledObj = step;
        } else if (step.status_type == "6") {
          //cancel and return by driver
          tempObj.returnObj = step;
        } else if (step.status_type == "7") {
          //transferred by driver
          tempObj.transferredObj = step;

          let transferDriver =
            job_details.transferDriver_id[
              job_details.transferDriver_id.length - 1
            ];
          tempObj.transferDriverName = `${transferDriver.fullname}(${transferDriver.username})`;
        } else if (step.status_type == "8") {
          //not delivered
          tempObj.notDeliveredObj = step;
          tempObj.notDeliveredNote = job_details.commentForNotDelivered;
          tempObj.notDeliveredReason = job_details.reasonForNotDelivered;
        } else if (step.status_type == "9") {
          // completed
          tempObj.completedObj = step;
        }
      }

      setState({ ...state, ...tempObj });
    } catch (err) {
      console.log(err);
    }
  };

  function modifyDateTime(str) {
    if (str) {
      const mydate = str.split("T")[0];
      var time = str.split("T")[1];
      var splTime = time.split(":");
      const convert = mydate.split("-");
      //return convert[1] + '/' + convert[2] + '/' + convert[0] + '  ' + splTime[0] + ":" + splTime[1];
      return (
        convert[2] +
        "/" +
        convert[1] +
        "/" +
        convert[0] +
        "  " +
        splTime[0] +
        ":" +
        splTime[1]
      );
    }
  }

  const {
    pendingObj,
    acceptedObj,
    ownershipObj,
    cancelledObj,
    returnObj,
    transferredObj,
    notDeliveredObj,
    completedObj,
    transferDriverName,
    notDeliveredNot,
    notDeliveredReason,
  } = state;

  return (
    stateOrder &&
    stateOrder?.jobId && (
      <Card sx={{ width: "100%" }}>
        <Typography
          variant="h4"
          sx={{
            color: "#101828",
            fontWeight: "500",
            fontSize: "16px",
            marginBottom: "1rem",
          }}
        >
          Delivery Status
        </Typography>

        <Box justifyContent="center" display="flex">
          <div className="row" style={{ width: "100%", margin: "auto" }}>
            <div
              className={`tracking ${
                pendingObj != {} ? "order-tracking completed" : "order-tracking"
              }`}
            >
              <span className="is-complete"></span>
              <p>
                {JOBDETAILS?.pending_status}
                <br />

                {pendingObj != {} && (
                  <span>{modifyDateTime(pendingObj?.dateTime)}</span>
                )}
              </p>
            </div>
            {cancelledObj == {} && (
              <div
                className={`tracking ${
                  acceptedObj != {}
                    ? "order-tracking completed"
                    : "order-tracking"
                }`}
              >
                <span className="is-complete"></span>
                <p>
                  {JOBDETAILS?.accepted_status}
                  <br />
                  {acceptedObj != {} && (
                    <span>{modifyDateTime(acceptedObj?.dateTime)}</span>
                  )}
                </p>
              </div>
            )}

            {JSON.stringify(cancelledObj) == "{}" && (
              <div
                className={`tracking ${
                  JSON.stringify(acceptedObj) !== "{}"
                    ? "order-tracking completed"
                    : "order-tracking"
                }`}
              >
                <span className="is-complete"></span>
                <p>
                  {JOBDETAILS?.accepted_status}
                  <br />
                  {JSON.stringify(acceptedObj) !== "{}" &&
                    acceptedObj?.dateTime && (
                      <span>{modifyDateTime(acceptedObj?.dateTime)}</span>
                    )}
                </p>
              </div>
            )}

            {JSON.stringify(cancelledObj) === "{}" && (
              <div
                className={`tracking ${
                  JSON.stringify(ownershipObj) !== "{}"
                    ? "order-tracking completed"
                    : "order-tracking"
                }`}
              >
                <span className="is-complete"></span>
                <p>
                  {JOBDETAILS?.ownership_status}
                  <br />
                  {JSON.stringify(ownershipObj) !== "{}" &&
                    ownershipObj?.dateTime && (
                      <span>{modifyDateTime(ownershipObj?.dateTime)}</span>
                    )}
                </p>
              </div>
            )}

            {JSON.stringify(cancelledObj) !== "{}" && (
              <div
                className={`tracking ${
                  JSON.stringify(cancelledObj) !== "{}"
                    ? "order-tracking completed"
                    : "order-tracking"
                }`}
              >
                <span className="is-complete"></span>
                <p>
                  {JOBDETAILS?.cancelled_by_pharmacy_status}
                  <br />
                  {JSON.stringify(cancelledObj) !== "{}" &&
                    cancelledObj?.dateTime && (
                      <span>{modifyDateTime(cancelledObj?.dateTime)}</span>
                    )}
                </p>
              </div>
            )}

            {JSON.stringify(returnObj) !== "{}" && (
              <div
                className={`tracking ${
                  JSON.stringify(returnObj) !== "{}"
                    ? "order-tracking completed"
                    : "order-tracking"
                }`}
              >
                <span className="is-complete"></span>
                <p>
                  {JOBDETAILS?.cancelled_by_driver_status}
                  <br />
                  {JSON.stringify(returnObj) !== "{}" &&
                    returnObj?.dateTime && (
                      <span>{modifyDateTime(returnObj?.dateTime)}</span>
                    )}
                </p>
              </div>
            )}

            {JSON.stringify(notDeliveredObj) !== "{}" && (
              <div
                className={`tracking ${
                  JSON.stringify(notDeliveredObj) !== "{}"
                    ? "order-tracking completed"
                    : "order-tracking"
                }`}
              >
                <span className="is-complete"></span>
                {JSON.stringify(notDeliveredObj) !== "{}" &&
                  notDeliveredObj?.dateTime && (
                    <p>
                      {JOBDETAILS?.not_delivered_status}
                      <br />
                      <span>{modifyDateTime(notDeliveredObj?.dateTime)}</span>
                    </p>
                  )}
              </div>
            )}

            {JSON.stringify(cancelledObj) === "{}" &&
              JSON.stringify(notDeliveredObj) === "{}" &&
              JSON.stringify(returnObj) === "{}" && (
                <div
                  className={`tracking ${
                    JSON.stringify(completedObj) !== "{}"
                      ? "order-tracking completed"
                      : "order-tracking"
                  }`}
                >
                  <span className="is-complete"></span>
                  <p>
                    {JOBDETAILS?.completed_status}
                    <br />
                    {JSON.stringify(completedObj) !== "{}" &&
                      completedObj?.dateTime && (
                        <span>{modifyDateTime(completedObj?.dateTime)}</span>
                      )}
                  </p>
                </div>
              )}
          </div>
        </Box>
      </Card>
    )
  );
};

export default OrderDetailStepper;
