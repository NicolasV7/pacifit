import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const options: ApexOptions = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  },
  yaxis: {
    labels: {
      formatter: (val) => val.toLocaleString('de-DE'),
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',
    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: (val) => val.toLocaleString('de-DE'),
    },
  },
};

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
  totalEntradas: number;
  totalGastos: number;
  data: { tipo: string; monto: number; fecha: string }[];
}

const ChartTwo: React.FC = () => {
  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: 'Entradas',
        data: [],
      },
      {
        name: 'Gastos',
        data: [],
      },
    ],
    totalEntradas: 0,
    totalGastos: 0,
    data: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/suma`);
      const data = await response.json();

      let totalEntradas = 0;
      let totalGastos = 0;

      const groupedData = {
        entradas: Array(7).fill(0),
        gastos: Array(7).fill(0),
      };

      data.forEach((item: { tipo: string; monto: number }) => {
        const monto = Number(item.monto);

        if (item.tipo === 'Entrada') {
          groupedData.entradas[0] += monto; // Agrupar todas las entradas en el primer día
          totalEntradas += monto;
        } else if (item.tipo === 'Gasto') {
          groupedData.gastos[0] += monto; // Agrupar todos los gastos en el primer día
          totalGastos += monto;
        }
      });

      setState({
        series: [
          {
            name: `Entradas (${totalEntradas.toLocaleString('de-DE')})`,
            data: groupedData.entradas,
          },
          {
            name: `Gastos (${totalGastos.toLocaleString('de-DE')})`,
            data: groupedData.gastos,
          },
        ],
        totalEntradas,
        totalGastos,
        data, // Todos los datos
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const generatePDF = async () => {
    const input = document.getElementById('chartTwo');
    if (input) {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 4, canvas.height / 4);

      pdf.setFontSize(16);
      pdf.text('Reporte de Entradas y Gastos', 10, canvas.height / 4 + 20);

      pdf.setFontSize(12);
      pdf.text('Movimientos:', 10, canvas.height / 4 + 30);

      let yPosition = canvas.height / 4 + 40;
      state.data.forEach((item) => {
        const fecha = new Date(item.fecha).toLocaleDateString('es-ES');
        pdf.text(`${fecha}: ${item.tipo} - $${item.monto.toLocaleString('de-DE')}`, 10, yPosition);
        yPosition += 10;
      });

      yPosition += 10;
      pdf.setFontSize(14);
      pdf.text(`Total Entradas: $${state.totalEntradas.toLocaleString('de-DE')}`, 10, yPosition);
      yPosition += 10;
      pdf.text(`Total Gastos: $${state.totalGastos.toLocaleString('de-DE')}`, 10, yPosition);

      // Obtener la fecha actual y formatearla como "año-mes-día"
      const fechaHoy = new Date().toISOString().split('T')[0];
      pdf.save(`Reporte-${fechaHoy}.pdf`);
    }
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Movimientos
          </h4>
        </div>
      </div>
      <div>
        <button onClick={generatePDF} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
          Generar Reporte
        </button>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
