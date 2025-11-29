"use client"

import { Bar, BarChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A stacked bar chart with a legend"

const chartConfig = {
    price: {
        label: "Avg Price",
        color: "hsl(var(--chart-1))",
    },
    stock: {
        label: "Avg Stock",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

interface ChartTooltipAdvancedProps {
    data: { name: string; price: number; stock: number }[]
}

export function ChartTooltipAdvanced({ data }: ChartTooltipAdvancedProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Price vs Stock</CardTitle>
                <CardDescription>
                    Average Price and Stock per Category
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <Bar
                            dataKey="price"
                            stackId="a"
                            fill="var(--color-price)"
                            radius={[0, 0, 4, 4]}
                        />
                        <Bar
                            dataKey="stock"
                            stackId="a"
                            fill="var(--color-stock)"
                            radius={[4, 4, 0, 0]}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    className="w-[180px]"
                                    formatter={(value, name, item, index) => (
                                        <>
                                            <div
                                                className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                                                style={
                                                    {
                                                        "--color-bg": `var(--color-${name})`,
                                                    } as React.CSSProperties
                                                }
                                            />
                                            {chartConfig[name as keyof typeof chartConfig]?.label ||
                                                name}
                                            <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                                                {value}
                                                <span className="text-muted-foreground font-normal">
                                                    {name === 'price' ? '$' : 'units'}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                />
                            }
                            cursor={false}
                            defaultIndex={1}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
