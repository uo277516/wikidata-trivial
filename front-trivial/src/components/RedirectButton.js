import React from 'react';

const RedirectButton = () => {
  const clientId='91cd54bbe219843f9951e1d539fce905';
  const redirectUrl = `http://www.wikidata.org/wiki/Special:OAuth/authorize?client_id=${clientId}&response_type=code&scope=edit+upload+review&state=102938n`;

  const handleButtonClick = () => {
    window.location.href = redirectUrl;
  };

  return (
    <button onClick={handleButtonClick}>Autorizarse en Wikidata</button>
  );
};

export default RedirectButton;
