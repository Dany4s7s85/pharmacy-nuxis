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
  Card,
  Typography,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

const Example2 = ({ categories, loading }) => {
  const navigate = useNavigate();
  return (
    <div
      className="carousel-container"
      style={{ marginTop: "30px", color: "#494949" }}
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
          Categories
        </Typography>
        <Button
          className="outlined-grey"
          variant="outlined"
          sx={{
            padding: { xs: "5px 12px !important", sm: "10px 28px !important" },
            fontSize: { xs: "12px !important", sm: "14px !important" },
          }}
          onClick={() => navigate('/productlisting"')}
        >
          Explore All
        </Button>
      </Box>
      {loading ? (
        <Box textAlign="center">
          <CircularProgress sx={{ color: " #235D5E" }} />
        </Box>
      ) : categories && categories?.length > 0 ? (
        <Swiper
          spaceBetween={15}
          slidesPerGroup={4}
          rewind={true}
          height={361}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          navigation={true}
          modules={[Autoplay, Navigation]}
          className="mySwiper"
          breakpoints={{
            576: {
              slidesPerView: 1,
              slidesPerGroup: 1,
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
              slidesPerGroup: 2,
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              slidesPerView: 3,
            },
            1199: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              slidesPerView: 4,
            },
          }}
        >
          {categories &&
            categories?.map((category, index) => {
              return (
                <SwiperSlide key={index}>
                  <Card raised className="category-card">
                    <Grid item xs={3}>
                      <Box sx={{ background: "#F4F7F7" }}>
                        {/* <CardHeader
                          className="card-header-category"
                          title={category?.title}
                        ></CardHeader> */}
                        <Box
                          display="flex"
                          className="carousel-img-container-category"
                          justifyContent="center"
                        >
                          <img src={category?.imageCover} />
                        </Box>
                      </Box>
                    </Grid>
                  </Card>
                  <Box pt={3}>
                    <Typography className="category-text text-ellipses">
                      {category?.title}
                    </Typography>
                  </Box>
                </SwiperSlide>
              );
            })}
        </Swiper>
      ) : (
        <Box textAlign="center">No categories are available!</Box>
      )}
      <br />
    </div>
  );
};

export default Example2;
