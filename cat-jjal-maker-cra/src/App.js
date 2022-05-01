import React from "react";
import './App.css';
import JsonLocalStorage from "./components/JsonLocalStorage";
import Title from "./components/Title";
import FetchCat from './components/FetchCat';
import MainCard from "./components/MainCard";

  //폼 검증(form validation) : 사용자들이 폼을 쓸 때 일어나는 에러 케이스 검증
  const Form = ({ updateMainCat }) => {
      const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
      const [value, setValue] = React.useState(""); //input에 입력한 값
      const [errorMessage, setErrorMessage] = React.useState("");

      function handleInputChange(e) {
        const userValue = e.target.value;
        setErrorMessage("");
        if (includesHangul(userValue)) {
          setErrorMessage("한글은 입력할 수 없습니다.");
        }
        //toUpperCase = 소문자로 입력해도 대문자로 입력되게 함
        setValue(userValue.toUpperCase());
      }

      function handleFormSubmit(e) {
        //HTML기본 동작이 form전송하면 브라우저가 reflesh 되는게 기본 동작이라 그걸 막아줌
        e.preventDefault(); 
        setErrorMessage(""); //초기화

        if (value === "") {
          setErrorMessage("빈 값으로 만들 수 없습니다.");
          return;
        }
        updateMainCat(value);
      }

      return (
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="name"
            placeholder="영어 대사를 입력해주세요"
            value={value}
            onChange={handleInputChange}
          />
          <button type="submit">생성</button>
          <p style={{ color: "red" }}>{errorMessage}</p>
        </form>
      );
  };

  function CatItem(props) {
    //인라인 스타일링. style props를 넘기고, 원하는 Object를 key와 value로 적어주면 됨
    return (
      <li>
        <img src={props.img} style={{ width: "150px" }} alt="catImg" />
      </li>
    );
  }

  function Favorites({ favorites }) {
    //조건부 렌더링(Conditional Rendering)
    if(favorites.length === 0) {
      return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
    }

    return (
      <ul className="favorites">
        {favorites.map((cat) => (
          <CatItem img={cat} key={cat} />
        ))}
      </ul>
    );
  }

  const App = () => {
    //Form 컴포넌트의 counter 상태 끌어 올림(lifting state up)
    //함수형태로 코드를 짜서 return해주면 불필요하게 로컬스토리지에 접근하는 것을 막을 수 있음
    const [counter, setCounter] = React.useState(() => {
      return JsonLocalStorage.getItem("counter");
    });

    const [mainCat, setMainCat] = React.useState();
    
    const [favorites, setFavorites] = React.useState(() => {
      return JsonLocalStorage.getItem("favorites") || [];
    });

    //includes : js배열 API로 배열 안에 해당 값이 있는지 검색함
    const alreadyFavorite = favorites.includes(mainCat)

    //App진입 시 바로 API콜을 해서 API 데이터로 mainCat을 교체해주는 것
    async function setInitialCat() {
      const newCat = await FetchCat("First cat");
      setMainCat(newCat);
    }
    //[] : 이 함수가 불린 순간을 제한시킴. 컴포넌트가 맨 처음 생성될 때만 호출됨
    React.useEffect(()=> {
      setInitialCat();
    }, []);

    async function updateMainCat(value) {
      const newCat = await FetchCat(value);
      setMainCat(newCat);
      //미스메치 때문에 하나의 함수로 짜주는 것이 좋음 / prev(previus) : 기존 값
      setCounter((prev) => {
        const nextCounter = prev + 1;
        JsonLocalStorage.setItem("counter", nextCounter);
        return nextCounter;
      })
    }

    //React Name Convention : 이름을 handle어쩌고Click, handle어쩌고MouseOver
    function handleHeartClick() {
      //ES6+ 스프레드 오퍼레이터 문법
      const nextFavorites = [...favorites, mainCat];
      setFavorites(nextFavorites);
      JsonLocalStorage.setItem("favorites", nextFavorites);
    }

    const counterTitle = counter? counter+"번째":"";

    return (
      <div>
        <Title>{counterTitle} 고양이 가라사대</Title>
        <Form updateMainCat={updateMainCat} />
        <MainCard img={mainCat} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite}/>
        <Favorites favorites={favorites} />
      </div>
    );
  };

export default App;
