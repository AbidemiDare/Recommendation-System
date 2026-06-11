'use client';

import { ChevronLeft, FlaskConical } from "lucide-react";

const Recommendation = () => {
    return (
        <div className='px-4 pt-5'>
            <div className='flex items-center justify-between'>
            <ChevronLeft/>
            <h4>Recommendations</h4>
            <FlaskConical />
            </div>

            <div>
            <input type="search" name="search" placeholder="Search projects..." id="search" className="h-12 w-full border border-black rounded-sm px-4 my-4" />
            </div>

            <div className="flex items-center justify-between">
                <button className="bg-[#1a1a45] text-white rounded-sm px-2 py-1">All</button>
                <button className="bg-[#1a1a45] text-white rounded-sm px-2 py-1">High match</button>
                <button className="bg-[#1a1a45] text-white rounded-sm px-2 py-1">AI</button>
                <button className="bg-[#1a1a45] text-white rounded-sm px-2 py-1">Web</button>
                <button className="bg-[#1a1a45] text-white rounded-sm px-2 py-1">Data</button>
            </div>
        </div>
    )
}

export default Recommendation;