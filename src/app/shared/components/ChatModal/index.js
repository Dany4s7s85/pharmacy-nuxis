import React, { useEffect, useState, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Grid, Popover } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import "./chat.scss";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversation,
  setChoosenDetail,
  setConversations,
  setRecentConversations,
} from "../../../services/chat";
import { setMessages } from "../../../services/chat";
import {
  getDirectChatHistory,
  sendDirectMessage,
  socketServer,
} from "../../../realtimeCommunication/socketConnection";
import Message from "./message";
import DateSeparator from "./DateSeparator";
import Chip from "@mui/material/Chip";
import SendIcon from "@mui/icons-material/Send";
import ButtonGroup from "@mui/material/ButtonGroup";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Typography from "@mui/material/Typography";
import { ClipLoader } from "react-spinners";
import { v4 as uuidv4 } from "uuid";
import InfiniteScroll from "react-infinite-scroll-component";

const ChatModal = ({
  emojiPopover,
  setEmojiPopover,
  openEmoji,
  emojiId,
  messagesLoader,
  messageTotalCount,
  page,
  setPage,
  setMessageTotalCount,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth);
  const { chosenChatDetails, messages } = useSelector((state) => state?.chat);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [message, setMessage] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingScrollData, setIsLoadingScrollData] = useState(false);
  const [shouldScrollToId, setShouldScrollToId] = useState("");
  const [hasMoreData, setHasMoreData] = useState(false);
  const [initialScroll, setIsInitialScroll] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollableDivRef = useRef(null);

  useEffect(() => {
    setTextAreaValue("");
  }, [chosenChatDetails]);

  useEffect(() => {
    if (shouldScrollToId !== "") {
      const element = document.getElementById(shouldScrollToId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsInitialScroll(false);
      }
    }
  }, [shouldScrollToId]);

  useEffect(() => {
    if (messages?.totalCount && messages?.totalCount != undefined) {
      setMessageTotalCount(messages?.totalCount);
    }

    setMessage(messages?.messages);
  }, [messages]);

  var timeout = undefined;
  function timeoutFunction() {
    // updateChatFriendsTypingStatus({receiver:copyChosenChatDetails.id,sender:userDetails._id,isTyping:false})
  }

  const handleClickEmoji = (event) => {
    setEmojiPopover(event.currentTarget);
  };

  const handleCloseEmoji = () => {
    setEmojiPopover(null);
  };

  const onEmojiClick = (emojiObject, event) => {
    const textAreaElement = document.getElementById("text-area");

    setTextAreaValue(
      textAreaValue.substr(0, textAreaElement.selectionStart) +
        emojiObject?.emoji +
        textAreaValue.substr(textAreaElement.selectionEnd)
    );
  };

  const handleChange = (e) => {
    setTextAreaValue(e?.target?.value);
  };

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      handleSendMessage();
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(timeoutFunction, 3000);
    }
  };

  const handleSendMessage = () => {
    let uuid = uuidv4();
    let data = {
      role: user?.role,
      initBy: chosenChatDetails?.initBy?._id,
      user: user?._id,
      product: chosenChatDetails?.product?._id,
      author: user?.store?._id,
      receiver:
        user?.store?._id == chosenChatDetails.productAuthor?._id
          ? chosenChatDetails?.initBy?._id
          : chosenChatDetails.productAuthor?._id,
      productAuthor: chosenChatDetails.productAuthor?._id,
      content: textAreaValue,
    };
    if (textAreaValue?.length > 0) {
      let temp = {
        content: textAreaValue,
        author: {
          _id: user?.store?._id,
          store_name: user?.store?.store_name,
        },
        date: new Date(),
        receiver: chosenChatDetails?.receiver,
        uuid,
      };
      let tempMessages = [...messages?.messages, temp];

      dispatch(setMessages({ messages: tempMessages }));
      sendDirectMessage({
        role: user?.role,
        initBy: chosenChatDetails?.initBy?._id,
        user: user?._id,
        product: chosenChatDetails?.product?._id,
        author: user?.store?._id,
        receiver:
          user?.store?._id == chosenChatDetails.productAuthor?._id
            ? chosenChatDetails?.initBy?._id
            : chosenChatDetails.productAuthor?._id,
        productAuthor: chosenChatDetails.productAuthor?._id,
        content: textAreaValue,
        uuid,
      });
      setTextAreaValue("");
    }
  };

  const handleResolve = () => {
    sendDirectMessage({
      role: chosenChatDetails.role,
      user: chosenChatDetails.user,
      product: chosenChatDetails?.product,
      author: chosenChatDetails?.author,
      receiver: chosenChatDetails?.receiver,
      productAuthor: chosenChatDetails.productAuthor,
      content: "5772071589",
    });
  };

  const convertDateToHumanReadable = (date, format) => {
    const map = {
      mm: date.getMonth() + 1,
      dd: date.getDate(),
      yy: date.getFullYear().toString().slice(-2),
      yyyy: date.getFullYear(),
    };

    return format.replace(/mm|dd|yy|yyy/gi, (matched) => map[matched]);
  };

  const fetchMessages = () => {
    if (
      chosenChatDetails?.lastMessage &&
      chosenChatDetails?.lastMessage?.length &&
      chosenChatDetails?.lastMessage[0]
    ) {
      chosenChatDetails.receiver =
        chosenChatDetails?.lastMessage[0]?.receiver == user?.store?.id
          ? chosenChatDetails?.lastMessage[0]?.author
          : chosenChatDetails?.lastMessage[0]?.receiver;
    }
    if (user && user?._id) {
      dispatch(
        getConversation(
          page + 1,
          chosenChatDetails?._id,
          user?.store?.id,
          chosenChatDetails,
          function (res) {
            if (res?.status == "success") {
              setMessage([...res?.data?.messages, ...message]);
              setPage((prevPage) => prevPage + 1);
            }
          }
        )
      );
    }

    chosenChatDetails.receiver =
      user?.store?._id == chosenChatDetails.productAuthor?._id
        ? chosenChatDetails?.initBy?._id
        : chosenChatDetails.productAuthor?._id;
  };

  const fetchScrollData = () => {
    if (isLoadingScrollData || initialScroll) {
      // Request is already in progress, so return early
      return;
    }

    setIsLoadingScrollData(true);
    setIsInitialScroll(true);
    dispatch(
      getConversation(
        page + 1,
        chosenChatDetails?._id,
        user?.store?.id,
        chosenChatDetails,
        function (res) {
          if (res?.status == "success") {
            let tempMessages = [...res?.data?.messages, ...message];
            dispatch(
              setMessages({
                messages: tempMessages,
                totalCount: res?.data?.totalCount,
              })
            );
            setPage((prevPage) => prevPage + 1);

            if (res?.data?.messages?.length) {
              setTimeout(() => {
                setShouldScrollToId(
                  res?.data?.messages[res?.data?.messages?.length - 1]?.uuid
                );
              }, 200);
            }
            if (res.data.totalCount > tempMessages?.length) {
              setHasMoreData(true);
            } else {
              setHasMoreData(false);
              setIsInitialScroll(false);
            }

            // setIsInitialScroll(true);

            setTimeout(() => {
              setIsLoadingScrollData(false);
            }, 1500);
          }
        }
      )
    );
  };

  const handleResumeChat = () => {
    let content = "57720715810";
    if (chosenChatDetails.productAuthor == user?.store?._id) {
      content = "57720715811";
    }
    let temp = {
      content: "Hy",
      author: {
        _id: user?.store?._id,
        store_name: user?.store?.store_name,
      },
      date: new Date(),
      receiver: chosenChatDetails?.receiver,
    };
    let tempMessages = [];
    tempMessages.push(temp);
    // dispatch(setMessages(tempMessages));
    sendDirectMessage({
      role: chosenChatDetails.role,
      user: chosenChatDetails.user,
      product: chosenChatDetails?.product,
      author: chosenChatDetails?.author,
      receiver: chosenChatDetails?.receiver,
      productAuthor: chosenChatDetails.productAuthor,
      content: content,
    });
  };

  const handleScroll = () => {
    const scrollableDiv = document.getElementById("scrollableDiv");

    const currentPosition = Math.abs(scrollableDiv.scrollTop) + 2;
    const maxScrollTop =
      scrollableDiv.scrollHeight - scrollableDiv.clientHeight;
    const isAtTop = currentPosition >= maxScrollTop;

    if (isAtTop && message?.length < messageTotalCount) {
      fetchScrollData();
    }
  };

  return (
    <>
      <Box className="chatbox">
        {messagesLoader ? (
          <Box
            ref={messagesEndRef}
            className="chat-messages-spinner-container"
            id="chat-feed-container"
          >
            <ClipLoader
              size={25}
              color="black"
              sx={{ margin: "auto" }}
              loading
            />
          </Box>
        ) : (
          <div
            id="scrollableDiv"
            style={{
              overflow: "auto",
              height: "75vh",
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            <InfiniteScroll
              dataLength={message?.length}
              next={() => {}}
              style={{ display: "flex", flexDirection: "column-reverse" }}
              inverse={true}
              onScroll={handleScroll}
              hasMore={message?.length < messageTotalCount}
              loader={
                message?.length < messageTotalCount ? (
                  <Box
                    sx={{
                      display: "flex",
                      margin: "1rem auto",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={
                        isLoadingScrollData
                          ? { visibility: "visible" }
                          : { visibility: "hidden" }
                      }
                    >
                      <ClipLoader size={28} loading />
                    </div>
                  </Box>
                ) : null
              }
              // scrollThreshold={0.5}
              scrollableTarget="scrollableDiv"
            >
              <Box
                ref={messagesEndRef}
                className="chat-messages"
                id="chat-feed-container"
              >
                {message && message.length ? (
                  message?.map((item, index) => {
                    const sameAuthor =
                      index > 0 &&
                      message[index].author._id ===
                        message[index - 1].author._id;

                    const sameDay =
                      index > 0 &&
                      convertDateToHumanReadable(
                        new Date(item.date),
                        "dd/mm/yy"
                      ) ===
                        convertDateToHumanReadable(
                          new Date(message[index - 1].date),
                          "dd/mm/yy"
                        );

                    return (
                      <>
                        {(!sameDay || index === 0) && (
                          <DateSeparator
                            date={convertDateToHumanReadable(
                              new Date(item?.date),
                              "dd/mm/yy"
                            )}
                          />
                        )}

                        <Message
                          key={item?.uuid}
                          content={item?.content}
                          sameAuthor={sameAuthor}
                          sameDay={sameDay}
                          author={item?.author}
                          createdAt={item?.createdAt}
                          readBy={item?.readby}
                          messages={messages}
                          index={index}
                          item={item}
                        />
                      </>
                    );
                  })
                ) : (
                  <Typography variant="h5" className="text-chat">
                    Start New Conversation
                  </Typography>
                )}
              </Box>
            </InfiniteScroll>
          </div>
        )}

        <Box className="chatbox-bottom">
          <Box className="chat-input-holder">
            {/* {chosenChatDetails?.productAuthor == user?.store?._id &&
            message &&
            message?.length &&
            !message[message?.length - 1]?.isResolved ? (
              <Box className="chat-btn-cont">
                <Button
                  sx={{
                    fontSize: "12px",
                    padding: "10px 20px",
                  }}
                  variant="text"
                  className="outlined-text "
                  onClick={handleResolve}
                  startIcon={<CheckCircleOutlineIcon />}
                >
                  Resolve Chat
                </Button>
              </Box>
            ) : (
              ""
            )} */}

            {message &&
            message?.length &&
            message[message?.length - 1]?.isResolved ? (
              <>
                <Box className="chat-res-txt">
                  <span>chat is Resolved</span>
                </Box>
                <Button
                  sx={{
                    padding: "0px",
                    height: "35px",
                  }}
                  variant="contained"
                  className="containedPrimary"
                  onClick={handleResumeChat}
                >
                  Send Message
                </Button>
              </>
            ) : (
              <>
                <Box
                  height={"10vh"}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  px={1}
                >
                  <textarea
                    id="text-area"
                    value={textAreaValue}
                    onChange={handleChange}
                    onKeyDown={onEnterPress}
                    className="chat-input"
                    placeholder="Enter Message"
                    style={{ width: "100%" }}
                  ></textarea>
                  <ButtonGroup
                    variant="contained"
                    aria-label="outlined primary button group"
                    sx={{
                      position: "absolute",
                      right: "0",
                      boxShadow: "0",
                      paddingRight: "10px",
                    }}
                  >
                    <IconButton
                      aria-describedby={emojiId}
                      variant="contained"
                      onClick={handleClickEmoji}
                    >
                      <SentimentSatisfiedAltIcon
                        sx={{
                          color: "#7366ff",
                          fontSize: "24px",
                          margin: "-3px",
                        }}
                      />
                    </IconButton>
                    <IconButton
                      aria-describedby={emojiId}
                      variant="contained"
                      onClick={() => {
                        handleSendMessage();
                      }}
                    >
                      <SendIcon
                        sx={{
                          color: "#7366ff",
                          fontSize: "24px",
                          margin: "-3px",
                        }}
                      />
                    </IconButton>
                  </ButtonGroup>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
      <Popover
        id={emojiId}
        open={openEmoji}
        anchorEl={emojiPopover}
        onClose={handleCloseEmoji}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <EmojiPicker onEmojiClick={onEmojiClick} />
      </Popover>
    </>
  );
};

export default ChatModal;
