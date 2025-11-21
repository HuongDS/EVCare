import styled from "styled-components";

export const StyledWrapper = styled.div`
  span {
    font-family: "Outfit", sans-serif;
  }
  .popup {
    --burger-bg: transparent;
    --burger-color: #00ad4e;
    --burger-hover-bg: #e6f7ee;
    --burger-diameter: 2.8em;
    --burger-btn-border-radius: 99px;
    --nav-padding-x: 0.5em;
    --nav-padding-y: 0.5em;
    --nav-border-radius: 16px;
    --nav-bg: rgba(255, 255, 255, 0.9);
    --nav-border-color: rgba(0, 0, 0, 0.1);
    --nav-shadow-color: rgba(0, 0, 0, 0.1);
    --nav-shadow-width: 0 8px 20px;
    --nav-default-scale: 0.8;
    --nav-active-scale: 1;
    --nav-title-color: #777;
    --nav-title-size: 0.75em;
    --nav-title-padding-x: 1rem;
    --nav-title-padding-y: 0.25em;
    --nav-button-padding-x: 1rem;
    --nav-button-padding-y: 0.6em;
    --nav-button-border-radius: 8px;
    --nav-button-font-size: 16px;
    --nav-button-hover-bg: linear-gradient(135deg, #00c656 0%, #00ad4e 100%);
    --nav-button-hover-text-color: #fff;
    --nav-button-distance: 0.875em;
    --underline-border-width: 1px;
    --underline-border-color: rgba(0, 0, 0, 0.1);
    --underline-margin-y: 0.5em;
    --burger-line-width: 1em;
    --burger-line-height: 0.1em;
    --burger-offset: 0.625em;
    --burger-line-border-radius: 0.1875em;
    --burger-line-transition: 0.3s;
    --burger-transition: all 0.3s ease-in-out;
    --burger-hover-scale: 1.05;
    --burger-active-scale: 0.95;
    --burger-enable-outline-color: var(--burger-bg);
    --burger-enable-outline-width: 0.125em;
    --burger-enable-outline-offset: var(--burger-enable-outline-width);
    --nav-font-family: "Outfit", sans-serif;
    --nav-position-left: 0;
    --nav-position-right: unset;
  }

  .popup {
    display: inline-block;
    text-rendering: optimizeLegibility;
    position: relative;
  }

  .popup input {
    display: none;
  }

  .burger {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    background: var(--burger-bg);
    width: var(--burger-diameter);
    height: var(--burger-diameter);
    border-radius: var(--burger-btn-border-radius);
    border: none;
    cursor: pointer;
    overflow: hidden;
    transition: var(--burger-transition);
    outline: var(--burger-enable-outline-width) solid transparent;
    outline-offset: 0;
  }

  .burger svg {
    color: var(--burger-color);
    fill: currentColor;
    transition: all 0.25s ease-out;
    height: 24px;
    width: 24px;
  }

  .popup-window {
    transform: scale(var(--nav-default-scale));
    visibility: hidden;
    opacity: 0;
    position: absolute;
    padding: var(--nav-padding-y) var(--nav-padding-x);
    background: var(--nav-bg);
    font-family: var(--nav-font-family);
    border-radius: var(--nav-border-radius);
    box-shadow: var(--nav-shadow-width) var(--nav-shadow-color);
    border: var(--nav-border-width) solid var(--nav-border-color);
    top: calc(var(--burger-diameter) + 15px);
    right: -10px;
    transition: var(--burger-transition);
    z-index: 1000;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .popup-window legend {
    padding: var(--nav-title-padding-y) var(--nav-title-padding-x);
    margin: 0;
    color: var(--nav-title-color);
    font-size: var(--nav-title-size);
    text-transform: uppercase;
    font-weight: 600;
  }

  .popup-window ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .popup-window ul button {
    outline: none;
    width: 100%;
    border: none;
    background: none;
    display: flex;
    align-items: center;
    color: #2d3748;
    font-size: var(--nav-button-font-size);
    padding: var(--nav-button-padding-y) var(--nav-button-padding-x);
    white-space: nowrap;
    border-radius: var(--nav-button-border-radius);
    cursor: pointer;
    column-gap: var(--nav-button-distance);
    transition: all 0.25s ease-out;
  }

  .popup-window ul button svg {
    color: var(--burger-color);
    transition: all 0.25s ease-out;
  }

  .popup-window ul li:last-child button {
    color: #e53e3e;
  }
  .popup-window ul li:last-child button svg {
    color: #e53e3e;
  }

  .popup-window hr {
    margin: var(--underline-margin-y) 0;
    border: none;
    border-bottom: var(--underline-border-width) solid
      var(--underline-border-color);
  }

  /* actions */

  .popup-window ul button:hover,
  .popup-window ul button:focus-visible {
    color: var(--nav-button-hover-text-color);
    background: var(--nav-button-hover-bg);
    transform: scale(1.03);
  }

  .popup-window ul button:hover svg,
  .popup-window ul button:focus-visible svg {
    color: var(--nav-button-hover-text-color);
  }

  .popup-window ul li:last-child button:hover,
  .popup-window ul li:last-child button:focus-visible {
    background: #fef2f2;
    color: #c53030;
  }
  .popup-window ul li:last-child button:hover svg,
  .popup-window ul li:last-child button:focus-visible svg {
    color: #c53030;
  }

  .burger:hover {
    transform: scale(var(--burger-hover-scale));
    background: var(--burger-hover-bg);
  }

  .burger:active {
    transform: scale(var(--burger-active-scale));
  }

  .burger:focus:not(:hover) {
    outline-color: var(--burger-enable-outline-color);
    outline-offset: var(--burger-enable-outline-offset);
  }

  /* (Giữ nguyên logic của checkbox) */
  .popup input:checked + .burger span:nth-child(1) {
    /* ... */
  }
  .popup input:checked + .burger span:nth-child(2) {
    /* ... */
  }
  .popup input:checked + .burger span:nth-child(3) {
    /* ... */
  }

  .popup input:checked ~ nav {
    transform: scale(var(--nav-active-scale));
    visibility: visible;
    opacity: 1;
  }
`;
