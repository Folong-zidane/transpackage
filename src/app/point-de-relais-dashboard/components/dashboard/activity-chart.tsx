'use client';
import { useTheme } from 'next-themes';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from '../ui/chart';
import React from 'react';

interface ActivityChartProps {
    days: number;
}

//Graphique d'activites des colis

export function ActivityChart({ days }: ActivityChartProps) {
    // theme
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Génère les données pour la demo

    const generateData = (days: number) => {
        const data = [];
        const now = new Date();

        for (let i = days; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                }),
                recus: Math.floor(Math.random() * 20) + 5, // Entre 5 et 25 colis reçus
                livres: Math.floor(Math.random() * 18) + 3, // Entre 3 et 21 colis livrés
            });
        }
        return data;
    };

    // Générer les données pour le graphique
    const data = generateData(days);

    return (
        <div className="h-[300px] w-full">
            {/* Conteneur responsive pour le graphique
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                */}
            {/* Grille de fond adaptée au thème                     <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDark ? '#333' : '#eee'}
                    />*/}

            {/* Axes X et Y adaptés au thème
                    <XAxis
                        dataKey="date"
                        stroke={isDark ? '#888' : '#666'}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        stroke={isDark ? '#888' : '#666'}
                        tick={{ fontSize: 12 }}
                    />
                    */}

            {/* Infobulle et légende
                    <Tooltip />
                    <Legend />
                    */}

            {/* Zones pour les colis reçus et livrés
                    <Area
                        type="monotone"
                        dataKey="reçus"
                        stackId="1"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.3}
                    />
                    <Area
                        type="monotone"
                        dataKey="livrés"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                    />
                </AreaChart>
            </ResponsiveContainer>
            */}
        </div>
    );
}
