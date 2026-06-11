"use client";

import { Bot } from 'lucide-react';
import BackgroundCircles from './Components/BackgroundCircles';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="fixed w-full h-full grid place-items-center pt-11 pb-8.5 bg-[#F8F8F8] font-sans">
    <div className="max-w-90 mx-auto px-6">
      <BackgroundCircles />

      {/* Bot icon */}
      <div className="grid place-items-center">
      <span className="h-35 w-35 grid place-items-center mb-4 rounded-[70px] bg-[#EEF2FF]"><Bot className='text-blue-300 text-3xl'/></span>
      </div>
      <h1 className="text-[32px] leading-10.5 text-center text-[#1E293B] font-bold">AI-Based Student Project Recommendation System</h1>
      <p className="text-[16px] pt-4 pb-12 font-normal leading-9 text-center text-[#64748B]">Develop smart project ideas tailored to your skills, interests and academic goals</p>

      <Link href="/auth/login">
        <button className="bg-[#2563EB] mb-4 h-14 w-full rounded-[14px] text-[#ffffff] text-[16px] font-semibold">Get started</button>
      </Link>

      <div className="w-full grid place-items-center">
        <p className="font-normal text-[14px] text-[#64748B]">Already have an aaccount? <span className="text-[14px] text-[#2563EB]"><Link href="">Login</Link></span> </p>
      </div>

      </div>
     </section>
  );
}
