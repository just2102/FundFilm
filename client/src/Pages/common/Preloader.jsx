import spinner from "../../assets/Spinner-0.6s-200px.svg"

const Preloader = ({loadingText}) => {
    return ( 
        <div className="preloader">
            <img src={spinner} alt="preloader" />
            <p>{loadingText && loadingText}</p>
        </div>
     );
}
 
export default Preloader;