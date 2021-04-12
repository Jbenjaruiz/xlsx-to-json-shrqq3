import { Injectable } from "@angular/core";
//import * as FileSaver from 'file-saver'
import * as XLSX from "xlsx";
const EXECL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8";
const EXCEL_EXT = ".xlsx";

@Injectable({
  providedIn: "root"
})
export class ExcellExporterService {
  constructor() {}

  exportTableToExcel(element: HTMLElement, Name: string): void {
    //let element = document.getElementById("testTable");
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, Name);

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });
    this.saveAsExcel(excelBuffer, Name);
  }

  private saveAsExcel(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], { type: EXECL_TYPE });
    // FileSaver.saveAs(data, fileName + EXCEL_EXT);
  }
}
