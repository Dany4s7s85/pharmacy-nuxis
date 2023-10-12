import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Badge,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useSelector, useDispatch } from "react-redux";
import { getDirectConversationHistory } from "../../../realtimeCommunication/socketConnection";
import { styled, useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import "./conv.scss";
import { getAllConversations, getConversation } from "../../../services/chat";

import {
  setChoosenDetail,
  setCopyChoosenDetail,
  setConversations,
  setRecentConversations,
  setMessages,
  chatBoxOpen,
} from "../../../services/chat";
import ChatModal from "../ChatModal";
import { conversationModifier } from "../../../helpers/common";

const ConversationChatModal = ({
  openChat,
  setOpenChat,
  count,
  setChatCount,
  chatCount,
}) => {
  const dispatch = useDispatch();
  const [emojiPopover, setEmojiPopover] = useState(null);
  const [page, setPage] = useState(1);
  const openEmoji = Boolean(emojiPopover);
  const emojiId = openEmoji ? "simple-popover" : undefined;

  const { user } = useSelector((state) => state?.auth);
  const {
    chatBox,
    conversations,
    conversationCount,
    recent_conversations,
    chosenChatDetails,
    chatBoxCount,
  } = useSelector((state) => state?.chat);
  const [messagesLoader, setMessagesLoader] = useState(false);
  const [convs, setConvs] = useState([]);
  const [messageTotalCount, setMessageTotalCount] = useState(null);
  const [conversationThreads, setConversationThreads] = useState([]);
  const [chatOpenCount, setChatOpenCount] = useState(0);
  const [conversationThreadsMessages, setConversationThreadsMessages] =
    useState([]);

  useEffect(() => {
    // setTimeout(() => {
    setConvs(conversations);
    // }, 100);
  }, [conversations]);

  useEffect(() => {
    if (user && user?._id) {
      dispatch(
        getAllConversations(user?.store?.id, function (res) {
          if (res) {
            setConversationThreads(res?.data?.conversations);

            let tempConvs = [...res?.data?.conversations];
            if (chosenChatDetails) {
              tempConvs = [
                ...conversationModifier(chosenChatDetails, tempConvs),
              ];
            }

            dispatch(setConversations(tempConvs));
            if (tempConvs?.length && chosenChatDetails?.via == "detail") {
              chatClick(tempConvs[0], 0, tempConvs);
            }
          }
        })
      );
    }
  }, [chatBoxCount, conversationCount]);

  const chatClick = (detail, index = null, tempConvs) => {
    setMessagesLoader(true);
    setPage(1);
    if (
      detail?.lastMessage &&
      detail?.lastMessage?.length &&
      detail?.lastMessage[0]
    ) {
      detail.receiver =
        detail?.lastMessage[0]?.receiver == user?.store?.id
          ? detail?.lastMessage[0]?.author
          : detail?.lastMessage[0]?.receiver;
    }
    if (user && user?._id) {
      dispatch(
        getConversation(
          1,
          detail?._id,
          user?.store?.id,
          detail,
          function (res) {
            if (res) {
              setConversationThreadsMessages(res.data.messages);
              dispatch(
                setMessages({
                  messages: res?.data?.messages,
                  totalCount: res?.data?.totalCount,
                })
              );
              setMessageTotalCount(res?.data?.totalCount);
              setMessagesLoader(false);
              if (chatCount > 0) {
                setChatCount((prevCount) => prevCount - 1);
              }
              if (index != null && convs?.length) {
                const tempConv = [...tempConvs];
                tempConv[index].unreadCount = 0;
                dispatch(setConversations(tempConv));
              }
            }
          }
        )
      );
    }

    detail.receiver =
      user?.store?._id == detail.productAuthor?._id
        ? detail?.initBy?._id
        : detail.productAuthor?._id;
    dispatch(setChoosenDetail(detail));
  };

  return (
    <>
      <Drawer
        variant="persistent"
        anchor="right"
        open={chatBox}
        className="chatDrawerContainer"
      >
        <Box
          padding="10px"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {chosenChatDetails ? (
            <Box
              className="chatDrawerHeader"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {chosenChatDetails?.product?.imageCover ? (
                <Avatar
                  src={chosenChatDetails?.product?.imageCover?.full_image}
                  sx={{
                    width: { xs: "35px", sm: "40px" },
                    height: { xs: "35px", sm: "40px" },
                    border: "1px solid #dbdbdb",
                    cursor: "pointer",
                  }}
                ></Avatar>
              ) : (
                <Box className="chat-alpha">
                  <Typography className="inner-alphabet">
                    {chosenChatDetails &&
                      chosenChatDetails?.product &&
                      chosenChatDetails?.product?.product_name[0] &&
                      chosenChatDetails?.product?.product_name[0]}
                  </Typography>
                </Box>
              )}

              <Typography
                variant="subtitle2"
                sx={{ marginLeft: "5px", marginTop: "-5px" }}
              >
                {chosenChatDetails?.initBy?._id === user?.store?._id ? (
                  <>
                    {chosenChatDetails?.product?.product_name?.length > 12
                      ? chosenChatDetails?.product?.product_name?.substring(
                          0,
                          12
                        ) + "..."
                      : chosenChatDetails?.product?.product_name}
                    <span className="chatTitleSeparator"> - </span>
                    {chosenChatDetails?.productAuthor?.store_name?.length > 12
                      ? chosenChatDetails?.productAuthor?.store_name?.substring(
                          0,
                          12
                        ) + "..."
                      : chosenChatDetails?.productAuthor?.store_name}
                  </>
                ) : (
                  <>
                    {chosenChatDetails?.product?.product_name?.length > 12
                      ? chosenChatDetails?.product?.product_name?.substring(
                          0,
                          12
                        ) + "..."
                      : chosenChatDetails?.product?.product_name}
                    <span className="chatTitleSeparator"> - </span>
                    {chosenChatDetails?.initBy?.store_name?.length > 12
                      ? chosenChatDetails?.initBy?.store_name?.substring(
                          0,
                          12
                        ) + "..."
                      : chosenChatDetails?.initBy?.store_name}
                  </>
                )}
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="h5"
              sx={{ marginLeft: "5px", fontWeight: "600" }}
            >
              Chats
            </Typography>
          )}
          <IconButton
            sx={{
              background: "#F4F7F7",
              borderRadius: "8px",
              left: "auto",
            }}
            onClick={() => {
              setTimeout(() => {
                setOpenChat(false);
                dispatch(chatBoxOpen(false));
                dispatch(setChoosenDetail(null));
                dispatch(setMessages(null));
                dispatch(setConversations([]));
              }, 100);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: "#e6e6e6 !important" }} />

        <Grid container spacing={1} className="chat-header">
          {conversations.length > 0 ? (
            <>
              <Grid
                item
                xs={2}
                sm={2}
                md={2}
                lg={2}
                sx={{
                  borderRight: "1px solid #E7E8EA",
                  height: "89vh",
                  overflow: "auto",
                }}
              >
                {convs?.map((el, index) => {
                  return (
                    <Box
                      sx={{ padding: "5px 0px" }}
                      key={index}
                      onClick={(e) => {
                        chatClick(el, index, conversations);
                      }}
                    >
                      {el?.product?.imageCover ? (
                        <>
                          <Badge
                            badgeContent={el?.unreadCount}
                            sx={{ color: "red" }}
                          >
                            <Avatar
                              src={el?.product?.imageCover?.full_image}
                              sx={{
                                width: { xs: "35px", sm: "40px" },
                                height: { xs: "35px", sm: "40px" },
                                border: "1px solid #dbdbdb",
                                cursor: "pointer",
                              }}
                            ></Avatar>
                          </Badge>
                        </>
                      ) : (
                        <Badge
                          badgeContent={el?.unreadCount}
                          sx={{ color: "red" }}
                        >
                          <Box className="chat-alpha">
                            <Typography className="inner-alphabet">
                              {el?.product?.product_name[0]}
                            </Typography>
                          </Box>
                        </Badge>
                      )}
                    </Box>
                  );
                })}
              </Grid>

              <Grid item xs={10} sm={10} md={10} lg={10}>
                {chosenChatDetails ? (
                  <ChatModal
                    emojiPopover={emojiPopover}
                    setEmojiPopover={setEmojiPopover}
                    openEmoji={openEmoji}
                    emojiId={emojiId}
                    messagesLoader={messagesLoader}
                    messageTotalCount={messageTotalCount}
                    setMessageTotalCount={setMessageTotalCount}
                    page={page}
                    setPage={setPage}
                  />
                ) : (
                  <Typography
                    variant="h5"
                    className="text-chat"
                    sx={{ height: "86vh" }}
                  >
                    Start Conversations
                  </Typography>
                )}
              </Grid>
            </>
          ) : (
            <Typography
              variant="h5"
              className="text-chat"
              sx={{ height: "88vh" }}
            >
              No Conversations
            </Typography>
          )}
        </Grid>
      </Drawer>
    </>
  );
};

export default ConversationChatModal;
