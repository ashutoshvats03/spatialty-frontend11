"`use client"
import { useAppSelector } from "@/app/redux/hooks";
import { useEffect, useState , useContext } from 'react';
import { useDispatch } from "react-redux";
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import AuthContext from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";


export default function Example({ array }) {
    const dispatch = useDispatch();
    const mapSide = useAppSelector((state) => state.mapSide.mapSide);
    const project = useAppSelector((state) => state.project.project);
    const [info, setinfo] = useState(false)
    const [LHS_chainage, setLHSChainage] = useState([]);
    const [RHS_chainage, setRHSChainage] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    const [Upperlimit_RHS, setUpperlimit_RHS] = useState(RHS_chainage[Math.floor(RHS_chainage.length / 8)]);
    const [Lowerlimit_RHS, setLowerlimit_RHS] = useState(RHS_chainage[0]);
    const [Upperlimit_LHS, setUpperlimit_LHS] = useState(LHS_chainage[Math.floor(LHS_chainage.length / 8)]);
    const [Lowerlimit_LHS, setLowerlimit_LHS] = useState(LHS_chainage[0]);
    const [LowerLimit, setLowerLimit] = useState("dfnvc")
    const [UpperLimit, setUpperLimit] = useState("djj")
    const { data } = useContext(AuthContext);
    const router = useRouter();
    useEffect(() => {
        const dataSet = data;
        if (dataSet) {
            setLHSChainage(dataSet.RF_chainage || []);
            setRHSChainage(dataSet.RF_chainage || []);
            setIsMounted(true);
        }
        else {
            router.push("/")
        }

    }, []);


    useEffect(() => {
        if (LHS_chainage.length > 0) {
            setLowerlimit_LHS(LHS_chainage[0]);
            setUpperlimit_LHS(LHS_chainage[Math.floor(LHS_chainage.length / 16)]);
        }
    }, [LHS_chainage]);

    useEffect(() => {
        if (RHS_chainage.length > 0) {
            setLowerlimit_RHS(RHS_chainage[0]);
            setUpperlimit_RHS(RHS_chainage[Math.floor(RHS_chainage.length / 8)]);
        }
    }, [RHS_chainage]);  // Runs when RHS_chainage updates

    useEffect(() => {
        if (mapSide === "LHS") {
            setLowerLimit(Lowerlimit_LHS)
            setUpperLimit(Upperlimit_LHS)
        } else if (mapSide === "RHS") {
            setLowerLimit(Lowerlimit_RHS)
            setUpperLimit(Upperlimit_RHS)
        }
        setIsMounted(true);
    }, [mapSide, Lowerlimit_LHS, Upperlimit_LHS, Lowerlimit_RHS, Upperlimit_RHS]);


    if (!isMounted) {
        return <div>Loading pavement distreess</div>;
    }

    const handleLowerlimitLHS = (e) => {
        setLowerlimit_LHS(e.target.value);
    }
    const handleUpperLimitLHS = (e) => {
        setUpperlimit_LHS(e.target.value);
    }
    const handleLowerLimitRHS = (e) => {
        setLowerlimit_RHS(e.target.value);
    }
    const handleUpperLimitRHS = (e) => {
        setUpperlimit_RHS(e.target.value);
    }

    const newData = array
        .filter((item) => item[0] >= LowerLimit)
        .filter((item) => item[0] <= UpperLimit)
        .map(([chainage, plantation]) => ({
            chainage,
            plantation: parseInt(plantation), // Convert string to number
        }));
    console.log("newData", newData);
    return (
        <div className=' p-10 mx-16   border-4  rounded-sm'>
            <div className="invisible font-bold text-2xl flex gap-2">
                <input type="checkbox" name="mapSide" value="LHS"  className="" />
                LHS
                <input type="checkbox" name="mapSide" value="RHS"  className="" />
                RHS
            </div>
            <div className="mt-5">
                <span
                    className=" text-black text-3xl font-extrabold cursor-pointer"
                    onClick={() => { info ? setinfo(false) : setinfo(true) }}
                >Info
                </span>
                <div className='flex gap-2'>
                    <select
                        className="rounded-lg px-3 py-1 bg-white text-black border"
                        onChange={mapSide === "LHS" ? handleLowerlimitLHS : handleLowerLimitRHS}
                    >
                        {mapSide === "LHS" ? LHS_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        )) : RHS_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        ))}
                    </select>
                    <select
                        className="rounded-lg px-3 py-1 bg-white text-black border"
                        onChange={mapSide === "LHS" ? handleUpperLimitLHS : handleUpperLimitRHS}
                    >
                        {mapSide === "LHS" ? LHS_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        )).reverse() : RHS_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        )).reverse()}
                    </select>
                </div>
            </div>
            <div className='relative m-5'>
                <div className={`  w-full h-[500px]  border-2 border-white  rounded-lg  ${info ? "opacity-10" : "opacity-100"}`}>
                    <ResponsiveContainer 
                    style={{
                        width:"100%",
                        height:"100%",
                        aspectRatio:"24/14"
                    }}>
                        <ScatterChart
                            margin={{
                                top: 40,
                                right: 40,
                                bottom: 80,
                                left: 0,
                            }}
                        >
                            <CartesianGrid />
                            <XAxis
                                dataKey="chainage"
                                name="chainage"
                                tick={{
                                    angle: -55,
                                    textAnchor: "end",
                                }}
                                stroke='black'
                            />
                            <YAxis
                                dataKey="plantation"
                                name="plantation"
                                stroke='black' />

                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter
                                name="A school"
                                data={array
                                    .filter((item) => item[0] >= LowerLimit)
                                    .filter((item) => item[0] <= UpperLimit)
                                    .map(
                                        ([chainage, plantation]) => ({
                                            chainage,
                                            plantation: parseInt(plantation), // Convert string to number
                                        })
                                    )}
                                fill="red" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
                <div className={`bg-transparent top-0 left-16  mt-5 ml-5 absolute flex-1 z-10  text-black font-bold text-4xl ${info ? "display" : "hidden"}`}>
                    Total number of shurbs : 9876
                </div>
            </div>
        </div>
    );
}

