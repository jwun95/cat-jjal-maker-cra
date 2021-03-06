import logo from "./logo.svg";
import React from "react";
import "./App.css";
import Title from "./components/Title";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

function CatItem({ img }) {
  return (
    <li>
      <img
        src={img}
        alt="cat-image"
        style={{ width: "150px", border: "1px solid red" }}
      />
    </li>
  );
}

const MainCard = (props) => {
  const heartIcon = props.alreadyFavorite ? "π" : "π€";

  return (
    <div className="main-card">
      <img src={props.img} alt="cat-image" width={props.width} />
      <button onClick={props.onHeartClick}>{heartIcon}</button>
    </div>
  );
};

function Favorite({ favorites }) {
  if (favorites.length === 0) {
    return <div>μ¬μ§ μ ννΈλ₯Ό λλ¬ κ³ μμ΄ μ¬μ§μ μ μ₯ν΄λ΄μ!</div>;
  }

  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}

const Form = ({ updateMainCat }) => {
  const includesHangul = (text) => /[γ±-γ|γ-γ£|κ°-ν£]/i.test(text);
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleInputChange(e) {
    const userValue = e.target.value;
    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("νκΈμ μλ ₯ν  μ μμ΅λλ€.");
    }
    setValue(e.target.value.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (value === "") {
      setErrorMessage("λΉ κ°μΌλ‘ λ§λ€ μ μμ΅λλ€.");
      return;
    }
    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="μμ΄ λμ¬λ₯Ό μλ ₯ν΄μ£ΌμΈμ"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">μμ±</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};

const App = () => {
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 =
    "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });

  const [image, setImage] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });

  const alreadyFavorite = favorites.includes(image);

  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    setImage(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);
    setImage(newCat);
    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, image];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  const mainTitle = counter
    ? `${counter}λ²μ§Έ κ³ μμ΄ κ°λΌμ¬λ`
    : "κ³ μμ΄ κ°λΌμ¬λ";
  // const counterTitle = counter === null ? "" : counter + "λ²μ§Έ ";

  return (
    <div>
      <Title>{mainTitle}</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={image}
        alt="cat-image"
        width="300"
        onHeartClick={handleHeartClick}
        alreadyFavorite={alreadyFavorite}
      />
      <Favorite favorites={favorites} />
    </div>
  );
};

export default App;
