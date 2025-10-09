import React, {useEffect, useRef} from "react";
// import Chart from "chart.js/auto";


const PerformanceChart: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient1.addColorStop(0, "rgba(100, 181, 246, 0.5)");
        gradient1.addColorStop(1, "rgba(100, 181, 246, 0)");

        const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient2.addColorStop(0, "rgba(255, 167, 38, 0.5)");
        gradient2.addColorStop(1, "rgba(255, 167, 38, 0)");

        // new Chart(ctx, {
        //     type: "line",
        //     data: {
        //         labels: ["01", "02", "03", "04", "05", "06", "07"],
        //         datasets: [
        //             {
        //                 label: "This month",
        //                 data: [6.5, 5.8, 7.2, 6.8, 8.5, 7.5, 9.2],
        //                 borderColor: "#64b5f6",
        //                 backgroundColor: gradient1,
        //                 borderWidth: 2,
        //                 fill: true,
        //                 tension: 0.4,
        //             },
        //             {
        //                 label: "Last month",
        //                 data: [7.0, 6.2, 6.5, 7.5, 6.2, 7.8, 8.8],
        //                 borderColor: "#ffa726",
        //                 backgroundColor: gradient2,
        //                 borderWidth: 2,
        //                 fill: true,
        //                 tension: 0.4,
        //             },
        //         ],
        //     },
        //     options: {
        //         responsive: true,
        //         maintainAspectRatio: true,
        //         plugins: {legend: {display: false}},
        //         scales: {
        //             y: {
        //                 beginAtZero: true,
        //                 max: 12,
        //                 ticks: {
        //                     // callback: (value) => value + "h",
        //                     color: "#999",
        //                 },
        //                 grid: {color: "#f1f1f1"},
        //             },
        //             x: {grid: {display: false}, ticks: {color: "#999"}},
        //         },
        //     },
        // });
    }, []);

    return (
        <div className="chart-card">
            <div className="chart-header">
                <h2 className="chart-title">Performance</h2>
                <select className="date-filter">
                    <option>01-07 May</option>
                    <option>08-14 May</option>
                    <option>15-21 May</option>
                    <option>22-28 May</option>
                </select>
            </div>
            <canvas ref={canvasRef} height={80}></canvas>
        </div>
    );
};

export default PerformanceChart;
