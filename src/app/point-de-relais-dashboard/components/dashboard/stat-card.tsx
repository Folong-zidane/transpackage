'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  icon?: React.ReactNode;
  onClick?: () => void;
  detailsUrl?: string;
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon,
  onClick,
  detailsUrl,
}: StatCardProps) {
    const [isHovered, setIsHovered] = useState(false);
   

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (detailsUrl) {
      window.location.href = detailsUrl;
    }
  };

  return (
    <Card
      className={cn(
        'transition-all duration-200 h-full',
        isHovered && 'shadow-md transform scale-[1.02]',
        (onClick || detailsUrl) && 'cursor-pointer'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="flex items-center gap-2">
            {icon}
            {(onClick || detailsUrl) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cliquez pour voir les détails</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <div className="text-2xl font-bold mb-2">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{description}</p>
          {trend && (
            <div
              className={cn(
                'flex items-center text-xs font-medium',
                trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
              )}
            >
              {trend.direction === 'up' ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {trend.value}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
