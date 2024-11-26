import { FC } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "../styles/CardCarousel.scss";
import { Document } from "../utils/interfaces";
import CardDocument from "./CardDocument";

interface CardCarouselProps {
  documents: Document[];
}

const ControlledCarousel: FC<CardCarouselProps> = (props) => {
  const settings = {
    dots: true,
    speed: 500,
    swipeToSlide: true,
    swipe: true,
    centerMode: true,
    slidesToShow: 3,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {props.documents.map((doc) => (
          <div key={doc.id}>
            <CardDocument
              document={doc}
              toEdit={function (): void {
                throw new Error("Function not implemented.");
              }}
              toEditPos={function (): void {
                throw new Error("Function not implemented.");
              }}
              showMapButton={true}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ControlledCarousel;
