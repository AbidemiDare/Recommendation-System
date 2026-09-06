import { Bookmark, HomeIcon, Search, User } from "lucide-react";

const BottomNavigation = () => {
    return (
        <>
            <div className="w-full lg:hidden h-15 fixed px-6 bg-white/10 bottom-0">
                    <ul className="w-full flex items-center justify-between">
                        <li className="flex items-center flex-col">
                            <span><HomeIcon/></span>
                            <a href="">Home</a></li>
                        <li className="flex items-center flex-col">
                            <span><Search/></span>
                            <a href="">Explore</a></li>
                        <li className="flex items-center flex-col">
                            <span><Bookmark/></span>
                            <a href="">Saved</a></li>
                        <li className="flex items-center flex-col">
                            <span><User/></span>
                            <a href="">Profile</a></li>
                    </ul>
            </div>
        </>
    )
}

export default BottomNavigation;