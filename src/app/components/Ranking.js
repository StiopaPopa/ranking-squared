"use client";
import React, { useState, useEffect } from "react";
import { Timeline } from "./ui/timeline";
import { supabase } from "@/lib/supabaseClient";

export function Ranking() {
  const [rankings, setRankings] = useState([
    {
      name: "U.S. News",
      points: 0,
      img_src:
        "https://cdn.localized.world/organizations/499/85c44444-fc81-47eb-a8ca-63cdfa2c1741.png",
    },
    {
      name: "QS",
      points: 0,
      img_src:
        "https://s.yimg.com/ny/api/res/1.2/yHP0gPZcod_9v1cA3w0.BA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTQyMDtoPTQyMA--/https://media.zenfs.com/en/cnwgroup.com/3bfaad519be331e6fc221f1f198b6622",
    },
    {
      name: "Forbes",
      points: 0,
      img_src:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWpyAdajaUF-RGcmTT8cYnLr4JUsgSZ90RVQ&s",
    },
    {
      name: "Niche",
      points: 0,
      img_src:
        "https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/pb4ilvs7yaumsicmgdtn",
    },
    {
      name: "Princeton Review",
      points: 0,
      img_src:
        "https://pbs.twimg.com/profile_images/1278421085453778945/GsZ7Q5cH_400x400.jpg",
    },
    {
      name: "Shanghai Ranking",
      points: 0,
      img_src:
        "https://www.uni.lu/wp-content/uploads/sites/9/2023/08/zyLEy5AI_400x400.jpg",
    },
    {
      name: "Times Higher Education",
      points: 0,
      img_src:
        "https://pbs.twimg.com/profile_images/1656989361399820288/q6cqezBO_400x400.png",
    },
  ]);

  useEffect(() => {
    fetchInitialRankings();

    const channel = supabase
      .channel("rankings")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Ranking^2" },
        handleRankingUpdate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInitialRankings = async () => {
    const { data, error } = await supabase
      .from("Ranking^2")
      .select("ranking_name, points");

    if (error) {
      // console.error("Error fetching initial rankings:", error);
    } else {
      setRankings((currentRankings) =>
        currentRankings.map((ranking) => {
          const dbRanking = data.find((r) => r.ranking_name === ranking.name);
          return dbRanking ? { ...ranking, points: dbRanking.points } : ranking;
        })
      );
    }
  };

  const handleRankingUpdate = (payload) => {
    setRankings((currentRankings) =>
      currentRankings.map((ranking) =>
        ranking.name === payload.new.ranking_name
          ? { ...ranking, points: payload.new.points }
          : ranking
      )
    );
  };

  return (
    <div className="w-full">
      <Timeline data={rankings} />
    </div>
  );
}
