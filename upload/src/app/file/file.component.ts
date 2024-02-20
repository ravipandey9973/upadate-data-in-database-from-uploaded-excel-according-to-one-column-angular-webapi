import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatListOption } from '@angular/material/list';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrl: './file.component.css'
})
export class FileComponent implements OnInit {

 

  dataSource = new MatTableDataSource<any>();
  columns: string[] = [];
  filteredColumns: string[] = [];
  searchTerm: string = '';
  isUploaded: boolean = false;
  metricid:string="";
  editData:any;
  selectedRow:any

constructor(private record :ServicesService) {}

  ngOnInit(): void {
    
    
  }
 

  onFileSelected(event: any): void {
    
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
  
        // Extract all columns as string array
        this.columns = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 })[0];
  
        // Filter the columns to only include "metricid"
        this.filteredColumns = this.columns.filter(column => column.toLowerCase() === 'metricid');
  
        // Extract and display data for the "metricid" column
        this.dataSource.data = XLSX.utils.sheet_to_json<any>(sheet, {
          header: 1,
          defval: '',
        }).map(row => ({ metricid: row[this.columns.indexOf('metricid') as any] }));
      };
      reader.readAsBinaryString(file);
     
     
    }
  }
  
  
  
  searchColumn(): void {
    const filterValue = this.searchTerm.toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
 uploadFile(): void {
  if (this.dataSource.data.length > 0) {
    Swal.fire({
      title: 'Good job!',
      text: 'File uploaded successfully!',
      icon: 'success'
    });
    this.isUploaded = true;
    const allMetricIds = this.dataSource.data.map(row => row.metricid);
    console.log('All Metric IDs:', allMetricIds);
  
  } else {
    Swal.fire({
      title: 'Error!',
      text: 'Please choose a file before uploading!!',
      icon: 'error'
    });
   
  }
  }
 
  selectRow(row: any): void {
    this.selectedRow = row;
  }
  updateTable(): void {
    const allMetricIds = this.dataSource.data.reduce((acc, row) => acc.concat(row.metricid), []);
  
    this.record.updatefile({ metricid: allMetricIds }).subscribe(
      data => {
        Swal.fire({
          title: 'Good job!',
          text: 'IsManadatory column update successfully!',
          icon: 'success'
        });
      },
      error => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to Updated !!',
          icon: 'error'
        });
       
      }
    );
  }
  

}
