import React from 'react';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import './style.scss'

ChartJS.register(ArcElement, Tooltip, Legend);

const colors = [
    {
        offset0: '#ff7875',
        offset1: '#f5222d'
    },
    {
        offset0: '#ffd591',
        offset1: '#fa8c16'
    },
    {
        offset0: '#b7eb8f',
        offset1: '#52c41a'
    },
    {
        offset0: '#d3adf7',
        offset1: '#722ed1'
    },
    {
        offset0: '#87e8de',
        offset1: '#13c2c2'
    },
    {
        offset0: '#ffadd2',
        offset1: '#eb2f96'
    }
]

const labelInternalChart = [
    {
        name: "Pre-sale",
        ratio: "45",
        backgroundColor: '#ED456C'
    },
    {
        name: "Liquidity",
        ratio: "45",
        backgroundColor: '#159DE3'
    },
    {
        name: "Development team",
        ratio: "5",
        backgroundColor: '#F7AC0A'
    },
    {
        name: "Airdrop",
        ratio: "3",
        backgroundColor: '#2CA665'
    },
    {
        name: "Marketing",
        ratio: "2",
        backgroundColor: '#FF938A'
    }
]

function DoughnutChart() {
    const data = {
        datasets: [{
            label: 'My First Dataset',
            data: [4500, 4500, 500, 300, 200],
            backgroundColor: labelInternalChart.map(e => e.backgroundColor),
            hoverOffset: 6
        }]
    };

    return (
        <div className="doughnut-chart">
            <div className="chart">
                <Doughnut
                    data={data}
                    options={
                        {
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            console.log(context)
                                            return `${context?.formattedValue || 0} FNY`
                                        }
                                    }
                                }
                            }
                        }
                    }
                />
            </div>

            <div className="note-chart">
                <div className="total">
                    <div>TOTAL SUPPLY</div>
                    <div>10,000 FNY</div>
                </div>

                <div>
                    {
                        labelInternalChart.map((e, index) => (
                            <div key={index} className="note-item">
                                <div className="left">
                                    <span className="round" style={{ backgroundColor: e.backgroundColor }} />
                                    <div>
                                        <div>{e.name}</div>
                                    </div>
                                </div>
                                <div>{e.ratio}%</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default DoughnutChart;
