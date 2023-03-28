import "./About.css"

const About = () => {
    return ( 
        <div className="about">
            <h1>About FundFilm</h1>
            <p>This app is intended for movie directors to raise funds for their projects</p>
            <p>It is built using React, Redux, Solidity and Ethers.JS</p>
            <p>It is deployed on the <span style={{fontStyle:'italic'}}>Sepolia</span> testnet</p>
            <p>Feel free to take a look at my other projects on my <a href="https://github.com/just2102 " target="_blank">GitHub</a></p>
        </div>

     );
}
 
export default About;