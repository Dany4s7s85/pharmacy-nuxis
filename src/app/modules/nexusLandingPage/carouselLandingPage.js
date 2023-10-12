import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
import "swiper/swiper.min.css";
import "swiper/swiper-bundle.min.css";
import "swiper/modules/navigation/navigation.min.css"; // Navigation module
import "swiper/modules/free-mode/free-mode.min.css"; // Pagination module
import "swiper/modules/thumbs/thumbs.min.css";

import "./nexus.scss";
import {
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import ViewCard from "../../pages/viewCart/ViewCard";
const Example = ({ products, loading }) => {
  const navigate = useNavigate();

  return (
    <div
      className="carousel-container"
      style={{ marginTop: "50px", color: "#494949" }}
    >
      <Box
        my={2}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography className="main-heading-landing-page">
          Latest Products
        </Typography>
        <Button
          className="outlined-grey"
          variant="outlined"
          sx={{
            padding: { xs: "5px 12px !important", sm: "10px 28px !important" },
            fontSize: { xs: "12px !important", sm: "14px !important" },
          }}
          onClick={() => navigate("/productlisting")}
        >
          Explore All
        </Button>
      </Box>

      {loading ? (
        <Box textAlign="center">
          <CircularProgress sx={{ color: " #235D5E" }} />
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
            320: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 5,
              slidesPerGroup: 5,
              slidesPerView: 5,
            },
            1199: {
              slidesPerView: 6,
              slidesPerGroup: 6,
              slidesPerView: 6,
            },
          }}
        >
          {products &&
            products?.map((product, index) => {
              return (
                <SwiperSlide key={index}>
                  <ViewCard el={product} />
                </SwiperSlide>
              );
            })}
        </Swiper>
      ) : (
        <Box textAlign="center">No Products are available!</Box>
      )}

      <br />
    </div>
  );
};

export default Example;
