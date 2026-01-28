import { useAppSelector } from "@/app/redux/hooks";
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
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";


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


function RoadFurniture({ array, Lowerlimit_RF_LHS, Upperlimit_RF_LHS, Lowerlimit_RF_RHS, Upperlimit_RF_RHS }) {

    const dispatch = useDispatch();
    const mapSide = useAppSelector((state) => state.mapSide.mapSide);
    const project = useAppSelector((state) => state.project.project);
    const [info, setinfo] = useState(false)
    const [isMounted, setIsMounted] = useState(false);
    const [LowerLimit, setLowerLimit] = useState("dfnvc")
    const [UpperLimit, setUpperLimit] = useState("dfnvc")




    useEffect(() => {
        if (mapSide === "LHS") {
            setLowerLimit(Lowerlimit_RF_LHS)
            setUpperLimit(Upperlimit_RF_LHS)
        } else if (mapSide === "RHS") {
            setLowerLimit(Lowerlimit_RF_RHS)
            setUpperLimit(Upperlimit_RF_RHS)
        }
        setIsMounted(true);
    }, [mapSide, Lowerlimit_RF_LHS, Upperlimit_RF_LHS, Lowerlimit_RF_RHS, Upperlimit_RF_RHS]);

    if (!isMounted) {
        return <div>Loading pavement distreess</div>;
    }




   


    return (
        <div className=" text-black">


            <div className="mt-5  ">
                <span
                    className="text-3xl font-extrabold cursor-pointer"
                    onClick={() => { info ? setinfo(false) : setinfo(true) }}
                >Info
                </span>

                {array[project] ? (
                    Object.keys(array[project][mapSide]).map((item, key) => (
                        <div key={key} className="m-5">
                            <div className="  text-black text-xl  ">
                                <div className="relative ">
                                    {Object.keys(array[project][mapSide][item]).map((subitem, subkey) => (
                                        <div
                                            key={subkey}>
                                            {subitem === "pieChart" && (

                                                <Card className={`bg-transparent absolute top-0 z-10 border-2 border-black w-full  ${info ? "display" : "hidden"}`}>
                                                    <CardContent className="pb-0  h-full">
                                                        <ChartContainer
                                                            config={chartConfig}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                aspectRatio: "16/14.8"
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
                                                <Card
                                                    className={`w-full h-full border-2 ${info ? "opacity-10" : "opacity-100"
                                                        }`}
                                                >
                                                    <div className="pr-10">
                                                        <CardContent className="h-full">
                                                        <ChartContainer
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                aspectRatio: "16/14"
                                                            }}
                                                            config={chartConfig}
                                                        >
                                                            <LineChart
                                                                accessibilityLayer
                                                                data={array[project][mapSide][item][subitem]["chartData"]
                                                                    .filter((item) => item[0] >= LowerLimit)
                                                                    .filter((item) => item[0] <= UpperLimit)
                                                                    .map(
                                                                        ([
                                                                            chainage,
                                                                            Double_arm,
                                                                            Single_arm,
                                                                            Solar_street,
                                                                            Solar_pole,
                                                                            Solar_signal,
                                                                        ]) => ({
                                                                            chainage,
                                                                            Double_arm: parseInt(Double_arm, 10),
                                                                            Single_arm: parseInt(Single_arm, 10),
                                                                            Solar_street: parseInt(Solar_street, 10),
                                                                            Solar_pole: parseInt(Solar_pole, 10),
                                                                            Solar_signal: parseInt(Solar_signal, 10),
                                                                        })
                                                                    )}
                                                                margin={{
                                                                    left: 40,
                                                                    right: 0,
                                                                    top: 40,
                                                                    bottom: 40,
                                                                }}
                                                                style={{
                                                                    fontSize: "14px",
                                                                    fontWeight: "extrabold",
                                                                    color: "red",
                                                                }}
                                                            >
                                                                <CartesianGrid vertical={false} />
                                                                <YAxis stroke="black" />
                                                                <XAxis
                                                                    dataKey="chainage"
                                                                    tickLine={true}
                                                                    axisLine={false}
                                                                    tickMargin={8}
                                                                    tick={{ angle: -45, textAnchor: "end" }}
                                                                    stroke="black"
                                                                />
                                                                <ChartTooltip
                                                                    cursor={false}
                                                                    content={
                                                                        <ChartTooltipContent className="bg-white font-extrabold text-[14px] w-[160px]" />
                                                                    }
                                                                />

                                                                {/* Lines */}
                                                                <Line dataKey="Double_arm" stroke="var(--color-Double_arm)" strokeWidth={2} dot />
                                                                <Line dataKey="Single_arm" stroke="var(--color-Single_arm)" strokeWidth={2} dot />
                                                                <Line dataKey="Solar_street" stroke="var(--color-Solar_street)" strokeWidth={2} dot />
                                                                <Line dataKey="Solar_pole" stroke="var(--color-Solar_pole)" strokeWidth={2} dot />
                                                                <Line dataKey="Solar_signal" stroke="var(--color-Solar_signal)" strokeWidth={2} dot />

                                                                {/* Show legend only on large screens */}
                                                                <div className="">
                                                                    <Legend
                                                                        verticalAlign="top"
                                                                        align="center"
                                                                        iconType="square"
                                                                        content={
                                                                            <ChartLegendContent className="font-bold text-xs pb-10 text-black" />
                                                                        }
                                                                    />
                                                                </div>
                                                            </LineChart>
                                                        </ChartContainer>

                                                        
                                                    </CardContent>
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






