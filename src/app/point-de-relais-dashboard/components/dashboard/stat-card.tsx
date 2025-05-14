'use client';
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArrowDown, ArrowUp, Info } from 'lucide-react';

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
    //Gerer le survol des cartes
    const [isHovered, setIsHovered] = useState(false);

    //Gestion des clicks sur les cartes

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (detailsUrl) {
            window.location.href = detailsUrl;
        }
    };

    return (
        <Card
            className={`transition-all duration-200 ${isHovered ? 'shadow-md transform scale-[1.02]' : ''}${onClick || detailsUrl ? 'cursor-pointer' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium ">{title} </CardTitle>
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
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center justify-between">
                    <CardDescription>{description}</CardDescription>
                    {trend && (
                        <div
                            className={`flex items-center text-xs ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}
                        >
                            {trend.direction === 'up' ? (
                                <ArrowUp className="mr-1 h-3 2-3" />
                            ) : (
                                <ArrowDown className="mr-1 h-3 2-3" />
                            )}
                            {trend.value}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
