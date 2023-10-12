import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper';
import 'swiper/swiper.min.css';
import 'swiper/swiper-bundle.min.css';
import 'swiper/modules/navigation/navigation.min.css'; // Navigation module
import 'swiper/modules/free-mode/free-mode.min.css'; // Pagination module
import 'swiper/modules/thumbs/thumbs.min.css';
import '../../modules/nexusLandingPage/nexus.scss';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  CircularProgress,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Box from '@mui/material/Box';
import ViewCard from './ViewCard';

const RelatedProductsSwiper = ({
  products,
  setCount,
  relatedProductsLoading,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme?.breakpoints?.down('md'));
  return (
    <div
      className="carousel-container"
      style={{ marginTop: '50px', color: '#494949' }}
    >
      <Box
        my={2}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          fontSize={{ lg: 40, md: 24, sm: 20, xs: 16 }}
          sx={{ color: '#000000', fontWeight: '500' }}
        >
          Related Products
        </Typography>
        <Button
          className="outlined-grey"
          variant="outlined"
          sx={{
            height: isMobile && '34px !important',
            padding: isMobile && '10px 12px !important',
          }}
          onClick={() => navigate('/productlisting')}
        >
          Explore All
        </Button>
      </Box>

      {relatedProductsLoading ? (
        <Box textAlign="center">
          <CircularProgress sx={{ color: ' #235D5E' }} />
        </Box>
      ) : products && products?.length > 0 ? (
        <Swiper
          spaceBetween={15}
          slidesPerGroup={4}
          autoHeight={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={true}
          modules={[Autoplay, Navigation]}
          rewind={true}
          loop={true}
          className="mySwiper"
          breakpoints={{
            576: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 2,
            },
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
            1199: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
          }}
        >
          {products &&
            products?.map((el) => {
              return (
                <SwiperSlide>
                  <ViewCard el={el} setCount={setCount} />
                </SwiperSlide>
              );
            })}
        </Swiper>
      ) : (
        <Box textAlign="center">No Related Products are available!</Box>
      )}

      <br />
    </div>
  );
};

export default RelatedProductsSwiper;
