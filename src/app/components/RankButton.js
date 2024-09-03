"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DropSelect } from "./DropSelect";
import { LogoCarousel } from "./LogoCarousel";
import { MetricCarousel } from "./MetricCarousel";
import { ConfirmationModal } from "./ConfirmationModal";
import { supabase } from "@/lib/supabaseClient";

export const RankButton = ({ onSubmit }) => {
  const [selectedRankings, setSelectedRankings] = useState({
    coolestLogo: "",
    mostTrusted: "",
    favoriteMetric: "",
  });
  const [remainingRankings, setRemainingRankings] = useState([]);
  const [showRemainingRankings, setShowRemainingRankings] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pointsChange, setPointsChange] = useState({});
  const [loading, setLoading] = useState(false);
  const [clickedRandomize, setClickedRandomize] = useState(false);

  const availableOptions = [
    "U.S. News",
    "QS",
    "Forbes",
    "Niche",
    "Princeton Review",
    "Shanghai Ranking",
    "Times Higher Education",
  ];

  useEffect(() => {
    updateRemainingRankings();
  }, [selectedRankings]);

  const handleSelection = (question, value) => {
    setSelectedRankings((prev) => ({ ...prev, [question]: value }));
  };

  const resetSelections = () => {
    setSelectedRankings({
      coolestLogo: "",
      mostTrusted: "",
      favoriteMetric: "",
    });
    setShowRemainingRankings(false);
    updateRemainingRankings();
  };

  const getAvailableOptions = (currentQuestion) => {
    return availableOptions.filter(
      (option) =>
        !Object.entries(selectedRankings).some(
          ([key, value]) => key !== currentQuestion && value === option
        )
    );
  };

  const updateRemainingRankings = () => {
    const remaining = getAvailableOptions("remaining");
    setRemainingRankings(shuffleArray(remaining));
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const randomizeRemainingRankings = () => {
    setRemainingRankings(shuffleArray(remainingRankings));
    setShowRemainingRankings(true);
    setClickedRandomize(true);
  };

  const submitRankings = async () => {
    setLoading(true);
    const pointsChangeTemp = {};

    const combinedRankings = {
      rank1: selectedRankings.coolestLogo,
      rank2: selectedRankings.mostTrusted,
      rank3: selectedRankings.favoriteMetric,
      ...remainingRankings.reduce((acc, ranking, index) => {
        acc[`rank${index + 4}`] = ranking;
        return acc;
      }, {}),
    };

    const finalRankings = Object.keys(combinedRankings).reduce(
      (acc, key, index) => {
        acc[index + 1] = combinedRankings[key];
        return acc;
      },
      {}
    );

    try {
      for (const [rank, rankingName] of Object.entries(finalRankings)) {
        const pointsToAdd = 8 - parseInt(rank);

        const { data: currentData, error: fetchError } = await supabase
          .from("Ranking^2")
          .select("points")
          .eq("ranking_name", rankingName)
          .single();

        if (fetchError) {
          console.error(
            `Error fetching points for ${rankingName}:`,
            fetchError
          );
          continue;
        }

        const currentPoints = currentData.points || 0;
        const newPoints = currentPoints + pointsToAdd;

        pointsChangeTemp[rankingName] = {
          before: currentPoints,
          after: newPoints,
        };

        const { error: updateError } = await supabase
          .from("Ranking^2")
          .update({ points: newPoints })
          .eq("ranking_name", rankingName);

        if (updateError) {
          console.error(
            `Error updating points for ${rankingName}:`,
            updateError
          );
        }
      }

      const { error } = await supabase.from("Voting logs").insert([
        {
          ranking: finalRankings,
        },
      ]);

      if (error) {
        console.error("Error inserting voting log:", error);
      } else {
        // Call the onSubmit prop to update the voting count
        onSubmit();
      }

      resetSelections();
      setPointsChange(pointsChangeTemp);
      setIsDialogOpen(false);
      setIsConfirmationOpen(true);
    } catch (error) {
      console.error("Error submitting rankings:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    selectedRankings.coolestLogo &&
    selectedRankings.mostTrusted &&
    selectedRankings.favoriteMetric &&
    clickedRandomize;

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="text-lg md:text-xl">Create your ranking^2</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto z-50">
          <DialogHeader>
            <DialogTitle>Rank the college rankings</DialogTitle>
            <DialogDescription>
              Answer the questions in-order. Choose one college ranking for each
              question.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="coolest-logo" className="text-left">
                1. Coolest logo? (see below)
              </Label>
              <DropSelect
                value={selectedRankings.coolestLogo}
                onChange={(value) => handleSelection("coolestLogo", value)}
                availableOptions={getAvailableOptions("coolestLogo")}
              />
            </div>
            <div className="flex justify-center w-full">
              <LogoCarousel />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                2. Which ranking do you trust most?
              </Label>
              <DropSelect
                value={selectedRankings.mostTrusted}
                onChange={(value) => handleSelection("mostTrusted", value)}
                availableOptions={getAvailableOptions("mostTrusted")}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                3. Favourite funky metric? (see below)
              </Label>
              <DropSelect
                value={selectedRankings.favoriteMetric}
                onChange={(value) => handleSelection("favoriteMetric", value)}
                availableOptions={getAvailableOptions("favoriteMetric")}
              />
              <div className="col-span-2 flex justify-center w-full">
                <MetricCarousel />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>
                  Fuck it: Keep randomizing the remaining order until you're
                  happy!
                </Label>
                <Button
                  onClick={randomizeRemainingRankings}
                  variant="outline"
                  size="sm"
                  className="border-2 border-violet-600"
                >
                  🎲 Randomize
                </Button>
              </div>
              {showRemainingRankings &&
                remainingRankings.map((ranking, index) => (
                  <div key={ranking} className="flex items-center gap-2">
                    <span className="font-semibold">{index + 4}.</span>
                    <span>{ranking}</span>
                  </div>
                ))}
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={resetSelections}
              className="border-2 border-neutral-500"
            >
              Reset Selections
            </Button>
            <Button
              type="submit"
              onClick={submitRankings}
              disabled={!isFormValid || loading}
              className="space-x-4"
            >
              {loading && (
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 text-white animate-spin fill-violet-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              )}
              {loading ? <span>Submitting...</span> : "Submit your ranking^2"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        setIsOpen={setIsConfirmationOpen}
        pointsChange={pointsChange}
      />
    </>
  );
};
