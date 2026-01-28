"use client";
import { useAppSelector } from "@/app/redux/hooks";
import { setMapSide } from "@/app/redux/slices/mapSlice";
import { useEffect, useState , useContext } from "react";
import { useDispatch } from "react-redux";
import { Cell, Pie, PieChart } from "recharts";
import AuthContext from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

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

import { Bar, BarChart, Legend, XAxis, YAxis } from "recharts";

const chartConfig = {
    cautionary: {
        label: "cautionary",
        color: "#FF6B6B", // Soft Red
    },
    informatory: {
        label: "informatory",
        color: "#FFA07A", // Light Salmon
    },
    mandatory: {
        label: "mandatory",
        color: "#FF4500", // Orange-Red
    },
};

const chartConfig2 = {
    cautionary: {
        label: "cautionary",
        color: "#FF6B6B", // Soft Red
    },
    informatory: {
        label: "informatory",
        color: "#FFA07A", // Light Salmon
    },
    mandatory: {
        label: "mandatory",
        color: "#FF4500", // Orange-Red
    },
};

const chartConfig3 = {
    cautionary: {
        label: "cautionary",
        color: "#FF6B6B", // Soft Red
    },
    informatory: {
        label: "informatory",
        color: "#FFA07A", // Light Salmon
    },
    mandatory: {
        label: "mandatory",
        color: "#FF4500", // Orange-Red
    },
};


function RoadFurniture({ array }) {
    const dispatch = useDispatch();
    const mapSide = useAppSelector((state) => state.mapSide.mapSide);
    const project = useAppSelector((state) => state.project.project);
    const router = useRouter();
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
    useEffect(() => {
        const dataSet = data;
        if (data) {
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
    return (
        <div className="p-10 mx-16  text-black border-4 border-r-4 border-b-4 rounded-sm">

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
                        {mapSide === "LHS" ? LHS_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        )).reverse() : RHS_chainage.map((item, index) => (
                            <option key={index}>{item}</option>
                        )).reverse()}
                    </select>
                </div>
                {array[project] ? (
                    Object.keys(array[project][mapSide]).map((item, key) => (
                        <div key={key} className="m-5">
                            <div className="  text-black text-xl ">
                                <div className=" relative  ">
                                    {Object.keys(array[project][mapSide][item]).map((subitem, subkey) => (
                                        <div
                                            key={subkey}
                                        >
                                            {subitem === "pieChart" && (
                                                <Card className={`bg-transparent absolute w-full top-0 z-10 border-2 border-black  ${info ? "display" : "hidden"}`}>
                                                    <CardContent className="h-[500px]">
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
                                                                    fontSize: "16px",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                <ChartTooltip
                                                                    content={
                                                                        <ChartTooltipContent
                                                                            className="bg-white text-red-600 font-extrabold text-[16px]"
                                                                            hideLabel
                                                                            formatter={(value, name, entry) =>
                                                                                `${chartConfig[entry.portion]?.label || name}: ${value}%`
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
                                                <Card
                                                    className={`w-full h-full border-white border-2 ${info ? "opacity-10" : "opacity-100"
                                                        }`}
                                                >
                                                    <div className="w-full h-[500px]"> {/* Fixed height but stretchable width */}
                                                        <ChartContainer
                                                            style={{
                                                                width: "100%",    // Fill width of parent
                                                                height: "100%",   // Respect fixed height
                                                            }}
                                                            config={chartConfig3}
                                                        >
                                                            <BarChart
                                                                accessibilityLayer
                                                                data={
                                                                    array[project][mapSide][item][subitem]["chartData"]
                                                                        .filter((item) => item[0] >= LowerLimit)
                                                                        .filter((item) => item[0] <= UpperLimit)
                                                                        .map(([chainage, cautionary, informatory, mandatory]) => ({
                                                                            chainage,
                                                                            cautionary: parseInt(cautionary),
                                                                            informatory: parseInt(informatory),
                                                                            mandatory: parseInt(mandatory),
                                                                        })) || []
                                                                }
                                                                margin={{
                                                                    top: 40,
                                                                    right: 60,
                                                                    bottom: 80,
                                                                    left: 60,
                                                                }}
                                                            >
                                                                <XAxis
                                                                    dataKey="chainage"
                                                                    axisLine={false}
                                                                    tick={{ angle: -55, textAnchor: "end" }}
                                                                    stroke="black"
                                                                />
                                                                <YAxis stroke="black" />

                                                                <Bar dataKey="cautionary" stackId="a" fill="#FF6B6B" />
                                                                <Bar dataKey="informatory" stackId="a" fill="#FFA07A" />
                                                                <Bar dataKey="mandatory" stackId="a" fill="#FF4500" radius={[3, 3, 0, 0]} />

                                                                <ChartTooltip
                                                                    content={
                                                                        <ChartTooltipContent className="bg-white text-red-600 font-extrabold text-[14px] w-[160px]" />
                                                                    }
                                                                    cursor={false}
                                                                />
                                                                <Legend
                                                                    verticalAlign="top"
                                                                    align="center"
                                                                    iconType="square"
                                                                    content={
                                                                        <ChartLegendContent className="text-black font-extrabold text-[15px] scale-130" />
                                                                    }
                                                                />
                                                            </BarChart>
                                                        </ChartContainer>
                                                    </div>
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
