import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.about}>
      <h1>About FundFilm</h1>
      <p>This service is intended for movie creators to raise funds for their projects.</p>
      <h2>OUR GOAL</h2>
      <p>is to connect moviemakers all over the world with their potential audience.</p>
      <h2>WE BELIEVE</h2>
      <p>that realization of creative nature is of utmost importance.</p>
      <h2>WE KNOW</h2>
      <p>that making movies takes time, assets, and effort, and this is why the project exists.</p>

      <div className={styles.meta}>
        <div className={styles.networksInfo}>
          <h4>Supported Networks</h4>
          <p className={styles.network}>Polygon</p>
          <p className={styles.network}>Scroll</p>
          <p className={styles.network}>Sepolia</p>
        </div>
        <p>
          <a
            href='https://github.com/just2102/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Contribute
          </a>
        </p>
      </div>
    </div>
  );
};

export default About;
