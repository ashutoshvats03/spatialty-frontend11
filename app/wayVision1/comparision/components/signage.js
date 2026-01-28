import { useAppSelector } from "@/app/redux/hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Cell, Pie, PieChart } from "recharts";


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


function RoadFurniture({ array, Lowerlimit_RF_LHS, Upperlimit_RF_LHS, Lowerlimit_RF_RHS, Upperlimit_RF_RHS }) {
    const dispatch = useDispatch();
    const mapSide = useAppSelector((state) => state.mapSide.mapSide);
    const project = useAppSelector((state) => state.project.project);
    const [info, setinfo] = useState(false)
    const [isMounted, setIsMounted] = useState(false);
    const [LowerLimit_RF, setLowerLimit_RF] = useState("dfnvc")
    const [UpperLimit_RF, setUpperLimit_RF] = useState("djj")




    useEffect(() => {
        if (mapSide === "LHS") {
            setLowerLimit_RF(Lowerlimit_RF_LHS)
            setUpperLimit_RF(Upperlimit_RF_LHS)
        } else if (mapSide === "RHS") {
            setLowerLimit_RF(Lowerlimit_RF_RHS)
            setUpperLimit_RF(Upperlimit_RF_RHS)
        }
        setIsMounted(true);
    }, [mapSide, Lowerlimit_RF_LHS, Upperlimit_RF_LHS, Lowerlimit_RF_RHS, Upperlimit_RF_RHS]);


    if (!isMounted) {
        return <div>Loading pavement distreess</div>;
    }



    console.log(LowerLimit_RF, UpperLimit_RF)
    return (
        <div className="   text-black ">


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
                                <div className="relative  gap-4">
                                    {Object.keys(array[project][mapSide][item]).map((subitem, subkey) => (
                                        <div
                                            key={subkey}>
                                            {subitem === "pieChart" && (
                                                <Card className={`bg-transparent absolute top-0 w-full  z-10 border-2 border-black  ${info ? "display" : "hidden"}`}>
                                                    <CardContent
                                                        className="h-full">
                                                        <ChartContainer
                                                            config={chartConfig}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                aspectRatio: "16/14.6"
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
                                                <Card className={` w-full h-full border-2  ${info ? "opacity-10" : "opacity-100"}`}>
                                                    <ChartContainer
                                                        className="h-full"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            aspectRatio: "16/14"
                                                        }}
                                                        config={chartConfig3}>
                                                        <BarChart
                                                            accessibilityLayer
                                                            data={array[project][mapSide][item][subitem]["chartData"]
                                                                .filter((item) => item[0] >= LowerLimit_RF)
                                                                .filter((item) => item[0] <= UpperLimit_RF)
                                                                .map(
                                                                    ([chainage, cautionary, informatory, mandatory]) => ({
                                                                        chainage,
                                                                        cautionary: parseInt(cautionary), // Convert string to number
                                                                        informatory: parseInt(informatory),
                                                                        mandatory: parseInt(mandatory),
                                                                    })
                                                                ) || []}
                                                            // barSize={14}
                                                            style={{
                                                                // width: "100%",
                                                                // height: "100%",
                                                                fontSize: "14px",
                                                                fontWeight: "extrabold",
                                                            }}
                                                            margin={{
                                                                top: 40,
                                                                right: 40,
                                                                bottom: 80,
                                                                left: 40,
                                                            }}
                                                        >
                                                            <XAxis
                                                                dataKey="chainage"
                                                                // interval={3} // Display every tick (this will show all 100 dates if the space allows)
                                                                axisLine={false}
                                                                tick={{
                                                                    angle: -55,
                                                                    textAnchor: "end",
                                                                }}
                                                                stroke='black'
                                                            />
                                                            <YAxis
                                                                stroke='black'
                                                            />

                                                            <Bar
                                                                dataKey="cautionary"
                                                                stackId="a"
                                                                fill="#FF6B6B" // Deep Red
                                                                radius={[0, 0, 0, 0]} // No border radius
                                                            />
                                                            <Bar
                                                                dataKey="informatory"
                                                                stackId="a"
                                                                fill="#FFA07A" // Soft Pinkish-Red
                                                                radius={[0, 0, 0, 0]} // No border radius
                                                            />
                                                            <Bar
                                                                dataKey="mandatory"
                                                                stackId="a"
                                                                fill="#FF4500" // Bright Red
                                                                radius={[3, 3, 0, 0]} // Rounded top corners for better visual distinction
                                                            />

                                                            <ChartTooltip
                                                                content={
                                                                    <ChartTooltipContent
                                                                        className="bg-white text-red-600 font-extrabold text-[14px] w-[160px]"
                                                                    />
                                                                }
                                                                cursor={false}
                                                            />
                                                            <Legend
                                                                verticalAlign="top"  // Position legend at the bottom
                                                                align="center"          // Align legend items to the center
                                                                iconType="square" // Change icon shape (can be "square", "circle", "line", etc.)
                                                                // iconSize="22px" // Change icon size
                                                                // style={{ color: "black" }} // Change legend text color
                                                                // wrapperStyle={{ fontSize: "25px", fontWeight: "bold" }} // Customize legend text
                                                                content={
                                                                    <ChartLegendContent
                                                                        className="text-black font-bold text-sm "
                                                                    />
                                                                }
                                                            />
                                                        </BarChart>
                                                    </ChartContainer>
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
