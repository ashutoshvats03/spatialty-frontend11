"use client"
import { useAppSelector } from "@/app/redux/hooks";
import { setMapSide } from "@/app/redux/slices/mapSlice";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState , useContext } from "react";
import { useDispatch } from "react-redux";
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";
import AuthContext from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const chartConfig = {
    Double_arm: {
        label: "Double arm",
        color: "#FF6B6B", // Soft Red
    },
    Single_arm: {
        label: "Single arm",
        color: "#FF8C8C", // Light Coral
    },
    Solar_street: {
        label: "Solar street",
        color: "#E63946", // Deep Red
    },
    Solar_pole: {
        label: "Solar_pole",
        color: "#FF4D4D", // Bright Red
    },
    Solar_signal: {
        label: "Solar signal",
        color: "#FFA07A", // Light Salmon
    },
};


function RoadFurniture({ array }) {

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
    const [LowerLimit, setLowerLimit] = useState()
    const [UpperLimit, setUpperLimit] = useState()
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
            setUpperlimit_LHS(LHS_chainage[Math.floor(LHS_chainage.length / 8)]);
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

    const handleSliderChange = (e) => {
        dispatch(setMapSide(e.target.value));
    };

    console.log(LowerLimit, UpperLimit)
    console.log(array)
    return (
        <div className="p-10 mx-16 text-black  border-4 border-r-4 border-b-4 rounded-sm">
            <div className="font-bold text-2xl flex gap-2">
                <input type="checkbox" name="mapSide" value="LHS" checked={mapSide === "LHS"} onChange={handleSliderChange} className="" />
                LHS
                <input type="checkbox" name="mapSide" value="RHS" checked={mapSide === "RHS"} onChange={handleSliderChange} className="" />
                RHS
            </div>
            <div className="mt-5  ">
                <span
                    className="text-3xl font-extrabold cursor-pointer"
                    onClick={() => { info ? setinfo(false) : setinfo(true) }}
                >Info
                </span>
                <div className="flex gap-2">
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
                        {mapSide === "RHS" ? LHS_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        )).reverse() : RHS_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        )).reverse()}
                    </select>
                </div>
                {array[project] ? (
                    Object.keys(array[project][mapSide]).map((item, key) => (
                        <div key={key} className="m-5">
                            <div className="  text-black text-xl  ">
                                <div className="relative ">
                                    {Object.keys(array[project][mapSide][item]).map((subitem, subkey) => (
                                        <div
                                            key={subkey}>
                                            {subitem === "pieChart" && (
                                                <Card className={`bg-transparent absolute top-0 w-full z-10 border-2 border-black  ${info ? "display" : "hidden"}`}>
                                                    <CardContent className=" h-[500px]">
                                                        <ChartContainer
                                                            config={chartConfig}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                aspectRatio: "24/14"
                                                            }}
                                                        >
                                                            <PieChart
                                                                width={100}
                                                                height={100}
                                                                style={{
                                                                    color: "black",
                                                                    fontSize: "14px",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                <ChartTooltip
                                                                    content={
                                                                        <ChartTooltipContent
                                                                            className="bg-white text-red-600 font-extrabold text-[16px]"
                                                                            hideLabel
                                                                            formatter={(value, name, entry) =>
                                                                                `${chartConfig[entry.portion]?.label || name}:` + ` ${value}%`
                                                                            }
                                                                        />
                                                                    }
                                                                />
                                                                <Pie
                                                                    data={array[project][mapSide][item][subitem]["chartData"].map(
                                                                        ([portion, percentage]) => ({
                                                                            portion,
                                                                            percentage: parseFloat(percentage), // Convert string to number
                                                                        })
                                                                    )}
                                                                    dataKey="percentage"
                                                                    nameKey="portion"
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    outerRadius={120}
                                                                    innerRadius={0}
                                                                >
                                                                    {array[project][mapSide][item][subitem]["chartData"].map(
                                                                        ([portion], index) => (
                                                                            <Cell
                                                                                key={`cell-${portion}`}
                                                                                fill={chartConfig[portion]?.color || "gray"}
                                                                            />
                                                                        )
                                                                    )}
                                                                </Pie>

                                                            </PieChart>
                                                        </ChartContainer>
                                                    </CardContent>
                                                </Card>
                                            )}

                                            {subitem === "doubleBarChart" && (
                                                <Card className={` w-full h-full border-white  border-2  ${info ? "opacity-10" : "opacity-100"}`}>
                                                    <CardContent>
                                                        <div className="w-full h-[500px]">
                                                            <ChartContainer
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    aspectRatio: "24/14"
                                                                }}
                                                                config={chartConfig}
                                                            >
                                                                <LineChart
                                                                    accessibilityLayer
                                                                    data={array[project][mapSide][item][subitem]["chartData"]
                                                                        .filter((item) => item[0] >= LowerLimit)
                                                                        .filter((item) => item[0] <= UpperLimit)
                                                                        .map(
                                                                            ([chainage, Double_arm, Single_arm, Solar_street, Solar_pole, Solar_signal]) => ({
                                                                                chainage,
                                                                                Double_arm: parseInt(Double_arm, 10), // Convert string to number
                                                                                Single_arm: parseInt(Single_arm, 10), // Convert string to number
                                                                                Solar_street: parseInt(Solar_street, 10), // Convert string to number
                                                                                Solar_pole: parseInt(Solar_pole, 10), // Convert string to number
                                                                                Solar_signal: parseInt(Solar_signal, 10), // Convert string to number
                                                                            })
                                                                        )}
                                                                    margin={{
                                                                        top: 40,
                                                                        right: 60,
                                                                        bottom: 80,
                                                                        left: 60,
                                                                    }}
                                                                    style={{
                                                                        fontSize: "14px",
                                                                        fontWeight: "extrabold",
                                                                        color: "red",
                                                                    }}
                                                                >
                                                                    <CartesianGrid vertical={false} />
                                                                    <YAxis
                                                                        stroke='black'
                                                                    />
                                                                    <XAxis
                                                                        dataKey="chainage"
                                                                        tickLine={true}
                                                                        axisLine={false}
                                                                        tickFormatter={(value) => value}
                                                                        tick={{
                                                                            angle: -45,
                                                                            textAnchor: "end",
                                                                        }}
                                                                        stroke='black'
                                                                    />
                                                                    <ChartTooltip cursor={false} content={
                                                                        <ChartTooltipContent
                                                                            className="bg-white font-extrabold text-[14px]  w-[160px]"
                                                                        />
                                                                    }
                                                                    />
                                                                    <Line
                                                                        dataKey="Double_arm"
                                                                        stroke="var(--color-Double_arm)"
                                                                        strokeWidth={2}
                                                                        dot={true}
                                                                    />
                                                                    <Line
                                                                        dataKey="Single_arm"
                                                                        stroke="var(--color-Single_arm)"
                                                                        strokeWidth={2}
                                                                        dot={true}
                                                                    />
                                                                    <Line
                                                                        dataKey="Solar_street"
                                                                        stroke="var(--color-Solar_street)"
                                                                        strokeWidth={2}
                                                                        dot={true}
                                                                    />
                                                                    <Line
                                                                        dataKey="Solar_pole"
                                                                        stroke="var(--color-Solar_pole)"
                                                                        strokeWidth={2}
                                                                        dot={true}
                                                                    />
                                                                    <Line
                                                                        dataKey="Solar_signal"
                                                                        stroke="var(--color-Solar_signal)"
                                                                        strokeWidth={2}
                                                                        dot={true}
                                                                    />
                                                                    <Legend
                                                                        verticalAlign="top"  // Position legend at the bottom
                                                                        align="center"          // Align legend items to the center
                                                                        iconType="square" // Change icon shape (can be "square", "circle", "line", etc.)
                                                                        content={
                                                                            <ChartLegendContent
                                                                                className=" font-extrabold text-[15px] scale-130 pb-10 text-black"
                                                                            />
                                                                        }
                                                                    />
                                                                </LineChart>
                                                            </ChartContainer>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No data available</div>
                )}
            </div>
        </div>
    )
}

export default RoadFurniture






