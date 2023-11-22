import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LoaderService } from 'src/app/shared';

import Chart from 'chart.js/auto';
import { DashboardService } from '../../services/dash-board.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() response = [];
  averageRating: number = 0;
  activeIndex: number = 0;
  parkingLotsReview: any = [];
  data: any;
  id: any;
  parkingLotDropdown: any;
  parkingLotDropdownList: any
  activeChart: string = 'DayChart'
  public chart: any;
  chartData: any;
  currentCanvasId: string = 'DayChart';
  @ViewChild('dynamicCanvas') dynamicCanvas!: ElementRef;
  surveyValue: any = 1;
  statesValue: boolean = false;

  selectedParkingLot: any;
  options: any;
  Earningdetails: any;
  totalBookings: any;
  totalEarning: any;
  peakHoursStartTime: any;
  peakHoursEndTime: any;
  //stars: number[] = [1, 2, 3]; 
  constructor(private service: DashboardService, private loaderService: LoaderService) {

  }
  getStarArray(rating: number): number[] {
    const starArray = [];
    for (let i = 0; i < rating; i++) {
      starArray.push(i < rating ? 1 : 0);
    }
    return starArray;
  }
  buttonStyles = [
    { label: "Day", chartType: 'DayChart', active: true },
    { label: "Weekly", chartType: 'WeekChart', active: false },
    { label: "Yearly", chartType: 'YearlyChart', active: false },
  ];
  updateButtonStyles(chartType: string) {

    this.buttonStyles.forEach(button => {
      button.active = button.chartType === chartType;
    });
  }


  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };
    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };
    this.getParkingLotsStates();
    this.GetReviewsByParkingLotId();
    this.getParkingLotByStatesName("");
  }

  dashboard: any[] = [];
  first: number = 0;
  rows: number = 10;

  getSerialNumber(index: number): number {
    return index + 1;
  }

  showCount(vehicleCount: number): boolean {
    return vehicleCount > 3;
  }
  selectedState: String = "";

  getParkingLotByStatesName(state: String) {

    this.selectedState = state;
    this.loaderService.showLoader()
    this.service.getParkingLotByStatesName(state)
      .pipe(
        finalize(() => this.loaderService.hideLoader())
      ).subscribe({
        next: (response: any) => {

          this.parkingLotDropdown = response;
          this.id = response[0].id;
          this.loaderService.hideLoader()
        }
      })
    this.service.getAllBookingEarningDetails(state)
      .pipe(
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe(
        {
          next: (response: any) => {
            this.Earningdetails = response
            this.totalBookings = response.totalBookings
            this.totalEarning = response.totalEarning
            this.peakHoursStartTime = response.peakHoursStartTime
            this.peakHoursEndTime = response.peakHoursEndTime
          }
        })
    if (this.selectedState) {
      this.getParkingLotSurveyOverallRecord(this.surveyValue);
      this.GetReviewsByParkingLotId();
    }


  }
  stateCount: Number = 1;
  getParkingLotsStates() {
    this.service.getParkingLotsStates()
    .pipe(
      finalize(() => this.loaderService.hideLoader())
    )
    .subscribe({
      next: (respose: any) => {
        this.response = respose;
        this.stateCount = this.response.length;
        this.create("DayChart");
      }

    })
  }
  totalReview: Number = 1;
  GetReviewsByParkingLotId() {
    this.service.getReviewsByParkingLotId(this.selectedState)
    .pipe(
      finalize(() => this.loaderService.hideLoader())
    )
    .subscribe({
      next: (respose: any) => {
        //get first two data
        this.averageRating = respose.averageRating;

        this.parkingLotsReview = respose.data.slice(0, 2);
        this.totalReview = this.parkingLotsReview[0].parkingLotRating;
      }
    })
  }
  GetTruckTypesByParkingLotId() {
    const selectedId = this.selectedParkingLot.id;
    this.service.getTruckTypesByParkingLotId(selectedId)
      .pipe(
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe(
        {
          next: (respose: any) => {
            this.parkingLotDropdownList = respose;
          }
        })
  }
  GetAllBookingEarningDetails(state: string) {
    this.service.getAllBookingEarningDetails(state)
      .pipe(
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe({
        next: (respose: any) => {
          this.response = respose
        }
      })
  }


  fieldNames: string[] = [];
  fieldValues: number[] = [];

  getParkingLotSurveyOverallRecord(status: any) {
    this.service.getParkingLotSurveyOverallRecord(status, this.selectedState)
      .pipe(
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe(
        {
          next: (respose: any) => {
            this.fieldNames = [];
            this.fieldValues = [];
            this.chartData = respose;

            for (const key in this.chartData) {
              if (this.chartData.hasOwnProperty(key)) {
                this.fieldNames.push(key);
                this.fieldValues.push(this.chartData[key]);
              }
            }
            if (status === 1) {

              this.createChart();
            }
            else if (status == 2) { this.DemoChart2(); }
            else if (status == 3) { this.DemoChart3(); }
          }
        })
  }

  getParkingLotSurveyOverall(status: any, id: AnyCatcher) {
    this.service.getParkingLotSurveyOverall(status, id, this.selectedState)
      .pipe(
        finalize(() => this.loaderService.hideLoader())
      )
      .subscribe(
        {
          next: (respose: any) => {
            this.fieldNames = [];
            this.fieldValues = [];
            this.chartData = respose;

            for (const key in this.chartData) {
              if (this.chartData.hasOwnProperty(key)) {
                this.fieldNames.push(key);
                this.fieldValues.push(this.chartData[key]);
              }
            }
            if (status === 1) {

              this.createChart();
            }
            else if (status == 2) { this.DemoChart2(); }
            else if (status == 3) { this.DemoChart3(); }


          }
        })
  }

  ngAfterViewInit() {
    // Initialize the canvas with a default ID
    this.dynamicCanvas.nativeElement.id = this.currentCanvasId;
  }
  //btnData: { label: string, chartType: string, active: boolean }
  create(canvasId: string) {
    if (this.chart) {
      this.chart.destroy();
    }
    //btnData.active = true;
    this.currentCanvasId = canvasId;
    this.dynamicCanvas.nativeElement.id = canvasId;
    if (canvasId === 'DayChart') {
      this.surveyValue = 1;
      this.getParkingLotSurveyOverall(this.surveyValue, this.id);
      //this.createChart();
      this.updateButtonStyles(canvasId);
    } else if (canvasId === 'WeekChart') {
      this.surveyValue = 2;
      this.getParkingLotSurveyOverall(this.surveyValue, this.id);
      // this.getParkingLotSurveyOverall(1);
      this.updateButtonStyles(canvasId);
      //this.DemoChart2();

    } else if (canvasId === 'YearlyChart') {
      this.surveyValue = 3;
      this.getParkingLotSurveyOverall(this.surveyValue, this.id);
      this.updateButtonStyles(canvasId);
      //this.DemoChart3();
    }
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    const data = this.fieldValues;
    const total = data.reduce((a, b) => a + b, 0);
    const percentageData = data.map(value => ((value / total) * 100).toFixed(2));
    const label = this.fieldNames;
    const backgroundColors = ['#83A3FF', '#FFDD9A'];
    const textColors = backgroundColors;
    const labelsWithPercentage = label.map((label, index) => ({
      label: `${label} (${percentageData[index]}%)`,
      color: textColors[index],
    }));
    this.data = labelsWithPercentage;

    Chart.register(percentageCenterPlugin);

    this.chart = new Chart(this.currentCanvasId, {
      type: 'doughnut',
      data: {
        labels: labelsWithPercentage.map(item => item.label), // Us,
        datasets: [{
          label: 'My First Dataset',
          data: data,
          backgroundColor: backgroundColors,
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          tooltip: {
            enabled: false,
          },

          legend: {
            title: {
              display: true,
              text: 'Survey Overall ',
              font: {
                weight: '500',
                size: 16,
              },
              padding: {
                bottom: 5,
                top: 0,

              },
              position: 'start'
            },
            display: true,
            position: 'left',
            labels: {
              usePointStyle: true,
              font: {
                weight: "400",
                size: 14,
              },
            },
          },
        },
        animation: {
          animateScale: true,  // Enable scaling animation
          animateRotate: true, // Enable rotation animation
          duration: 1000,      // Animation duration in milliseconds
          easing: 'easeOutQuart', // Easing function for the animation
        }
      }
    });
  }
  //Second
  record: any;
  DemoChart2() {
    if (this.chart) {
      this.chart.destroy();
    }
    const data = this.fieldValues;
    const total = data.reduce((a, b) => a + b, 0);
    const percentageData = data.map(value => ((value / total) * 100).toFixed(2));
    const label = this.fieldNames;
    const backgroundColors = ['#83A3FF', '#FFDD9A'];
    const textColors = backgroundColors;
    const labelsWithPercentage = label.map((label, index) => ({
      label: `${label} (${percentageData[index]}%)`,
      color: textColors[index],
    }));
    this.data = labelsWithPercentage;

    Chart.register(percentageCenterPlugin);

    this.chart = new Chart(this.currentCanvasId, {
      type: 'doughnut',
      data: {
        labels: labelsWithPercentage.map(item => item.label), // Us,
        datasets: [{
          label: 'My First Dataset',
          data: data,
          backgroundColor: backgroundColors,
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Survey Overall ',
              font: {
                weight: '400',
                size: 16
              },
              padding: {
                bottom: 5,
                top: 0,

              },
              position: 'start'
            },
            labels: {
              usePointStyle: true,
              font: {
                weight: "400",
                size: 14
              }
            }
          },
        },
        animation: {
          animateScale: true,  // Enable scaling animation
          animateRotate: true, // Enable rotation animation
          duration: 1000,      // Animation duration in milliseconds
          easing: 'easeOutQuart', // Easing function for the animation
        }
      }
    });
  }
  DemoChart3() {
    if (this.chart) {
      this.chart.destroy();
    }
    const data = this.fieldValues;
    const total = data.reduce((a, b) => a + b, 0);
    const percentageData = data.map(value => ((value / total) * 100).toFixed(2));
    const label = this.fieldNames;
    const backgroundColors = ['#83A3FF', '#FFDD9A'];
    const textColors = backgroundColors;
    const labelsWithPercentage = label.map((label, index) => ({
      label: `${label} (${percentageData[index]}%)`,
      color: textColors[index],
    }));
    this.data = labelsWithPercentage;

    Chart.register(percentageCenterPlugin);

    this.chart = new Chart(this.currentCanvasId, {
      type: 'doughnut',
      data: {
        labels: labelsWithPercentage.map(item => item.label), // Us,
        datasets: [{
          label: 'My First Dataset',
          data: data,
          backgroundColor: backgroundColors,
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Survey Overall',
              font: {
                weight: '400',
                size: 16
              },
              padding: {
                bottom: 5,
                top: 0,

              },
              position: 'start'
            },
            labels: {
              usePointStyle: true,
              font: {
                weight: "400",
                size: 14
              }
            }
          },
        },
        animation: {
          animateScale: true,  // Enable scaling animation
          animateRotate: true, // Enable rotation animation
          duration: 1000,      // Animation duration in milliseconds
          easing: 'easeOutQuart', // Easing function for the animation
        }
      }
    });
  }
}

const percentageCenterPlugin = {
  id: 'percentageCenterPlugin',
  beforeDraw: function (chart: { width: any; height: any; ctx: any; }) {
    const width = chart.width;
    const height = chart.height;
    const ctx = chart.ctx;
    const text = ''; // Customize your center text here
    const fontSize = 14; // Customize the font size
    const transparency = 0.5; // Customize the transparency here (0 to 1)
    ctx.restore();
    // Set the text color with transparency
    ctx.fillStyle = `rgba(0, 0, 0, ${transparency})`; // Black text with transparency
    ctx.font = fontSize + 'px Verdana, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const centerX = width / 2;
    const centerY = height / 2;
    ctx.fillText(text, centerX + 80, centerY);
    ctx.save();
  }

}

