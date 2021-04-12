import { Component } from "@angular/core";
import * as XLSX from "xlsx";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = " XLSX TO JSON Convertidor";
  willDownload = false;
  listado: any[] = [];
  allItems: any[] = [];
  calculoCamion: any[] = [];
  cargasXCamion: any[] = [];
  camiones: any[] = [];
  placa: String;
  totalKms: number = 0;
  galonesXMes: string = "0";
  kmsXGalonMensual: string = "0";
  constructor() {}

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = event => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: "binary" });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      console.log("primer objeto", jsonData["Fac. Enero 2021"][0][" TOTAL "]);
      this.listado = jsonData["Fac. Enero 2021"];
      this.allItems = jsonData["Fac. Enero 2021"];
      const dataString = JSON.stringify(jsonData);
      this.setDownload(dataString);
      this.getTruckList();
    };
    reader.readAsBinaryString(file);
  }

  getTruckList() {
    this.listado.forEach(item => {
      if (!this.camiones.includes(item["PLACA"])) {
        this.camiones.push(item["PLACA"]);
      }
    });
  }

  /* TOTAL : " Q239.26 "
FECHA: "21-Jan"
GALONAJE: "13.680"
KILOMETRAJE: "51315"
No. VALE: "8075"
PLACA: "C428BSM"
PRECIO: "17.49" */

  generarCalculo() {
    //console.log("generar calculo por camion");
    this.cargasXCamion = [];
    this.allItems.forEach(item => {
      if (this.placa == item["PLACA"]) {
        // item.kmsXGalon = item
        this.cargasXCamion.push(item);
      }
    });

    /* for (let i = 0; i < this.cargasXCamion.length; i++) {
      this.cargasXCamion[i].kmsXGalon =
        parseFloat(this.cargasXCamion[i + 1]["KILOMETRAJE"]) -
        parseFloat(this.cargasXCamion[i]["KILOMETRAJE"]);
    } */

    this.listado = this.cargasXCamion;
    this.calcularKilometraje(this.cargasXCamion);
    this.calcularGalonaje(this.cargasXCamion);
  }

  calcularKilometraje(items: any) {
    let maxKm: number;
    let minKm: number;
    let kilometros: any[] = [];
    items.forEach(element => {
      kilometros.push(element["KILOMETRAJE"]);
    });
    maxKm = Math.max(...kilometros);
    minKm = Math.min(...kilometros);
    this.totalKms = maxKm - minKm;
  }

  calcularGalonaje(items) {
    let totalGalones: number = 0.0;
    let promedioKmsXGalon: number = 0.0;
    items.forEach(element => {
      totalGalones = totalGalones + parseFloat(element["GALONAJE"]);
    });
    this.galonesXMes = totalGalones.toFixed(3);
    
    console.log(` Kilometros ${this.totalKms} Galones ${totalGalones}` )
    promedioKmsXGalon = this.totalKms / totalGalones;
    //console.log("promedio", promedioKmsXGalon);
    this.kmsXGalonMensual = promedioKmsXGalon.toFixed(3);
    console.log("promedio", this.galonesXMes);
  }

  setDownload(data) {
    this.willDownload = true;
    setTimeout(() => {
      const el = document.querySelector("#download");
      el.setAttribute(
        "href",
        `data:text/json;charset=utf-8,${encodeURIComponent(data)}`
      );
      el.setAttribute("download", "xlsxtojson.json");
    }, 1000);
  }
}
