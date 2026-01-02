"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface SectionCardItem {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    label: string;
    value: string;
    direction: "up" | "down";
  };
  footerLabel?: string;
}

interface SectionCardsProps {
  items: SectionCardItem[];
}

export function SectionCards({ items }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {items.map((item, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>{item.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{item.value}</CardTitle>
            {item.trend && (
              <CardAction>
                <Badge variant="outline">
                  {item.trend.direction === "up" ? (
                    <IconTrendingUp className="size-3.5!" />
                  ) : (
                    <IconTrendingDown className="size-3.5!" />
                  )}
                  {item.trend.value}
                </Badge>
              </CardAction>
            )}
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {item.trend && (
              <div className="line-clamp-1 flex gap-2 font-medium">
                {item.trend.label}{" "}
                {item.trend.direction === "up" ? (
                  <IconTrendingUp className="size-4" />
                ) : (
                  <IconTrendingDown className="size-4" />
                )}
              </div>
            )}
            {item.footerLabel && <div className="text-muted-foreground">{item.footerLabel}</div>}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
