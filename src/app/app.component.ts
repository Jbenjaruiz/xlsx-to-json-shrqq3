import { Component } from "@angular/core";
import * as XLSX from "xlsx";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Este es el convertidor XLSX TO JSON ";
  willDownload = false;
  listado: any[] = [];
  allItems: any[] = [];
  calculoCamion: any[] = [];
  cargasXCamion: any[] = [];
  camiones: any[] = [];
  placa: String;
  totalKms: String = "0 Kms recorridos ";
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
      /*  document.getElementById("output").innerHTML = dataString
        .slice(0, 300)
        .concat("..."); */
      this.setDownload(dataString);
      //this.generarCalculo("C913BQF");
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

  generarCalculo() {
    console.log("generar calculo por camion");
    this.cargasXCamion = [];
    this.allItems.forEach(item => {
      /* if (!this.camiones.includes(item["PLACA"])) {
        this.camiones.push(item["PLACA"]);
      } */
      if (this.placa == item["PLACA"]) {
        this.cargasXCamion.push(item);

        console.log("camion:", item);
      }
    });
    console.log("camiones:", this.camiones);
    this.listado = this.cargasXCamion;
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
