import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { getStockByNames, SYMBOL_REG_EXPRESS } from "../lib/stocks";
import styles from "./typeAhead.module.scss";

export default function TypeAhead({ suggestions }) {
  const router = useRouter();
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState("");

  const onChange = (evt) => {
    const value = evt.currentTarget.value;
    const filteredSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion.symbol.toUpperCase().indexOf(value.toUpperCase()) > -1
    );
    setUserInput(value);
    setFilteredSuggestions(filteredSuggestions);
    setShowSuggestions(true);
    setActiveSuggestion(0);
  };

  const onClick = (index) => {
    setUserInput(filteredSuggestions[index].symbol);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestion(0);
  };

  const onKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      setActiveSuggestion(0);
      setShowSuggestions(false);

      if (filteredSuggestions.length > 0)
        setUserInput(filteredSuggestions[activeSuggestion].symbol);
      else {
        setUserInput(evt.currentTarget.value);
      }
    } else if (evt.keyCode === 38) {
      if (activeSuggestion === 0) return;
      setActiveSuggestion(activeSuggestion - 1);
    } else if (evt.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) return;
      setActiveSuggestion(activeSuggestion + 1);
    }
  };

  const onSearch = async (evt) => {
    evt.preventDefault();

    if (SYMBOL_REG_EXPRESS.test(userInput) === false) {
      alert(
        "Ticker symbol should only contain letter. Please double check your input..."
      );
      return;
    }

    const data = await getStockByNames([userInput]);

    if (!data.length)
      alert("Sorry... There is no recorded information about this ticker.");
    else {
      router.push(`/stocks/${data[0].symbol.toLowerCase()}`);
    }
  };

  let suggestionsListComponent;

  if (showSuggestions && userInput) {
    if (filteredSuggestions.length) {
      suggestionsListComponent = (
        <div className={styles.dropdownContainer}>
          <ul className={styles.dropdownListContainer}>
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = styles.suggestionActive;
              }

              return (
                <li
                  className={`${styles.listItem} ${className}`}
                  key={index}
                  onClick={() => onClick(index)}
                >
                  {suggestion.symbol} -- {suggestion.name}
                </li>
              );
            })}
          </ul>
        </div>
      );
    } else {
      suggestionsListComponent = (
        <div className={styles.noSuggestions}>
          <em>No suggestions, you're on your own!</em>
        </div>
      );
    }
  }

  return (
    <Fragment>
      <div className={`input-group mb-3 ${styles.container}`}>
        <input
          type="text"
          className="form-control"
          placeholder="Enter ticker's symbol"
          aria-label="Enter ticker's symbol"
          onChange={(e) => onChange(e)}
          onKeyDown={(e) => onKeyDown(e)}
          value={userInput}
        />
        <div className="input-group-append">
          <button
            className={`btn btn-success ${userInput ? "" : "disabled"}`}
            type="button"
            onClick={(e) => onSearch(e)}
          >
            Search
          </button>
        </div>
      </div>
      {suggestionsListComponent}
    </Fragment>
  );
}
