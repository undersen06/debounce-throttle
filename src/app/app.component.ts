import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime, debounce, throttleTime, map, delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  canvasTimeScale = 5 * (window.innerWidth / 2);
  startTime: any;
  leftMargin = 100;
  title = 'debounce-throttle';

  paintColors = [this.getRandomColor(), this.getRandomColor(), this.getRandomColor()];



  ngOnInit(): void {
    let mouseContainer = document.getElementsByClassName('mouse-container')[0];
    this.canvas = document.getElementsByTagName('canvas')[0];

    this.canvas.width = window.innerWidth - 450;
    this.canvas.height = 600;
    this.canvasContext = this.canvas.getContext('2d');
    this.subscribeEvents(mouseContainer)

    this.initCanvasSetUp()
  }

  paintRect(lane, time) {
    if (time > this.canvasTimeScale) {
      this.startTime += time;
      time = 0;
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.initCanvasSetUp()
    }
    this.canvasContext.fillStyle = this.paintColors[lane];

    var x = (this.canvas.width - this.leftMargin) / this.canvasTimeScale * time + this.leftMargin;
    var y = this.canvas.height / this.paintColors.length * lane;
    var height = this.canvas.height / this.paintColors.length;
    var width = 1;

    this.canvasContext.fillRect(x, y, width, height);
  }

  initCanvasSetUp() {
    this.canvasContext.fillStyle = "transparent";
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvasContext.font = "200 18px Roboto,Helvetica,Arial";
    this.canvasContext.fillStyle = this.paintColors[0]
    this.canvasContext.fillText("Regular", 0, 100);

    this.canvasContext.fillStyle = this.paintColors[1]
    this.canvasContext.fillText("debounce", 0, 300);

    this.canvasContext.fillStyle = this.paintColors[2]
    this.canvasContext.fillText("throttle", 0, 500);
  }

  getTimeDiff() {
    var time = new Date().getTime();
    if (!this.startTime) {
      this.startTime = time;
    }
    time -= this.startTime;
    return time;
  }

  subscribeEvents(mouse) {
    this.subscribeRegular(mouse)
    this.subscribeDebounce(mouse)
    this.subscribeThottleTime(mouse)

  }
  subscribeRegular(mouse) {
    fromEvent(mouse, 'mousemove').pipe(
      map((data) => {
        return data;
      }),
    ).subscribe((x: any) => this.paintRect(0, this.getTimeDiff()));
  }

  subscribeDebounce(mouse) {

    fromEvent(mouse, 'mousemove').pipe(
      debounceTime(100),
      map((data) => {
        return data;
      }),
    ).subscribe((x: any) => this.paintRect(1, this.getTimeDiff()));
  }


  subscribeThottleTime(mouse) {
    fromEvent(mouse, 'mousemove').pipe(
      throttleTime(100),
      map((data) => {
        return data;
      }),
    ).subscribe((x: any) => this.paintRect(2, this.getTimeDiff()));
  }


  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }




}
