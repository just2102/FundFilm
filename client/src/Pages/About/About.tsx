import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.about}>
      <h1>About FundFilmDAO</h1>
      <p>
        This service is intended for movie creators to raise funds for their
        projects
      </p>
      <h2>OUR GOAL</h2>
      <p>
        is to connect moviemakers all over the world with their potential
        audience
      </p>

      <h2>WE BELIEVE</h2>
      <p>that realization of creative nature is of utmost importance</p>

      <h2>WE KNOW</h2>
      <p>
        that making movies takes time, assets, and effort, and this is why this
        project exists
      </p>

      <div className={styles.meta}>
        <p>
          It is deployed on{" "}
          <span style={{ fontStyle: "italic" }}>
            Sepolia (for testing purposes)
          </span>{" "}
          and <span style={{ fontStyle: "italic" }}>Polygon (mainnet)</span>
        </p>
        <p>
          <a href="https://github.com/just2102/" target="_blank">
            GitHub
          </a>
        </p>
      </div>
    </div>
  );
};

export default About;
