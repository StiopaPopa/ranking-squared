import * as React from "react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function MetricCarousel() {
  const data = [
    {
      ranking: "U.S. News",
      metric: "alumni donation rate 💎",
    },
    {
      ranking: "QS",
      metric: "international student + faculty ratio 🌎",
    },
    {
      ranking: "Forbes",
      metric: "how many grads make Forbes lists ✨",
    },
    {
      ranking: "Niche",
      metric: "party scene score 🎉",
    },
    {
      ranking: "Princeton Review",
      metric: '"is there lots of beer?" 🍺',
    },
    {
      ranking: "Shanghai Ranking",
      metric: "number of alumni winning Nobel Prizes 🥇",
    },
    {
      ranking: "Times Higher Education",
      metric: "number of outbound Study Abroad students ✈️",
    },
  ];
  return (
    <Carousel className="w-1/2 max-w-xs">
      <CarouselContent>
        {data.map((item, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-sm">
                    <span className="font-bold">{item.ranking}:</span>{" "}
                    {item.metric}
                  </span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
