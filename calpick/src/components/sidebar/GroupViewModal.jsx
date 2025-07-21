// import React, { useState } from "react";
// import closeIcon from "../../assets/closebtn.svg";

// export default function GroupViewModal({ onClose }) {
//   const [groupName] = useState("그룹1");
//   const [members, setMembers] = useState(["친구1", "친구2"]);
//   const [friends] = useState(["친구3", "친구4", "친구5"]);
//   const [selectedFriend, setSelectedFriend] = useState("");

//   const handleAddMember = () => {
//     if (selectedFriend && !members.includes(selectedFriend)) {
//       setMembers((prev) => [...prev, selectedFriend]);
//       setSelectedFriend("");
//     }
//   };

//   return (
//     <div
//       className="absolute top-[200px] left-[400px] z-50"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div className="bg-white w-[268px] shadow-sm border border-[#DDD] px-6 py-8 flex flex-col gap-4">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-bold">그룹</h2>
//           <button onClick={onClose}>
//             <img src={closeIcon} alt="닫기" className="w-[24px] h-[24px]" />
//           </button>
//         </div>

//         <input
//           value={groupName}
//           readOnly
//           className="border rounded-[10px] px-4 py-2 text-sm"
//         />

//         <p className="text-sm text-gray-500">
//           {members.map((m, i) => (
//             <span key={i}>
//               {m}
//               {i < members.length - 1 ? ", " : ""}
//             </span>
//           ))}
//         </p>

//         <hr />

//         <p className="text-sm font-medium">친구 초대</p>

//         <div className="flex flex-col gap-2">
//           {friends.map((friend, idx) => (
//             <label key={idx} className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 name="friend"
//                 value={friend}
//                 checked={selectedFriend === friend}
//                 onChange={() => setSelectedFriend(friend)}
//               />
//               <span>{friend}</span>
//             </label>
//           ))}
//         </div>

//         <button
//           onClick={handleAddMember}
//           className={`mt-2 py-2 rounded-[10px] font-semibold ${
//             selectedFriend
//               ? "bg-black text-white cursor-pointer"
//               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//           }`}
//           disabled={!selectedFriend}
//         >
//           초대하기
//         </button>
//       </div>
//     </div>
//   );
// }
