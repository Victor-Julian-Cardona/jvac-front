import Donutty from "donutty";
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const IncomePieChart = () => {

    const incomes = useSelector(state => state.incomeSlice.incomes, isEqual);

    useEffect(() => {
        const recurrenceMultiplier = {
            "None": 1,
            "Weekly": 52,
            "Bi-Weekly": 26,
            "Monthly": 12,
            "Quarterly": 4,
            "Yearly": 1
        };

        const yearlyIncomes = incomes.reduce((acc, income) => {
            const yearlyAmount = income.amount * (recurrenceMultiplier[income.recurrence] || 0);
            acc[income.category] = (acc[income.category] || 0) + yearlyAmount;
            return acc;
        }, {});

        const totalIncome = Object.values(yearlyIncomes).reduce((a, b) => a + b, 0);

        Object.entries(yearlyIncomes).forEach(([category, amount], index) => {
            const percentage = (amount / totalIncome) * 100;
            const chartId = `chart-${index}`;

            // Create a container for each category's donut chart
            const chartContainer = document.createElement("div");
            chartContainer.id = chartId;
            document.getElementById("pieChartContainer").appendChild(chartContainer);

            // Create the donut chart
            new Donutty(`#${chartId}`, {
                size: 120,
                min: 0,
                max: 100,
                value: percentage,
                cap: "round",
                thickness: 20,
                emptyColor: "rgba(0, 0, 0, 0.1)",
                fillColor: `hsl(${360 * Math.random()}, 70%, 50%)`,
                animation: {
                    duration: 500
                },
                onDraw: (circle) => {
                    circle.setAttribute('stroke-dashoffset', `calc(440 - (440 * ${percentage}) / 100)`);
                }
            });

            // Add labels or legends here
            chartContainer.innerHTML += `<p>${category}: ${percentage.toFixed(2)}%</p>`;
        });
    }, [incomes]); // Effect runs when 'incomes' changes

    return (
        <div id="pieChartContainer"></div>
    );
};

export default IncomePieChart;
