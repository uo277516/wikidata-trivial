import React from 'react';

const RedirectButton = () => {
  const consumerToken='9710c01964941c18292d69c3cd033af2';
  const secretToken='7d61936d0335c9443f3a041812a25bc948ef29b8';
  const callBack='http://localhost:3000/';
  const redirectUrl = `https://www.mediawiki.org/wiki/Special:OAuth/authorize?oauth_token=${consumerToken}&oauth_consumer_key=${secretToken}&callback=${callBack}`;


  //https://www.mediawiki.org/wiki/Special:OAuth/authorize?oauth_token=6996a5f52ee9653beade27601db9f32f&oauth_consumer_key=a69a26c7ac26e7120969ba20cbda9665&callback=https%3A%2F%2Fwikidata-game.toolforge.org%2Fapi.php

  const handleButtonClick = () => {
    window.location.href = redirectUrl;
  };

  return (
    <button onClick={handleButtonClick}>Autorizarse en Wikidata</button>
  );
};

export default RedirectButton;
