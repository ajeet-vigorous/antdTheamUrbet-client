import React, { useEffect, useState } from "react";
import "./styles.css"; // Import your CSS here
import { NotificationManager } from "react-notifications";

export const CardsArray = [
  "2CC",
  "2DD",
  "2HH",
  "2SS",
  "3CC",
  "3DD",
  "3HH",
  "3SS",
  "4CC",
  "4DD",
  "4HH",
  "4SS",
  "5CC",
  "5DD",
  "5HH",
  "5SS",
  "6CC",
  "6DD",
  "6HH",
  "6SS",
  "7CC",
  "7DD",
  "7HH",
  "7SS",
  "8CC",
  "8DD",
  "8HH",
  "8SS",
  "9CC",
  "9DD",
  "9HH",
  "9SS",
  "10CC",
  "10DD",
  "10HH",
  "10SS",
  "ACC",
  "ADD",
  "AHH",
  "ASS",
  "JCC",
  "JDD",
  "JHH",
  "JSS",
  "KCC",
  "KDD",
  "KHH",
  "KSS",
  "QCC",
  "QDD",
  "QHH",
  "QSS",
];



















// import { CardsArray } from "../../../constants/vrtualAndarBaharConstant";
function shuffleCards(array) {
let shuffledArray = array.slice(); // Copy the array to avoid modifying the original one
for (let i = shuffledArray.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1)); // Get a random index
  [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
}
return shuffledArray;
}


const VirtualAndarBahar = () => {

const [timer, setTimer] = useState(60);
const [mainCard, setMainCard] = useState(null);
const [shownCard, setShownCard] = useState(null);
const[playingShuffledCard,setPlayingShuffledCard]= useState([])
const [winner, setWinner] = useState(null);
const [andarCards, setAndarCards] = useState([]);
const [baharCards, setBaharCards] = useState([]);
const [intervalId, setIntervalId] = useState(null);
const [isAndarTurn, setIsAndarTurn] = useState(true); // New state to alternate turns
const [availableCards, setAvailableCards] = useState(CardsArray); // Track available cards
const [isSliding, setIsSliding] = useState( {slide:false,
  position:"andar"});

// Function to reset the game
const resetGame = () => {
  setTimer(60);
  setMainCard(null);
  setShownCard(null);
  setWinner(null);
  setAndarCards([]);
  setBaharCards([]);
  clearInterval(intervalId);
  setIntervalId(null);
  setIsAndarTurn(true); 
 // Reset available cards
};

useEffect(() => {
  // Start the timer
  const timerId = setInterval(() => {
    setTimer((prev) => prev - 1);
  }, 1000);
  const shuffledCards = shuffleCards(CardsArray);

  setPlayingShuffledCard(shuffledCards)
  return () => clearInterval(timerId); // Clear timer when component unmounts
}, []);

// Set the main card when timer hits 50 seconds
useEffect(() => {
  if (timer === 50 && !mainCard) {
 
    const card = playingShuffledCard[0];
    setMainCard(card);
    // Remove the selected main card from the available cards
    setAvailableCards(
     
    );
  }
}, [timer, mainCard, availableCards]);

// Show Andar/Bahar cards one by one starting when the timer hits 40

useEffect(() => {
  if (timer < 50 && mainCard && timer >= 40) {
    if (!intervalId) {
      let currentIndex = 1; // Track the current card index in playingShuffledCard

      const id = setInterval(() => {
        // Select card one by one from playingShuffledCard using the currentIndex
        const selectedCard = playingShuffledCard[currentIndex];

        // Update the displayed card
        setShownCard(selectedCard);

        // Use functional state updates to ensure correct toggle behavior
        setIsAndarTurn((prevIsAndarTurn) => {
          if (prevIsAndarTurn) {
            setIsSliding({
              slide: true,
              position: "andar",
            });

            // Wait for 0.8 seconds before adding to AndarCards
            setTimeout(() => {
              setAndarCards((prev) => [...prev, selectedCard]);
            }, 800);
          } else {
            setIsSliding({
              slide: true,
              position: "bahar",
            });

            // Wait for 0.8 seconds before adding to BaharCards
            setTimeout(() => {
              setBaharCards((prev) => [...prev, selectedCard]);
            }, 800);
          }

          // Check if the selected card matches the main card (based on the first letter)
          if (selectedCard[0] === mainCard[0]) {
            clearInterval(id); // Stop the interval for card distribution
           

            // Declare the winner based on where the card was placed
            setTimeout(() => {
              setIsSliding({
                slide: false,
              });
              if (prevIsAndarTurn) {
                setWinner("Andar"); // If it was Andar's turn when the match happened
              } else {
                setWinner("Bahar"); // If it was Bahar's turn when the match happened
              }
            }, 800); // 800 ms delay to match the card placement
          
          }

          // Increment the currentIndex for the next card
          currentIndex++;

          // Check if we've reached the end of the playingShuffledCard array
          if (currentIndex >= playingShuffledCard.length) {
            clearInterval(id); // Stop the interval if all cards are used
          }

          // Return the opposite turn to toggle
          return !prevIsAndarTurn;
        });
      }, 1000); // Show cards every second

      setIntervalId(id);
    }
  }
}, [timer, mainCard, intervalId, playingShuffledCard]);



// Reset game after a winner is declared
useEffect(() => {
  if (winner) {
    const shuffledCards = shuffleCards(CardsArray);

    setPlayingShuffledCard(shuffledCards)
    setTimeout(() => {
      setTimeout(resetGame, 5000); // Reset game after 5 seconds
    }, 0);
  }
}, [winner]);

const handleBetClick = ()=>{

  NotificationManager.error("Bets Coming sson", "error", 1000, () => {
    alert("callback");
  });
}

// const renderCards = (cards, isAndar) => {
//   return cards.map((item, index) => {
//     const groupIndex = Math.floor(index / 8);
//     const cardIndexInGroup = index % 8;

//     return (
//       <div
//         key={groupIndex}
//         style={{
//           margin: isAndar ? (groupIndex > 0 ? "-40px" : "0px") : undefined,
//           marginTop: !isAndar
//             ? groupIndex > 0
//               ? "-40px"
//               : "0px"
//             : undefined,
//         }}
//       >
//         {cards
//           .slice(groupIndex * 8, (groupIndex + 1) * 8)
//           .map((card, cardIndex) => (
//             <img
//               key={cardIndex}
//               alt={`Card ${cardIndex + 1}`}
//               style={{
//                 position: "absolute",
//                 left: `${cardIndex * 25 + 30}px`,
//                 top: isAndar ? `${groupIndex * 30}px` : undefined,
//                 bottom: !isAndar ? `${groupIndex * 30}px` : undefined,
//                 borderRadius: "3px",
//               }}
//               src={`/cards/${card}.png`}
//               className="andarbaharcard"
//             />
//           ))}
//       </div>
//     );
//   });
// };





return (
  <div>
    <div id="game" data-id=""></div>
    <div id="sound">
      <audio autoPlay>
        <source src="../../../sounds/click.mp3" type="audio/mpeg" />
        <embed hidden autoStart="true" loop={false} src="click.mp3" />
      </audio>
    </div>

    <div className="flash-outer">
      <div className="flash-cell">
        <div className="ab-flash">
          <p className="win">---</p>
        </div>
      </div>
    </div>

    <div className="ab-container">
      <div className="flash-box hide">
        <div className="flash-msg">
          <div className="msg">Insufficient Coins</div>
          <div className="alert-close">❌</div>
        </div>
      </div>

      <div className="ab-cell">
        <div className="ab-inner">
          <div className="back-pull-left">
            {/* <a className="back-button" onClick={() => window.history.back()}>
              <img alt="Image Description" className="img-back" src="/andarBahar/back-b0485badb807c2e15ac9934a5fd20d6b.svg" />
            </a> */}
          </div>
          <div className="audio-pull-right">
            <div id="infoToggler-io">
              <img
                title="Sound ON"
                src="/AndarBahar/sound-on-111.png"
                className="check-display"
                alt=""
              />
              <img
                title="Sound OFF"
                src="/AndarBahar/sound-off-1.png"
                style={{ display: "none" }}
                alt=""
              />
            </div>
          </div>
          <h1 className="ab-title">
            <img
              alt="Andar bahar"
              src="/AndarBahar/andar-bahar-5ba93fdad8f69b1bee937ea11771dd4a.png"
            />
          </h1>

          <div style={{ textAlign: "center", marginBottom: "5px" }}>
            <div className="ab-d">
              You Won:{" "}
              <span className="match_winnings" data-match_winnings="0">
                0
              </span>
              /-
            </div>
          </div>

          <img
            alt="Cards"
            className="preload"
            src="/AndarBahar/cards-26c80d039ad311f6e15aff83b874ba0f.png"
          />

          <div className="gx-d-md-flex gx-d-block">
            <div
              id="card-table"
              style={{ position: "relative", border: "1px" }}
            >
              <>
                {andarCards.map((item, index) => {
                  const groupIndex = Math.floor(index / 8); // Calculate which group of 8 the card belongs to
                  const cardIndexInGroup = index % 8; // Get the index of the card within the group

                  return (
                    <div
                      key={groupIndex}
                      style={{
                        // position: "relative",
                        marginBottom: groupIndex > 0 ? "-40px" : "0px", // Adjust the margin to create slight overlap
                      }}
                    >
                      {/* Render only the cards that belong to this group */}
                      {andarCards
                        .slice(groupIndex * 8, (groupIndex + 1) * 8)
                        .map((card, cardIndex) => (
                          <img
                            key={cardIndex}
                            alt={`Card ${cardIndex + 1}`}
                            style={{
                              position: "absolute",
                              left: `${cardIndex * 25 + 30}px`, // Stagger the cards horizontally
                              top: `${groupIndex * 30}px`, // Adjust the vertical position for each row

                              borderRadius: "3px",
                            }}
                            src={`/cards/${card}.png`} // Example image source
                            className="andarbaharcard"
                          />
                        ))}
                    </div>
                  );
                })}
              </>
              <>
                {baharCards.map((item, index) => {
                  const groupIndex = Math.floor(index / 8); // Calculate which group of 8 the card belongs to
                  const cardIndexInGroup = index % 8; // Get the index of the card within the group

                  return (
                    <div
                      key={groupIndex}
                      style={{
                        // position: "relative",
                        marginTop: groupIndex > 0 ? "-40px" : "0px", // Adjust the margin to create slight overlap
                      }}
                    >
                     
                      {/* Render only the cards that belong to this group */}
                      {baharCards
                        .slice(groupIndex * 8, (groupIndex + 1) * 8)
                        .map((card, cardIndex) => (
                          <img
                            key={cardIndex}
                            alt={`Card ${cardIndex + 1}`}
                            style={{
                              position: "absolute",
                              left: `${cardIndex * 25 + 30}px`, // Stagger the cards horizontally
                              bottom: `${groupIndex * 30}px`, // Adjust the vertical position for each row

                              borderRadius: "3px",
                            }}
                            src={`/cards/${card}.png`} // Example image source
                            className="andarbaharcard"
                          />
                        ))}
                    </div>
                  );
                })}
              </>
              
              <div className="ab-bet-outer">
                <div className="andar-outer" data-runner="inside">
                  <div
                    className="ab-bet-holder andar-bet"
                    data-andar="0"
                    data-runner="inside"
                  >
                    <p className="bet-amt">0</p>
                  </div>
                  <img
                  onClick={()=>handleBetClick()}
                    alt="Andar"
                    className="place_bet"
                    src="/AndarBahar/andar-89496b756e4496982dcecd900352c2ca.png"
                  />
                </div>
                <div>
                {
isSliding.slide === true &&
<img
key={65545465}
alt={`Card ${65545465 + 1}`}
style={{
position: "absolute",
left: `${1 * 2 + 20}px`, // Initial horizontal position
top: "0", // Initial vertical position
transform: "translateY(-50%)", // Center vertically
borderRadius: "3px",
}}
className={`andarbaharcard ${isSliding.slide && isSliding.position === "andar" && "andarcardimg" } ${isSliding.slide && isSliding.position === "bahar" && "baharcardimg" }`} // Add animation class
src={`/AndarBahar/image.png`} // Example image source
/>
                }
                  {Array.from({ length: 10 }).map((_, index) => (
                    <img
                      key={index}
                      alt={`Card ${index + 1}`}
                      style={{
                        position: "absolute",
                        left: `${index * 2 + 20}px`,
                        top: "50%", // Offset the cards vertically
                        transform: "translateY(-50%)",
                        borderRadius: "3px",
                        // height: cardHeight,
                      }}
                      className="andarbaharcard"
                      src={`/AndarBahar/image.png`} // Example image source
                    />
                  ))}

                  {mainCard && (
                    <img
                      alt={`Card`}
                      style={{
                        position: "absolute",
                        left: `150px`,
                        top: "50%", // Offset the cards vertically
                        transform: "translateY(-50%)",

                        borderRadius: "3px",
                        // height: cardHeight,
                      }}
                      className="andarbaharcard"
                      src={`/cards/${mainCard}.png`} // Example image source
                    />
                  )}
                </div>
                {winner && (
                  <div
                    className="gx-d-flex gx-justify-content-center gx-align-items-center"
                    style={{
                      width: "150px",
                      height: "150px",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      zIndex: "1000",
                      border: "2px solid teal",
                      transform: "translateY(-50%) translateX(-50%)",
                      background: "teal",
                      fontSize: "30px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {winner}
                  </div>
                )}

                <div className="bahar-outer" data-runner="outside">
                  <div
                 
                    className="ab-bet-holder bahar-bet"
                    data-bahar="0"
                    data-runner="outside"
                  >
                    <p className="bet-amt">0</p>
                  </div>
                  <img
                   onClick={()=>handleBetClick()}
                    alt="Bahar"
                    className="place_bet"
                    src="/AndarBahar/bahar-0f11282f32400a86f03e71c66dd56cc9.png"
                  />
                </div>
              </div>
            </div>

            <div className="ab-chip-outer">
              <ul className="ab-chip-ul">
                <li>
                  <div onClick={()=>handleBetClick()} className="li-cell">
                    <div className="chip-box c-purple" data-chip="100"></div>
                  </div>
                </li>
                <li>
                  <div onClick={()=>handleBetClick()} className="li-cell">
                    <div
                      className="chip-box c-sky active-chip"
                      data-chip="500"
                    ></div>
                  </div>
                </li>
                <li>
                  <div onClick={()=>handleBetClick()} className="li-cell">
                    <div className="chip-box c-marun" data-chip="1000"></div>
                  </div>
                </li>
                <li>
                  <div onClick={()=>handleBetClick()} className="li-cell">
                    <div className="chip-box c-red" data-chip="2000"></div>
                  </div>
                </li>
                <li>
                  <div onClick={()=>handleBetClick()} className="li-cell">
                    <div className="chip-box c-blue" data-chip="5000"></div>
                  </div>
                </li>
                <li>
                  <div onClick={()=>handleBetClick()} className="li-cell">
                    <div className="chip-box c-pink" data-chip="10000"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="clear"></div>

          <div className="ab-detail">
            <div className="flex-1 l-detail">
              <div className="ab-d ab-counter">
                Counter : <span className="counter">{timer}</span>
              </div>
              <div className="ab-d ab-clear disable-clear-bet">
                Clear Bets
              </div>
            </div>
            <div className="flex-1 r-detail">
              <div className="ab-d ab-total" data-total="0">
                Total Bet : <span id="totalBet">0</span>/-
              </div>
              <div className="ab-d ab-bal">
                Coins : <span className="available_coins">50</span>/-
              </div>
            </div>
          </div>

          <div className="equalHWrap eqWrap">
            <div className="equalH ab-d">
              Last Won : <span className="match_winnings">0.0</span> /-
            </div>
            <div id="last-10" className="equalH ab-d">
              <span>Last 10 Win Sides : </span>
              <span className="last_n_winners"></span>
            </div>
            <div id="last-5" className="equalH ab-d hide">
              <span>Last 5: </span>
              <span className="last_5_winners"></span>
            </div>
          </div>

          <div className="equalHWrap eqWrap">
            <div
              className="equalH ab-d open-history"
              id="open-Modal"
              data-game-type="inside_outside"
              style={{ pointerEvents: "auto" }}
            >
              Game History
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Modal for game history */}
    {/* <div id="gameModal" className="modalHistory">
      <div className="history-modal-content">
        <span className="close-history-modal">
          <i className="fa fa-window-close" style={{ fontSize: '24px' }}></i>
        </span>
        <div className="modal-body">
          <div className="modal-container">
            <div className="btn-sec flex">
              <div className="game-btn btn flex-1-game-history c-align checked modal-section">
                <label><button data-button-id="game-history">GAME HISTORY</button></label>
              </div>
              <div className="rules-btn btn flex-1-game-history c-align modal-section">
                <label><button data-button-id="game-rules">RULES</button></label>
              </div>
            </div>

            <div className="modal-content-sec">
              <table className="g-history-sec sec game-history-table" id="gameHistoryTable">
                <thead>
                  <tr>
                    <th>S.NO</th>
                    <th>Match ID</th>
                    <th>Winner</th>
                    <th>PLAY</th>
                    <th>WIN</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
              <div className="rules-sec sec hide">
                <h2>Rules</h2>
                <p>Inside Outside game is based on the randomly generated numbers...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> */}
  </div>
);
};

export default VirtualAndarBahar;

// useEffect(() => {
//   SocketIOConnect();
// }, []);

// const SocketIOConnect = () => {
//   const socket = io("wss://urbet.in", { transports: ["websocket"] });
//   socket.on("connect", () => {
//     socket.emit("andarbahar", {});

//     socket.on("andarbahar", (data) => {
//       processInsideOutsideLotteryMessages(data);
//     });

//     socket.on("disconnect", () => {
//       socket.off("andarbahar");
//     });
//   });
// };

// const processInsideOutsideLotteryMessages = (obj) => {
// if (obj.type === 'inside_outside') {
//   processInsideOutsideGame(obj);
// }
// if (obj.type === 'inside_outside_counter') {
//   updateBettingPanel(obj);
// }
// if (obj.type === 'inside_outside_winner') {
//   showLastWinners(obj.last_n_winners);
// }
// if (obj.counter < 1) {
//   fetchUserMatchDetails(obj.match_id);
// }
// };
