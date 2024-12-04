import { Dispatch, FC, SetStateAction, useRef } from "react";
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
  docSelected: Document | null;
  setDocSelected: Dispatch<SetStateAction<Document | null>>;
  documents: Document[] | null;
  setLocation: Dispatch<SetStateAction<Coordinates | PolygonArea | null>>;
}

const ControlledCarousel: FC<CardCarouselProps> = ({
  docSelected,
  setDocSelected,
  documents,
  setLocation,
}) => {
  const { setPositionMode } = useAppContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null);

  const handleCardClick = (doc: Document, index: number) => {
    setDocSelected(doc);
    swiperRef.current?.swiper.slideTo(index);
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
        >
          {documents.map((doc, index) => (
            <SwiperSlide key={doc.id}>
              <div
                className={`card-container ${
                  docSelected?.id === doc.id ? "selected" : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(doc, index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCardClick(doc, index);
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
