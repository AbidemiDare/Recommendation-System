const BackgroundCircles = () => {
    return (
        <div className="fixed inset-0 overflow-hidden lg:gradient-to-br from-[#f7f8ff] to-[#eef1ff] -z-10">
            <div className="absolute top-[10%] left-[5%] w-50 h-50 rounded-full bg-[rgba(120,120,255,0.2)] blur-[1px] animate-[float_10s_ease-in-out_infinite]"></div>
            <div className="absolute top-[20%] right-[10%] w-75 h-75 rounded-full bg-[rgba(180,140,255,0.15)] blur-[1px] animate-[float_14s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[15%] left-[5%] w-37.5 h-37.5 rounded-full bg-[rgba(100,200,255,0.12)] blur-[1px] animate-[float_12s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[10%] left-[5%] w-62.5 h-62.5 rounded-full bg-[rgba(140,160,255,0.18)] blur-[1px] animate-[float_16s_ease-in-out_infinite]"></div>
            <div className="absolute top-[50%] left-[5%] w-25 h-25 rounded-full bg-[rgba(200,100,255,0.2)] blur-[1px] animate-[float_18s_ease-in-out_infinite]"></div>
        </div>
    )
}

export default BackgroundCircles;