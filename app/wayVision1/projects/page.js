"use client"
import LoadingPage from "@/app/components/Loading";
import { useAppSelector } from "@/app/redux/hooks";
import { setdisplayContent } from '@/app/redux/slices/contentSlice';
import { setProject } from '@/app/redux/slices/projectSlice';
import { useRouter } from "next/navigation";
import { useEffect, useState,useContext } from 'react';
import { useDispatch } from "react-redux";
import DataComponents from './DataComponents/page';
import AuthContext from "../../context/AuthContext";

function Page() {
    const router = useRouter();
    const [showInfoIndex, setShowInfoIndex] = useState(null);
    const [header, setheader] = useState("Highway Expansion");
    const dispatch = useDispatch();
    const displayContent = useAppSelector((state) => state.displayContent.displayContent);
    const [message, setMessage] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data } = useContext(AuthContext);
    useEffect(() => {
        const dataSet = data;
        if (dataSet) {
            const Proj = dataSet.Project;
            setMessage(Proj);
            setIsMounted(true);
            setLoading(false);
        } else {
            router.push("/");
        }
    }, []);
    const projects = message;
    if (!isMounted) {
        return <LoadingPage />;
    }

    return (
        <div className="mt-14 font-bold ">
            <div className={`text text-black  text-center border-r-4 border-b-4 text-[16px] border-white rounded-lg border-2 mx-16 ${displayContent ? "block" : "hidden"}`}>
                <div className="location text-2xl font-extrabold mx-16 mt-5 mb-10">Projects Content</div>
                <div onMouseLeave={() => setShowInfoIndex(null)}>
                    {projects && projects.map((project, index) => (
                        <div onClick={() => { dispatch(setProject(project[0])); setLoading(true); setheader(project[1]); dispatch(setdisplayContent(false)) }} className='border-3 border-r-4 font-bold text-xl cursor-pointer rounded-lg' key={index}>
                            <div className={`flex my-5 mx-16 gap-10`}>
                                <div className="text-start flex-1">{project[1]}</div>
                                <div className="text-center flex-1">{project[4]}</div>
                                <div className={`text-center flex-[0.5] px-2 py-1   ${index !== 0 ? "text-black text-sm font-medium  bg-red-600 rounded-xl" : "text-[16px]font-bold"}`}>
                                    {project[3]}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`border-4 text-black mx-16 text-center my-10 ${displayContent ? "hidden" : "block"}`}>
                <div className='font-extrabold text-3xl  rounded-lg py-5'>
                    {header}
                </div>
                <div className={`   px-10`}>
                    {projects && projects[2]}
                    <DataComponents />
                </div>
            </div>
        </div>
    );
}

export default Page;
