"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { RankButton } from "../RankButton";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [votingCount, setVotingCount] = useState(0);

  const fetchVotingCount = async () => {
    const { count, error } = await supabase
      .from("Voting logs")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching voting count:", error);
    } else {
      setVotingCount(count);
    }
  };

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }

    fetchVotingCount();
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Sort the rankings by points in descending order
  const sortedRankings = [...data].sort((a, b) => b.points - a.points);

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-4 px-4 md:px-8 lg:px-10 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-4xl md:text-6xl mb-4 text-black dark:text-white max-w-4xl">
            Ranking^2
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 text-xl md:text-2xl max-w-sm">
            The first{" "}
            <span className="text-violet-700 italic">
              ranking of college rankings
            </span>
            , by meaningless criteria (because, at the end of the day, college
            rankings also mean{" "}
            <span className="underline decoration-purple-700">
              virtually nothing
            </span>
            <sup>
              <Link
                href="https://www.newyorker.com/magazine/2011/02/14/the-order-of-things"
                className="text-purple-700 hover:text-purple-900"
                target="_blank"
                rel="noopener noreferrer"
              >
                [1]
              </Link>
              <Link
                href="https://theconversation.com/university-rankings-are-unscientific-and-bad-for-education-experts-point-out-the-flaws-223033"
                className="text-purple-700 hover:text-purple-900 ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                [2]
              </Link>
            </sup>
            ).
            <div className="my-6">
              <RankButton onSubmit={fetchVotingCount} />
            </div>
          </p>
        </div>

        {/* Display Voting Count */}
        <div className="flex flex-col items-center">
          <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-transparent bg-clip-text">
            {votingCount.toLocaleString()}
          </div>
          <div className="text-center text-xl md:text-3xl text-neutral-700 dark:text-neutral-300 mt-2">
            ranking^2's created
          </div>
        </div>
      </div>

      {/* Existing Rankings Logic */}
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {sortedRankings.map((ranking, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-800" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500 ">
                #{index + 1}: {ranking.name} ({ranking.points} points)
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                #{index + 1}: {ranking.name} ({ranking.points} points)
              </h3>
              <div className="flex justify-center">
                <Image
                  src={ranking.img_src}
                  alt={ranking.name}
                  width={500}
                  height={500}
                  className="rounded-lg object-cover w-3/5 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                />
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
