import React from 'react';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const Message = ({
  content,
  sameAuthor,
  sameDay,
  author,
  createdAt,
  readBy,
  messages,
  index,
  item,
}) => {
  const { user } = useSelector((state) => state?.auth);

  if (sameAuthor && sameDay) {
    return (
      <>
        {user?.store?._id == author?._id ? (
          <Box className="message-box-holder" key={index} id={item?.uuid}>
            <Box className="message-box">{content}</Box>
            <Box>
              {createdAt && !readBy ? (
                <DoneIcon
                  sx={{
                    color: '#235D5E',
                    fontSize: '16px',
                  }}
                />
              ) : (
                <>
                  {readBy ? (
                    <DoneAllIcon
                      sx={{
                        color: '#235D5E',
                        fontSize: '16px',
                      }}
                    />
                  ) : (
                    <PanoramaFishEyeIcon
                      sx={{
                        color: '#235D5E',
                        fontSize: '16px',
                      }}
                    />
                  )}
                </>
              )}
            </Box>
          </Box>
        ) : (
          <Box className="message-box-holder" key={index} id={item?.uuid}>
            <Grid container spacing={2}>
              <Grid item md={10}>
                <Box className="message-box message-partner">{content}</Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </>
    );
  }
  //waleed
  return (
    <>
      {user?.store?._id == author?._id ? (
        <Box className="message-box-holder" key={index} id={item?.uuid}>
          <Box className="message-box">{content}</Box>
          <Box>
            {createdAt && !readBy ? (
              <DoneIcon
                sx={{
                  color: '#235D5E',
                  fontSize: '16px',
                }}
              />
            ) : (
              <>
                {readBy ? (
                  <DoneAllIcon
                    sx={{
                      color: '#235D5E',
                      fontSize: '16px',
                    }}
                  />
                ) : (
                  <PanoramaFishEyeIcon
                    sx={{
                      color: '#235D5E',
                      fontSize: '16px',
                    }}
                  />
                )}
              </>
            )}
          </Box>
        </Box>
      ) : (
        <Box className="message-box-holder" key={index} id={item?.uuid}>
          <Box className="message-box message-partner">{content}</Box>
        </Box>
      )}
    </>
  );
};

export default Message;
