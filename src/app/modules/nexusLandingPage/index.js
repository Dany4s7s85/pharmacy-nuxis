import React, { useContext, useEffect, useState } from "react";
import "./nexus.scss";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Example from "./carouselLandingPage";
import Example2 from "./categorySwiper";
import { useDispatch, useSelector } from "react-redux";
import {
  getLandingPageCategory,
  getPharmacyLandingProducts,
} from "../../services/products";
import { useNavigate } from "react-router-dom";
import "swiper/swiper.min.css";
import "swiper/swiper-bundle.min.css";
import "swiper/modules/navigation/navigation.min.css"; // Navigation module
import "swiper/modules/free-mode/free-mode.min.css"; // Pagination module
import "swiper/modules/thumbs/thumbs.min.css";
import bismol from "../../assets/images/categories/bismol.jpg";
import Hydrocortisone from "../../assets/images/categories/Hydrocortisone.jpg";
import LINDANE from "../../assets/images/categories/LINDANE.jpg";
import Ethylene from "../../assets/images/categories/Ethylene.jpg";
import wart from "../../assets/images/categories/wart.jpg";
import callus from "../../assets/images/categories/callus.jpg";
import feverfew from "../../assets/images/categories/feverfew.jpg";
import OstroVit from "../../assets/images/categories/OstroVit.jpg";
import greenOrganic from "../../assets/images/categories/greenOrganic.jpg";
import Sunburn from "../../assets/images/categories/Sunburn.jpg";
import caffeine from "../../assets/images/categories/caffeine.jpg";
import peppermint from "../../assets/images/categories/peppermint.jpg";
import chamomile from "../../assets/images/categories/chamomile.jpg";
import FLORAVIT from "../../assets/images/categories/FLORAVIT.jpg";
import echincea from "../../assets/images/categories/echincea.jpg";
import oral from "../../assets/images/categories/oral.jpg";
import moringa from "../../assets/images/categories/moringa.jpg";
import ubiq from "../../assets/images/categories/ubiq.jpg";
import vetriscience from "../../assets/images/categories/vetriscience.jpg";
import valerian from "../../assets/images/categories/valerian.jpg";
import secure from "../../assets/images/categories/secure.jpg";
import omega from "../../assets/images/categories/omega-3.jpg";
import hydrogen from "../../assets/images/categories/hydrogen-peroxide.jpg";
import factors from "../../assets/images/categories/factors.jpg";
import mouthwash from "../../assets/images/categories/mouthwash.jpg";
import ephedra from "../../assets/images/categories/ephedra.jpg";
import lens from "../../assets/images/categories/lens.jpg";
import antifungal from "../../assets/images/categories/antifungal.jpg";
import tylenol from "../../assets/images/categories/tylenol.jpg";
import aco from "../../assets/images/categories/aco.jpg";
import mineral from "../../assets/images/categories/mineral.jpg";
import bottle from "../../assets/images/categories/bottle.jpg";
import pharmacyOne from "../../assets/images/pharmacy-1.webp";
import pharmacyTwo from "../../assets/images/pharmacy-2.webp";
import pharmacyThree from "../../assets/images/pharmacy-3.jpg";
import { narcoticFilter } from "../../helpers/common";
import { AuthContext } from "../../context/authContext";
import { Grid } from "@mui/material";
import tablets from "../../assets/images/tablets.png";

const categories = [
  {
    title: "LS - LINDANE LOTION - SCABICIDE",
    imageCover: LINDANE,
  },
  {
    title: "narcotics",
    imageCover: caffeine,
  },
  {
    title: "LS - DECONGESTANT ORAL ADULT",
    imageCover:
      "https://cdn.sehat.com.pk/product_images/o/756/Picture-365__23848_zoom.jpg",
  },
  {
    title: "LS - HYDROCORTISONE",
    imageCover: Hydrocortisone,
  },
  {
    title: "LS - BISMUTH SUBSALICYLATE",
    imageCover: bismol,
  },
  {
    title: "LS - ETHYLENE OXIDE GASEOUS STERILANT",
    imageCover: Ethylene,
  },
  {
    title: "LS - WART REMOVERS",
    imageCover: wart,
  },
  {
    title: "LS - CORN AND CALLOUS REMOVERS",
    imageCover: callus,
  },
  {
    title: "LS - FEVERFEW LEAF",
    imageCover: feverfew,
  },
  {
    title: "CAT IV - DIETARY MIN/DIETARY VIT. SUPPLEMENTS",
    imageCover: OstroVit,
  },
  {
    title: "LS - VIT. SUPPL./MIN. SUPPL./UBIQUINONE",
    imageCover: greenOrganic,
  },
  {
    title: "CAT IV - MED. SKIN CARE PROD./SUNBURN PROTECTANTS",
    imageCover: Sunburn,
  },
  {
    title: "LS - CAFFEINE",
    imageCover: caffeine,
  },
  {
    title: "LS - PEPPERMINT",
    imageCover: peppermint,
  },
  {
    title: "LS - CHAMOMILE",
    imageCover: chamomile,
  },
  {
    title: "LS - INTESTINAL FLORA MODIFIERS",
    imageCover: FLORAVIT,
  },
  {
    title: "LS - ECHINACEA ROOT",
    imageCover: echincea,
  },
  {
    title: "LS - DENTAL AND ORAL CARE PRODUCTS FOR PROF. USE",
    imageCover: oral,
  },
  {
    title: "CAT IV - DIETARY MINERAL SUPPLEMENTS",
    imageCover: moringa,
  },
  {
    title: "LS - MIN. SUPPLEMENTS/UBIQUINONE",
    imageCover: ubiq,
  },
  {
    title: "CAT IV - DIETARY VITAMIN SUPPLEMENTS",
    imageCover: vetriscience,
  },
  {
    title: "LS - VALERIAN",
    imageCover: valerian,
  },
  {
    title: "CAT IV - FLUORIDE CONTAINING ANTI-CARIES PRODUCTS",
    imageCover: secure,
  },
  {
    title: "LS - VIT. SUPPLEMENTS/UBIQUINONE",
    imageCover: omega,
  },
  {
    title: "LS - PEROXIDE ORAL CARE PRODUCTS",
    imageCover: hydrogen,
  },
  {
    title: "LS - UBIQUINONE",
    imageCover: factors,
  },
  {
    title: "LS - FLUORIDE-CONT. TREAT. GELS & RINSES FOR CONS.",
    imageCover: mouthwash,
  },
  {
    title: "LS - EPHEDRA",
    imageCover: ephedra,
  },
  {
    title: "CAT IV - CONTACT LENS DISINFECTANTS",
    imageCover: lens,
  },
  {
    title: "LS - ANTIFUNGALS (TOPICAL)",
    imageCover: antifungal,
  },
  {
    title: "LS - COUNTERIRRITANTS",
    imageCover: tylenol,
  },
  {
    title: "LS - HOMEOPATHIC PREPARATIONS",
    imageCover: aco,
  },
  {
    title: "LS - MINERAL SUPPLEMENTS",
    imageCover: mineral,
  },
  {
    title: "LS - VITAMIN SUPPLEMENTS",
    imageCover: bottle,
  },
  {
    title: "LS - EPHEDRINE/PSEUDOEPHEDRINE",
    imageCover:
      "https://levelupchem.com/wp-content/uploads/2020/04/pseudoephedrine.jpg",
  },
  {
    title: "LS - VIT. SUPPLEMENTS/MIN SUPPLEMENTS",
    imageCover:
      "	https://m.media-amazon.com/images/I/61SLRWnuy2L._AC_UF1000,1000_QL80_.jpg",
  },
  {
    title: "LS - ANORECTAL DRUG PRODUCTS",
    imageCover: "https://pics.drugstore.com/prodimg/452023/900.jpg",
  },
  {
    title: "CAT IV - FIRST AID ANTISEPTICS",
    imageCover:
      "https://media.naheed.pk/catalog/product/cache/49dcd5d85f0fa4d590e132d0368d8132/1/0/1056146-1.jpg",
  },
  {
    title: "LS - TOPICAL NASAL DECONGESTANTS",
    imageCover:
      "https://cdn.sehat.com.pk/product_images/o/756/Picture-365__23848_zoom.jpg",
  },
  {
    title: "LS - LAXATIVES (STIMULANT)",
    imageCover: "https://www.shoppingbag.pk/images/uploads/7122020071242_p.jpg",
  },
  {
    title: "CAT IV - ANTIPERSPIRANTS",
    imageCover:
      "https://superhealth.com.pk/wp-content/uploads/2021/06/DOXORUBICIN-10MG-INJ.jpg",
  },
  {
    title: "CAT IV - TOILET BOWL DISINFECTANT CLEANERS",
    imageCover:
      "https://www.alclean.pk/wp-content/uploads/2020/06/TBC-250ML-300x300.jpg",
  },
  {
    title: "LS - LACTULOSE",
    imageCover:
      "https://5.imimg.com/data5/SELLER/Default/2022/6/NL/HP/LH/142642635/lactulose-sodium-1000x1000.jpg",
  },
  {
    title: "LS - ANTIFLATULANTS/ANTACIDS",
    imageCover:
      "https://3.imimg.com/data3/GU/HC/MY-11120663/flatuna-250x250.jpg",
  },
  {
    title: "LS - ANTHELMINTICS",
    imageCover:
      "https://img2.exportersindia.com/product_images/bc-full/2020/5/5707304/anthelmintic-drugs-1590403625-5450714.jpg",
  },
  {
    title: "LS - CYPROHEPTADINE",
    imageCover:
      "https://4.imimg.com/data4/BY/LS/MY-11068382/cyproheptadine-2mg-500x500.jpg",
  },
  {
    title: "LS - LAXATIVES (STOOL SOFTENER)",
    imageCover: "https://images.heb.com/is/image/HEBGrocery/001798178",
  },
  {
    title: "LS - ANTACID/BISMUTH SUBSALICYLATES",
    imageCover:
      "https://www.emeds.pk/upload/pro-imges/image-8/bismol-120ml-2.jpg",
  },
  {
    title: "LS - ANALGESICS/CAFFEINE",
    imageCover:
      "https://www.news-medical.net/image.axd?picture=2014%2F7%2FPharmacology-620x480.jpg",
  },
  {
    title: "LS - TOPICAL ANTIBIOTICS",
    imageCover:
      "https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/ACT01791.jpg?output-quality=50",
  },
  {
    title: "LS - QUATERNARY AMMONIUM COMP. AGAINST HIV",
    imageCover:
      "https://5.imimg.com/data5/MB/UK/RQ/IOS-14393995/product-jpeg-500x500.png",
  },
  {
    title: "CAT IV - ATHLETES FOOT TREATMENTS",
    imageCover:
      "https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/ACT07350.jpg?output-quality=50",
  },
  {
    title: "LS - TRIETHANOLAMINE SALICYLATE (TROLAMINE)",
    imageCover:
      "	https://m.media-amazon.com/images/I/81KiSZEgxHL._AC_SX425_.jpg",
  },
  {
    title: "CAT IV - MEDICATED SKIN CARE PRODUCTS",
    imageCover:
      "https://sa1s3optim.patientpop.com/assets/images/provider/photos/2227348.png",
  },
  {
    title: "CAT IV - THROAT LOZENGES",
    imageCover: "https://pics.drugstore.com/prodimg/11230/900.jpg",
  },
  {
    title: "CAT IV - ACNE THERAPY",
    imageCover:
      "https://media.self.com/photos/61b7caef0a23fbf29073f7b2/1:1/w_1000,h_1000,c_limit/Differin%20Gel.jpg",
  },
  {
    title: "LS - SLEEP AIDS",
    imageCover:
      "https://images-na.ssl-images-amazon.com/images/I/61QBrb2MliL._AC_UL600_SR600,600_.jpg",
  },
  {
    title: "CAT IV",
    imageCover:
      "https://www.brookings.edu/wp-content/uploads/2020/06/global_belgium_medicine_blister_packs.jpg",
  },
  {
    title: "LS - LAXATIVES (GENERAL)",
    imageCover:
      "	https://onemg.gumlet.io/l_watermark_346,w_480,h_48…_480,c_fit,q_auto,f_auto/mfrn7kjuf53iridi0jv5.jpg",
  },
  {
    title: "LS - ANTIFLATULENTS",
    imageCover: "https://www.rxspark.com/drug-image/21777/Package/full/1911",
  },
  {
    title: "LS - ANTACID",
    imageCover:
      "https://5.imimg.com/data5/DF/HE/NN/SELLER-16645300/pantomore-ls-500x500.jpg",
  },
  {
    title: "LS - EXPECTORANT - ADULT",
    imageCover:
      "https://newassets.apollo247.com/pub/media/catalog/product/a/s/asc0042.jpg",
  },
  {
    title: "LS - ACETYLSALICYLIC LABELLING STANDARD",
    imageCover:
      "https://fda.report/DailyMed/de3e223f-8d22-4034-b049-983b4a60daf5/Aspirin_81.jpg",
  },
  {
    title: "LS - DIMENHYDRINATE",
    imageCover: "https://meds.myupchar.com/64114/open-uri20220423-26609-ymzr4y",
  },
  {
    title: "LS - COUGH AND COLD",
    imageCover:
      "https://newassets.apollo247.com/pub/media/catalog/product/c/h/che0311_1.jpg",
  },
  {
    title: "LS - ANALG (ACETAMINOPHEN LABELLING STANDARD)",
    imageCover:
      "https://dentagama.com/img/030617031730PillsCapsulesCapletsChewables.jpg",
  },
  {
    title: "CAT IV - ANTIDANDRUFF PRODUCTS",
    imageCover:
      "https://cdnprod.mafretailproxy.com/sys-master-root/h5d/h7c/10223891349534/45046_3.jpg_480Wx480H",
  },
  {
    title: "LS - ANALG. (ACETAMINOPHEN",
    imageCover:
      "https://m.media-amazon.com/images/I/71Gy7z9J0AL._AC_SX569_.jpg",
  },
  {
    title: "CAT IV - DIAPER RASH PRODUCTS",
    imageCover:
      "https://static-01.daraz.pk/p/1ff97dba086497e2f06233debf110387.jpg",
  },
  {
    title: "LS - TOPICAL - ANAESTHETIC/ANALGESIC/ANTIPRURITIC",
    imageCover:
      "https://www.intechopen.com/media/chapter/47578/media/image9.jpeg",
  },
  {
    title: "CAT IV - HARD SURFACE DISINFECTANTS",
    imageCover:
      "https://static-01.daraz.pk/original/49f6858ac78e3545cdbc65a915e8f534.jpg",
  },
  {
    title: "CAT IV - ANTISEPTIC SKIN CLEANSERS",
    imageCover: "https://pics.drugstore.com/prodimg/368772/450.jpg",
  },
  {
    title: "CAT IV - ORAL HEALTH PRODUCTS",
    imageCover:
      "https://static-01.daraz.pk/p/17963bf9b4158e45a7da0fcbd3601af5.jpg",
  },
  {
    title: "CAT IV - SUNBURN PROTECTANTS",
    imageCover:
      "https://www.health.com/thmb/fa3kmnaaD3Em5je_IaCDbfwPqfY=/1500x1500/smart/filters:no_upscale()/hawaiian-tropic-silk-hydration-moisturizing-sun-care-after-sun-lotion-5debc1ef1e3743338f4b99effb1c7660.jpg",
  },
  {
    title: "other",
    imageCover:
      "https://img.onmanorama.com/content/dam/mm/en/kerala/top-news/images/2022/8/9/pills.jpg",
  },
];

const NexusLanding = () => {
  const { hasPermission } = useContext(AuthContext);
  const { user } = useSelector((state) => state?.auth);
  const response = useSelector(
    (state) => state?.product?.landingPageProducts?.response
  );
  const categoriesResponse = useSelector(
    (state) => state?.product?.landingPageCategories?.response?.data?.categories
  );

  const landingPageProductsLoading = useSelector(
    (state) => state?.product?.landingPageProducts?.loading
  );

  const categoriesLoading = useSelector(
    (state) => state?.product?.landingPageCategories?.loading
  );

  const products = () => {
    let products =
      response?.data && response?.data?.length && response?.data[0]?.data;

    if (products && products?.length > 0) {
      if (user && user?.email && hasPermission("narcotics.purchasing")) {
        products = products;
      } else {
        products = narcoticFilter(products);
      }
    }
    return products;
  };

  const [value, setValue] = useState("1");
  const [proCategories, setProCategories] = useState([]);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPharmacyLandingProducts());
    dispatch(
      getLandingPageCategory(function (response) {
        if (response?.data?.categories?.length > 0) {
          response.data.categories = response?.data?.categories?.map(
            (item) => ({
              ...categories.find((el) => el.title == item.title),
              ...item,
            })
          );
          setProCategories(response.data.categories);
        }
      })
    );
  }, [dispatch]);

  let items = [
    {
      name: "Welcome to NxusRx",
      description: "Upto 60% Off on all Products",
      img: pharmacyOne,
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      img: pharmacyTwo,
    },
    {
      name: "Random Name #3",
      description: "Hello World!",
      img: pharmacyThree,
    },
  ];

  return (
    <React.Fragment>
      <Container disableGutters={true}>
        <Grid
          container
          sx={{
            backgroundColor: "#F4F7F7",
            height: "100%",
            borderRadius: "20px",
            display: "flex",
            padding: { sm: "20px 20px", lg: "40px 50px" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            lg={4}
            sx={{
              justifyContent: "center",
            }}
          >
            <Typography className="main-text">Welcome to NxusRX</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            lg={4}
            sx={{
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <img className="banner-img" src={tablets} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            lg={4}
            sx={{
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Box>
              <Box className="upto" sx={{ marginBottom: "20px" }}>
                <Typography variant="h3" className="upto-text">
                  Upto 60% off on all products
                </Typography>
              </Box>
              <Box className="explore">
                <Button
                  className="outlined-white-green"
                  variant="outlined"
                  onClick={() => navigate("/productlisting")}
                  sx={{
                    padding: {
                      xs: "5px 12px !important",
                      sm: "10px 28px !important",
                    },
                    fontSize: { xs: "12px !important", sm: "14px !important" },
                    mb: 2
                  }}
                >
                  Explore All
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ width: "100%" }}>
          <Example2 categories={proCategories} loading={categoriesLoading} />
        </Box>

        <Box sx={{ width: "100%" }}>
          <Example products={products()} loading={landingPageProductsLoading} />
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default NexusLanding;
