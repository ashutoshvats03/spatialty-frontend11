// "use client";
// import { useEffect, useState, React } from 'react'
// import RoadFurniture from './components/RoadFurniture'
// import StreetLight from './components/StreetLight'
// import axios from 'axios';
// import {useRouter} from "next/navigation"

// function page() {
//     const router = useRouter();
//     const [array1, setArray1] = useState(null);
//     const [array2, setArray2] = useState(null);
//     const [isMounted, setIsMounted] = useState(false);

//     useEffect(() => {
//         if (data !== null) {
//             const a1 = JSON.parse(data).Road_Furniture;
//             const a2 = JSON.parse(data).Street_Light;
//             setArray1(a1);
//             setArray2(a2);
//             setIsMounted(true);
//         }
//         else{
//             router.push("/")
//         }

//     }, []);
//     if (!isMounted) {
//         return <div>Loading vegetation</div>;
//     }
//     return (
//         <div className='w-full h-[400px] flex flex-col gap-24 my-20'>
//             {array1 && array2 && (
//                 <>
//                     <RoadFurniture array={array1} />
//                     <StreetLight array={array2} />
//                 </>
//             )}


//         </div>
//     )
// }

// export default page
"use client";
import { useEffect, useState , useContext } from 'react';
import Plantation from "./components/plantation";
import Signage from "./components/signage";
import StreetLight from "./components/StreetLight";
import AuthContext from "../../context/AuthContext";
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter();
  const [array1, setArray1] = useState(null);
  const [array2, setArray2] = useState(null);
  const [array3, setArray3] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Signage");

  const { data } = useContext(AuthContext);
  useEffect(() => {
    const dataSet = data;
    if (dataSet) {
      const a1 = dataSet.Road_Furniture;
      const a2 = dataSet.Street_Light;
      const a3 = dataSet.plantation;

      setArray1(a1);
      setArray2(a2);
      setArray3(a3);
      setIsMounted(true);
    }
    else {
      router.push("/")
    }

  }, []);

  return (
    <div>
      <div className='w-full relative'>
        <div
          className=" absolute right-[42%] text-xl text-black top-12 mx-16 mb-5 border border-slate-500 rounded-md">
          <select
             className=" w-full py-1 px-2"
            name="Road_furniture"
            onChange={(e) => { setSelectedValue(e.target.value) }}
          >
            <option value="Signage">Signage</option>
            <option value="Street_Light">Street Light</option>
            <option value="plantation">Plantation</option>
          </select>
        </div>
        {array1 && array2 && array3 && (
          <div className="w-full">
            {selectedValue === "Signage" && <Signage array={array1} className="w-full h-full" />}
            {selectedValue === "Street_Light" && <StreetLight array={array2} className="w-full h-full" />}
            {selectedValue === "plantation" && <Plantation array={array3} className="w-full h-full" />}
          </div>
        )}
      </div>
    </div>
  )
}

export default Page





// "use client";
// import React from 'react'
// import RoadFurniture from './components/RoadFurniture'
// import StreetLight from './components/StreetLight'
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// function page() {
//     const [array1, setArray1] = useState(null);
//     const [array2, setArray2] = useState(null);

//     if(data!==null){
//         setArray1(JSON.parse(data).Road_Furniture);
//         setArray2(JSON.parse(data).Street_Light);
//     }
//     else{
//         return <div>Loading vegetation</div>
//     }
//     return (
//         <div className='w-full h-[400px] flex flex-col gap-24 my-20'>
//             {array1 && array2 && (
//                 <>
//                     <RoadFurniture array={array1} />
//                     <StreetLight array={array2} />
//                 </>
//             )}


//         </div>
//     )
// }

// export default page
