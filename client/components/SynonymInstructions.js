import React from 'react';

export default function SynonymInstructions() {
  const styles = {
    div: {
      backgroundColor: "#ffffff",
      height: "100%",
      width: "75%",
      color: '#2b282e',
      fontSize: 20,
      margin: "auto",
      borderRadius: 15,
      padding: 50,
    },
  };

  return (
    <div style={styles.div}>
      <h2>How to Play</h2>
      <p>There are five levels, with one word per level.</p>
      <p>You have 30 seconds to find all of the related words</p>
      <p>After time is up, or you find all the words, you proceed to the next level</p>
      <p>Click on a related word to gain a point</p>
      <p>Lose a point if you click on an incorrect word</p>
    </div>
  );
}
