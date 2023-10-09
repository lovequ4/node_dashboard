<template>
    <div class="q-pa-md">
      <q-layout view="hHh Lpr lff" container style="height: 500px " class="shadow-2 rounded-borders">
        <canvas id="myChart"  style="height: 500px"></canvas>
      </q-layout>
        
      <div style="display: flex; justify-content: space-between; ">  
        <q-layout id="temperature" view="hHh Lpr lff" container style="height: 300px;  margin-top: 2%; margin-right: 2%;" class="shadow-2 rounded-borders">
            <canvas id="temperatureChart" style="height: 300px; width: 300px;"></canvas>
        </q-layout>

        <q-layout view="hHh Lpr lff" container style="height: 300px; margin-top: 2%;" class="shadow-2 rounded-borders">
            <canvas id="humidityChart" style="height: 300px; width: 600px;"></canvas>
        </q-layout>
      </div>

    </div>
  </template>
  

<script>
import axios from 'axios'
import Chart from 'chart.js/auto';
import { format, parseISO } from 'date-fns';

export default {
  data() {
    return {
        chartData: [],
        temperatureData:[],
        humidity:[],
    };
  },
  async mounted() {
    try {
      await this.fetchDataAndCreateChart();
      
      setInterval(this.fetchDataAndCreateChart, 5000);
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    async fetchDataAndCreateChart() {
      try {
        const response = await axios.get('http://localhost:5000/api/sensor');
        console.log(response.data);
        this.chartData = response.data.map((dataItem) => ({
          ...dataItem,
          timestamp: format(parseISO(dataItem.timestamp), 'MM/dd HH:mm:ss'),
        }));
        this.updateChart();
        this.updateTemperatureChart();
        this.updateHumidityChart();
      } catch (e) {
        console.error(e);
      }
    },

    

    updateChart() {
      const ctx = document.getElementById('myChart').getContext('2d');
      
      if (this.chart && this.chart.data) {
        this.chart.data.labels = this.chartData.map((dataItem) => dataItem.timestamp);
        this.chart.data.datasets[0].data = this.chartData.map((dataItem) => dataItem.temperature);
        this.chart.data.datasets[1].data = this.chartData.map((dataItem) => dataItem.humidity);
        this.chart.update();
      } else {
        
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.chartData.map((dataItem) => dataItem.timestamp),
            datasets: [
              {
                label: 'Temperature',
                data: this.chartData.map((dataItem) => dataItem.temperature),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
              {
                label: 'Humidity',
                data: this.chartData.map((dataItem) => dataItem.humidity),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
           
          },
        });
      }
    },
    updateTemperatureChart() {
      const ctx = document.getElementById('temperatureChart').getContext('2d');
      
      
      
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.chartData.map((dataItem) => dataItem.timestamp),
          datasets: [
            {
              label: 'Temperature',
              data: this.chartData.map((dataItem) => dataItem.temperature),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
                beginAtZero: false,
                title: {
                display: true,
                text: '(°C)',
                },
            },
          },
        },
      });
    },
    updateHumidityChart() {
      const ctx = document.getElementById('humidityChart').getContext('2d');
      
      
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.chartData.map((dataItem) => dataItem.timestamp),
          datasets: [
            {
              label: 'Humidity',
              data: this.chartData.map((dataItem) => dataItem.humidity),
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
                beginAtZero: false,
                title: {
                display: true,
                text: '(%RH)',
                },
            },
          },
        },
      });
    },
  },
};
</script>



<style scoped>
.temperature{
   display: flex;
  justify-content: space-between;
}
</style>
