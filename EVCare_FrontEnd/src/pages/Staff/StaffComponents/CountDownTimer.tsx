// import React, { useEffect, useState } from "react";

// type CountdownTimerProps = {
//   onTimeUp: () => void;
// };
// const CountdownTimer = ({ onTimeUp }: CountdownTimerProps) => {
//   const [time, setTime] = useState<number>(600);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTime((prevTime) => {
//         if (prevTime <= 0) {
//           clearInterval(interval);
//           // onTimeUp();
//           return 0;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const formatTime = (seconds: number) => {
//     const minutes: number = Math.floor(seconds / 60);
//     const remainingSeconds: number = seconds % 60;
//     return `${String(minutes).padStart(2, "0")}:${String(
//       remainingSeconds
//     ).padStart(2, "0")}`;
//   };

//   return (
//     <div>
//       <h4 style={{ color: "red" }}>{formatTime(time)}</h4>
//     </div>
//   );
// };

// export default CountdownTimer;
