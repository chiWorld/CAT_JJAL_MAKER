//로컬스토리지 - 브라우저에 데이터 저장하기 ( 7일까지 저장 가능)
const JsonLocalStorage = {
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
      return JSON.parse(localStorage.getItem(key));
    },
};

export default JsonLocalStorage;
  
