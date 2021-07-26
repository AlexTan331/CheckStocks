import { Fragment, useState } from "react";
import styles from "./typeAhead.module.scss";

export default function TypeAhead({ suggestions }) {
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState("");

  const onChange = (evt) => {
    const value = evt.currentTarget.value;
    console.log(value);
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
    console.log("here");
    setUserInput(filteredSuggestions[index].symbol);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestion(0);
  };

  const onKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      setActiveSuggestion(0);
      setShowSuggestions(false);

      if (evt.currentTarget.value)
        setUserInput(filteredSuggestions[activeSuggestion].symbol);
    } else if (evt.keyCode === 38) {
      if (activeSuggestion === 0) return;
      setActiveSuggestion(activeSuggestion - 1);
    } else if (evt.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) return;
      setActiveSuggestion(activeSuggestion + 1);
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
      <div className="input-group mb-3">
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
            className={`btn btn-outline-secondary ${
              userInput ? "" : "disabled"
            }`}
            type="button"
          >
            Search
          </button>
        </div>
      </div>
      {suggestionsListComponent}
    </Fragment>
  );
}
