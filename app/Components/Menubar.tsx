import { Bookmark, HomeIcon, Search, User } from "lucide-react";

const MenuBar = () => {
    return (
        <>
            <div className="w-full max-w-90 mx-auto h-15 fixed bottom-0 bg-[#ffffff]/40">
                <ul className="grid grid-cols-4">
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

export default MenuBar;