import { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "../styles/CardCarousel.scss";
import { Coordinates, Document } from "../utils/interfaces";
import CardDocument from "./CardDocument";

interface CardCarouselProps {
  documents: Document[];
  setCoordinates: Dispatch<SetStateAction<Coordinates>>;
}

const ControlledCarousel: FC<CardCarouselProps> = ({
  documents,
  setCoordinates,
}) => {
  const [docSelected, setDocSelected] = useState<Document | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null);

  const handleCardClick = (doc: Document, index: number) => {
    setDocSelected(doc);
    swiperRef.current?.swiper.slideTo(index);
  };

  return (
    <div className="slider-container">
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
                toEditPos={() => {}}
                showMapButton={true}
                isDocSelected={docSelected?.id === doc.id}
                setMinimapCoord={setCoordinates}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ControlledCarousel;
