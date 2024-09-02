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

export function LogoCarousel() {
  const data = [
    {
      src: "https://cdn.localized.world/organizations/499/85c44444-fc81-47eb-a8ca-63cdfa2c1741.png",
    },
    {
      src: "https://s.yimg.com/ny/api/res/1.2/yHP0gPZcod_9v1cA3w0.BA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTQyMDtoPTQyMA--/https://media.zenfs.com/en/cnwgroup.com/3bfaad519be331e6fc221f1f198b6622",
    },
    {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWpyAdajaUF-RGcmTT8cYnLr4JUsgSZ90RVQ&s",
    },
    {
      src: "https://images.crunchbase.com/image/upload/c_pad,f_auto,q_auto:eco,dpr_1/pb4ilvs7yaumsicmgdtn",
    },
    {
      src: "https://pbs.twimg.com/profile_images/1278421085453778945/GsZ7Q5cH_400x400.jpg",
    },
    {
      src: "https://www.uni.lu/wp-content/uploads/sites/9/2023/08/zyLEy5AI_400x400.jpg",
    },
    {
      src: "https://pbs.twimg.com/profile_images/1656989361399820288/q6cqezBO_400x400.png",
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
                  {/* <span className="text-4xl font-semibold">{index + 1}</span> */}
                  <Image
                    src={item.src}
                    alt={index}
                    width={500}
                    height={500}
                    // className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                  />
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
