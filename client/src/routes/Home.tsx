import { useNavigate } from "react-router-dom";
import "../styles/Home.scss";

const Home = () => {
  const nav = useNavigate();
  return (
    <body className="home-body">
      <div className="home">
        <div className="header">
          {/* Titolo sulla sinistra */}
          <div className="hero-title">
            <h1>Kiruna eXplorer.</h1>
          </div>

          {/* Info + bottoni sulla destra */}
          <div className="info">
            <h4>
              Discover the city that is shifting to become UNESCO heritage in
              2029.
            </h4>
            <p>
              Explore the map, discover the details of the buildings and follow
              the entire transformation of the city.
            </p>
            <div className="hero-btns">
              <button onClick={() => nav("/map")}>View Map</button>
              <button onClick={() => nav("/diagram")}>View Diagram</button>
            </div>
          </div>
        </div>

        <div className="hero-content">
          <div className="login-card">
            <h2>Are you an Urban Planner?</h2>
            <button className="urb-login" onClick={() => nav("/login")}>
              Login
            </button>
          </div>
          <div className="features-cards">
            <div className="map-feature">
              <span className="material-symbols-outlined">map</span>
              <h3>View Documents Directly on the Map</h3>
              <p>
                Effortlessly explore building plans, historical data, and future
                projections directly on the map. No more switching
                tabs—everything you need is just a click away for a seamless and
                immersive experience.
              </p>
            </div>
            <div className="edit-feature">
              <span className="material-symbols-outlined">edit_document</span>
              <h3>Edit Documents</h3>
              <p>
                Update, adjust, and refine documents in real-time with our Edit
                Document feature. Make changes directly within the platform,
                ensuring accuracy and efficiency without interruptions. Stay in
                control and keep your work seamless.
              </p>
            </div>
            <div className="diagram-feature">
              <span className="material-symbols-outlined">monitoring</span>
              <h3>Study Documents Using the Diagram</h3>
              <p>
                Visualize and study key documents like never before with our
                "Study Documents Using the Diagram" feature. Dive into detailed,
                interactive diagrams that bring clarity to complex data, making
                analysis easier and more intuitive.
              </p>
            </div>
            <div className="documents-feature">
              <span className="material-symbols-outlined">edit_location</span>
              <h3>Edit Documents Position</h3>
              <p>
                With our "Edit Document Position" feature, you can seamlessly
                reposition documents to align with your workflow. Organize,
                adjust, and fine-tune placements directly on the platform for a
                more efficient and customized experience.
              </p>
            </div>
          </div>
        </div>
        <footer>
          <div className="footer-container">
            <div className="footer-title">
              <h3>Kiruna eXplorer.</h3>
              <div className="footer-social">
                <a
                  href="https://github.com/umberto-fontanazza/kiruna-explorer"
                  target="_blank"
                  aria-label="GitHub Repository"
                >
                  <img src="../../public/github-mark.svg" alt="GitHub" />
                </a>
                <a
                  href="https://it.wikipedia.org/wiki/Kiruna"
                  target="_blank"
                  aria-label="Kiruna su Wikipedia"
                >
                  <img src="../../public/wikipedia-logo.svg" alt="Wikipedia" />
                </a>
                <a
                  href="https://www.instagram.com/umberto.fontanazza/"
                  target="_blank"
                  aria-label="Stavo facendo un po' di refactoring"
                >
                  <img src="../../public/ig-logo.svg" alt="Instagram" />
                </a>
              </div>
            </div>
            <p className="footer-credits">
              © 2024 Kiruna Explorer. Created by Group 15.
            </p>
          </div>
        </footer>
      </div>
    </body>
  );
};

export default Home;
