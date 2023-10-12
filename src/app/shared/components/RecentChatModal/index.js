import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import {
  setRecentConversations,
  setChoosenDetail,
} from "../../../services/chat";
import { useDispatch, useSelector } from "react-redux";
import Badge from "@mui/material/Badge";

const RecentChatModal = ({
  index,
  bottomMargin,
  conversation,
  conversations,
}) => {
  const [getIndex, setIndex] = useState("");
  const { chosenChatDetails } = useSelector((state) => state?.chat);
  const dispatch = useDispatch();

  const handleMiniChatModal = () => {
    let convs = [...conversations];
    convs.splice(index, 1);
    let temp = { ...conversation };
    if (temp?.unreadCount) {
      delete temp.unreadCount;
    }
    dispatch(setChoosenDetail(temp));

    if (
      chosenChatDetails &&
      chosenChatDetails?.product != conversation?.product
    ) {
      convs.push(chosenChatDetails);
    }
    dispatch(setRecentConversations(convs));
  };

  const handleRemoveConversations = () => {
    let convs = [...conversations];
    convs.splice(index, 1);
    dispatch(setRecentConversations(convs));
  };

  return (
    <>
      {/* Mini Dialog Modal */}
      <Box
        className="openChatMiniModal"
        style={{ bottom: index == 0 ? 22 : index == 1 ? 80 : bottomMargin }}
        onMouseEnter={() => setIndex(`${index}`)}
        onMouseLeave={() => setIndex("")}
      >
        <Box sx={{ display: "flex" }}>
          {conversation?.unreadCount && conversation?.unreadCount > 0 ? (
            <Badge
              badgeContent={
                conversation?.unreadCount ? conversation?.unreadCount : ""
              }
              color="error"
            >
              <Avatar
                onClick={() => {
                  handleMiniChatModal();
                }}
                sx={{ width: "50px", height: "50px", cursor: "pointer" }}
                src={conversation?.imageCover}
              />
            </Badge>
          ) : (
            <Avatar
              onClick={() => {
                handleMiniChatModal();
              }}
              sx={{ width: "50px", height: "50px", cursor: "pointer" }}
              src={conversation?.imageCover}
            />
          )}

          {getIndex && getIndex == index && (
            <IconButton
              onClick={() => {
                handleRemoveConversations();
              }}
            >
              <CloseIcon className="closeIcon" />
            </IconButton>
          )}
        </Box>
      </Box>
    </>
  );
};

export default RecentChatModal;
