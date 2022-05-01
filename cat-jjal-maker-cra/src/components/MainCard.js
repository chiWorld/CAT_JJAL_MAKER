//ES6+ 문법으로 props라는 이름 대신 {img}로 바로 내려받을 수 있음
const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
    const heartIcon = alreadyFavorite ? "💖" : "🤍";
    
    return (
        <div className="main-card">
        <img src={img} alt="고양이" width="400" />
        <button onClick={onHeartClick}>{heartIcon}</button>
        </div>
    );
};

export default MainCard;