import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
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
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    speed: 500,
    swipeToSlide: true,
    swipe: true,
    centerMode: true,
    slidesToShow: 3,
  };

  const handleCardClick = (doc: Document, index: number) => {
    setDocSelected(doc);
    const centerIndex = index;
    sliderRef.current?.slickGoTo(centerIndex);
  };

  useEffect(() => {
    if (docSelected) {
      const index = documents.findIndex((doc) => doc.id === docSelected.id);
      sliderRef.current?.slickGoTo(index);
    }
  }, [docSelected, documents]);

  return (
    <div className="slider-container">
      <Slider ref={sliderRef} {...settings}>
        {documents.map((doc, index) => (
          <div
            key={doc.id}
            className={`card-container ${docSelected?.id === doc.id ? "selected" : ""}`}
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
        ))}
      </Slider>
    </div>
  );
};

export default ControlledCarousel;
