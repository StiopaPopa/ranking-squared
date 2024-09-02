"use client";
import React, { useState } from "react";
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

export const RankButton = () => {
  const [selectedRankings, setSelectedRankings] = useState({
    coolestLogo: "",
    mostTrusted: "",
    favoriteMetric: "",
  });

  const handleSelection = (question, value) => {
    setSelectedRankings((prev) => ({ ...prev, [question]: value }));
  };

  const resetSelections = () => {
    setSelectedRankings({
      coolestLogo: "",
      mostTrusted: "",
      favoriteMetric: "",
    });
  };

  const availableOptions = [
    "U.S. News",
    "QS",
    "Forbes",
    "Niche",
    "Princeton Review",
    "Shanghai Ranking",
    "Times Higher Education",
  ];

  const getAvailableOptions = (currentQuestion) => {
    return availableOptions.filter(
      (option) =>
        !Object.entries(selectedRankings).some(
          ([key, value]) => key !== currentQuestion && value === option
        )
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-lg md:text-xl">Create your ranking^2</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
              1. Coolest logo? (see reference below)
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
              3. Favourite metric?
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
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={resetSelections}>
            Reset Selections
          </Button>
          <Button type="submit">Submit your ranking^2</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
