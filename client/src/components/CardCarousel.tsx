import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAppContext } from "../context/appContext";
import "../styles/CardCarousel.scss";
import { Coordinates, Document, PolygonArea } from "../utils/interfaces";
import { PositionMode } from "../utils/modes";
import CardDocument from "./CardDocument";

interface CardCarouselProps {
  docSelected: Document | undefined;
  setDocSelected: Dispatch<SetStateAction<Document | undefined>>;
  documents: Document[] | null;
  setLocation: Dispatch<SetStateAction<Coordinates | PolygonArea | null>>;
}

const ControlledCarousel: FC<CardCarouselProps> = ({
  docSelected,
  setDocSelected,
  documents,
  setLocation,
}) => {
  const { setPositionMode, setShowTooltipUploads } = useAppContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (documents && documents.length > 0 && !docSelected) {
      setDocSelected(documents[0]);
    }
  }, []);

  useEffect(() => {
    if (docSelected && documents) {
      const index = documents.findIndex((doc) => doc.id === docSelected.id);
      if (index !== -1) {
        swiperRef.current?.swiper.slideTo(index);
      }
    }
    setShowTooltipUploads(false);
  }, [docSelected]);

  useEffect(() => {
    if (documents && documents.length > 0) {
      if (!docSelected) {
        setDocSelected(documents[0]);
      } else {
        const index = documents.findIndex((doc) => doc.id === docSelected.id);
        if (index !== -1) {
          swiperRef.current?.swiper.slideTo(index);
        } else {
          setDocSelected(documents[0]);
        }
      }
    }
  }, [documents]);

  const handleSlideChange = () => {
    if (swiperRef.current && documents) {
      const currentIndex = swiperRef.current.swiper.realIndex;
      setDocSelected(documents[currentIndex]);
    }
  };

  const handleEditPos = () => {
    if (docSelected) {
      if (docSelected.coordinates) {
        setLocation(docSelected.coordinates);
      } else if (docSelected.area) {
        setLocation(docSelected.area);
      }
    }
    setPositionMode(PositionMode.Update);
  };

  return (
    <div className="slider-container">
      {documents && documents?.length ? (
        <Swiper
          ref={swiperRef}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper"
          onSlideChange={handleSlideChange}
        >
          {documents.map((doc) => (
            <SwiperSlide key={doc.id}>
              <div
                className={`card-container ${
                  docSelected?.id === doc.id ? "selected" : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setDocSelected(doc)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setDocSelected(doc);
                  }
                }}
              >
                <CardDocument
                  document={doc}
                  toEditPos={handleEditPos}
                  showMapButton={true}
                  isDocSelected={docSelected?.id === doc.id}
                  setMinimapCoord={setLocation}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <h1 className="not-found">Documents not found...</h1>
      )}
    </div>
  );
};

export default ControlledCarousel;
