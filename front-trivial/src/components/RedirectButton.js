import React from 'react';

const RedirectButton = () => {
  const clientId='91cd54bbe219843f9951e1d539fce905';
  const clientSecret='0736d5e5c93e13c4f57736145298e99b2b33f192';
  const redirectUrl = `http://www.wikidata.org/wiki/Special:OAuth/authorize?client_id=${clientSecret}&response_type=code&scope=edit+upload+review&state=102938n`;

  const handleButtonClick = () => {
    window.location.href = redirectUrl;
  };

  return (
    <button onClick={handleButtonClick}>Autorizarse en Wikidata</button>
  );
};

export default RedirectButton;
