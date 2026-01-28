"use client";
import { setdisplayContent } from "@/app/redux/slices/contentSlice";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PrivateRoute from "../middleware/PrivateRoute";
import { useAppSelector } from "../redux/hooks";
import Pavement from "./pavementDistress/page";
import Project from "./projects/page";
import RoadFurniture from "./roadfurniture/page";

export default function Page() {
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch();
    const displayContent = useAppSelector((state) => state.displayContent.displayContent);

    // Track active section
    const [activeSection, setActiveSection] = useState(null);

    // Create refs for the sections you want to scroll to
    const pavementRef = useRef(null);
    const roadFurnitureRef = useRef(null);

    // Function to handle scrolling and update active section
    const scrollToSection = (ref, section) => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(section);
        }
    };

    // Set up intersection observer to detect which section is in view
    useEffect(() => {
        // Only set up the observer if we're not in displayContent mode
        if (displayContent) return;

        const options = {
            root: null,
            rootMargin: '-20% 0px -20% 0px', // Add margin to make detection more accurate
            threshold: [0.1, 0.5], // Multiple thresholds for better detection
        };

        const observer = new IntersectionObserver((entries) => {
            // Sort entries by intersectionRatio to prioritize the most visible element
            const visibleEntries = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            // If we have visible entries, use the one with highest intersection ratio
            if (visibleEntries.length > 0) {
                const mostVisibleEntry = visibleEntries[0];

                if (mostVisibleEntry.target === pavementRef.current) {
                    setActiveSection('pavement');
                } else if (mostVisibleEntry.target === roadFurnitureRef.current) {
                    setActiveSection('roadFurniture');
                }
            }
        }, options);

        // Observe sections
        if (pavementRef.current) observer.observe(pavementRef.current);
        if (roadFurnitureRef.current) observer.observe(roadFurnitureRef.current);

        return () => {
            if (pavementRef.current) observer.unobserve(pavementRef.current);
            if (roadFurnitureRef.current) observer.unobserve(roadFurnitureRef.current);
            observer.disconnect();
        };
    }, [displayContent]);

    // Add a scroll event listener for additional reliability
    useEffect(() => {
        // Only set up the scroll listener if we're not in displayContent mode
        if (displayContent) return;

        const handleScroll = () => {
            if (!pavementRef.current || !roadFurnitureRef.current) return;

            const pavementRect = pavementRef.current.getBoundingClientRect();
            const roadFurnitureRect = roadFurnitureRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if section is in viewport
            const isPavementVisible =
                pavementRect.top < windowHeight / 2 &&
                pavementRect.bottom > windowHeight / 2;

            const isRoadFurnitureVisible =
                roadFurnitureRect.top < windowHeight / 2 &&
                roadFurnitureRect.bottom > windowHeight / 2;

            // Update active section based on which one is more visible
            if (isPavementVisible) {
                setActiveSection('pavement');
            } else if (isRoadFurnitureVisible) {
                setActiveSection('roadFurniture');
            }
        };

        // Add scroll event listener to the window
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Call once on mount to set initial state
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [displayContent]);

    return (
        <PrivateRoute>
            <div className="flex flex-col relative w-full">
                {/* Left section */}
                <div className={`  top-0 ${displayContent ? "hidden" : "block"} py-2 px-15 relative`}>
                    <div className="flex justify-between font-bold">
                        {/* Project button */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => dispatch(setdisplayContent(true))}
                                className=" text-black cursor-pointer border-1 border-r-4 border-b-4  px-4 py-2 rounded-lg transition duration-300">
                                Projects
                            </button>

                            {/* Apply active styling based on activeSection */}
                            <button
                                onClick={() => scrollToSection(pavementRef, 'pavement')}
                                className={`${activeSection === 'pavement'
                                    ? 'bg-red-600 text-black'
                                    : ' text-black'
                                    }  cursor-pointer w-44 px-4 py-2 border-1 border-r-4 border-b-4 rounded-lg transition duration-300`}>
                                Pavement Distress
                            </button>

                            <button
                                onClick={() => scrollToSection(roadFurnitureRef, 'roadFurniture')}
                                className={`${activeSection === 'roadFurniture'
                                    ? 'bg-red-600 text-black'
                                    : ' text-black'
                                    }  cursor-pointer w-42 px-4 py-2 border-1 border-r-4 border-b-4 rounded-lg transition duration-300`}>
                                Road Furniture
                            </button>
                        </div>
                        <div className="flex gap-4 ">
                            <div className="relative border-1 border-l-4 border-b-4 rounded-lg inline-block text-left">
                                {/* Dropdown Button */}
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="bg-blue-600  cursor-pointer text-black px-4 py-2 w-32 rounded-md text-md shadow-md hover:bg-blue-800"
                                >
                                    Download ▼
                                </button>

                                {/* Dropdown Menu */}
                                {open && (
                                    <div className="absolute  cursor-pointer mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                                        <a
                                            href="./AUTH.drawio (2).pdf"
                                            className="block px-4 py-2 text-gray-700 hover: rounded-t-md"
                                        >
                                            PDF
                                        </a>
                                        <a
                                            href="./RHS_Delhi-NCR_data.csv"
                                            className="block px-4 py-2 text-gray-700 hover: rounded-b-md"
                                        >
                                            CSV
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className=" bg-green-600 border-1 border-l-4 border-b-4 rounded-lg text-center  py-2 px-3 text-md  text-black">
                                <Link
                                    href="/wayVision1/comparision">
                                    Comparision
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="border-2 h-full"></div>

                {/* Right section */}
                <div className="w-full overflow-y-auto h-screen" id="scrollable-content">
                    <div className="min-h-[50vh]">
                        <Project className='w-full ' />
                    </div>

                    <div className={`flex flex-col font-bold ${displayContent ? "hidden" : "block"}`}>
                        {/* Add clear ID and class names to make sections more identifiable */}
                        <div
                            ref={pavementRef}
                            id="pavement-section"
                            className=" pt-10 section-container">
                            <Pavement />
                        </div>

                        <div
                            ref={roadFurnitureRef}
                            id="roadfurniture-section"
                            className=" pt-10 section-container">
                            <RoadFurniture />
                        </div>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
}
