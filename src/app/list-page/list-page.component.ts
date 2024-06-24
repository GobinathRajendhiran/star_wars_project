import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent implements OnInit {

  constructor(private http: HttpClient) {}

  totalData: any;
  movieList: any[] = [];
  speciesList: any[] = [];
  vehicleList: any[] = [];
  starShipList: any[] = [];
  birthYearList: any[] = [];

  ngOnInit(): void {
    this.totalData = [];
    this.http.get('https://swapi.dev/api/people').subscribe(async (data: any) => {
      this.totalData = data.results;
      this.filteresDataFromTotalData = this.totalData;
      console.log(this.totalData)
      this.getVehicleDetails();
      this.getStarShipsDetails();
      this.getFilmsDetails();

      for(let i in this.totalData) {
        this.totalData[i].id = Date.now();
        let url = this.totalData[i].species.length ? this.totalData[i].species[0] : null;
        // get species name by url
        this.birthYearList.push(this.totalData[i].birth_year);
        if(url != null) {
          this.http.get(url).subscribe((data: any) => {
            this.totalData[i].speciesType = data.name;
            this.speciesList.push(data);
          })
        } else {
          this.totalData[i].speciesType = 'Human';
        }
      }

      this.movieList = [...new Set(this.movieList)];
      this.speciesList = [...new Set(this.speciesList)];
      this.starShipList = [...new Set(this.starShipList)];
      this.vehicleList = [...new Set(this.vehicleList)];
      this.birthYearList = [...new Set(this.birthYearList)];
      console.log(this.movieList, this.speciesList, this.starShipList, this.vehicleList, this.birthYearList)
    })
  }

  getVehicleDetails() {
    for(let i in this.totalData) {
      for(let j in this.totalData[i].vehicles) {
        let url = this.totalData[i].vehicles[j];
        new Promise((resolve, reject) => {
          this.http.get(url).subscribe(data => {
            this.totalData[i].vehicles[j] = data;
            this.vehicleList.push(data);
            resolve("Completed")
          }, err => {
            reject("Not completed")
          })
        }).then(ele => {
          // console.log("Completed", ele);
        }).catch(err => {
          // console.log("rejected", err)
        })
      }
    }
  }

  getStarShipsDetails() {
    for(let i in this.totalData) {
      for(let j in this.totalData[i].starships) {
        let url = this.totalData[i].starships[j];
        new Promise((resolve, reject) => {
          this.http.get(url).subscribe(data => {
            this.totalData[i].starships[j] = data;
            this.starShipList.push(data);
            resolve("Completed")
          }, err => {
            reject("Not completed")
          })
        }).then(ele => {
          // console.log("Completed", ele);
        }).catch(err => {
          // console.log("rejected", err)
        })
      }
    }
  }

  getFilmsDetails() {
    for(let i in this.totalData) {
      for(let j in this.totalData[i].films) {
        let url = this.totalData[i].films[j];
        if(url) {
          new Promise((resolve, reject) => {
            this.http.get(url).subscribe(data => {
              this.totalData[i].films[j] = data;
              this.movieList.push(data);
              resolve("Completed")
            }, err => {
              reject("Not completed")
            })
          }).then(ele => {
            // console.log("Completed", ele);
          }).catch(err => {
            // console.log("rejected", err)
          })
        }
      }
    }
  }

  filteresDataFromTotalData: any;
  selectedMovie = 'Movie Name';
  selectedSpecies = 'Species';
  selectedVehicle = 'Vehicle';
  selectedStarShip = 'Star ship';
  selectedBirthYear = 'Birth year';
  selectedDataToPreview: any;
  tableSection : boolean = true;
  previewSection : boolean = false;

  filterDataOnTable() {
    this.filteresDataFromTotalData = [];

    this.filteresDataFromTotalData = this.totalData.filter((ele: any) => {
      var MOVIE = this.selectedMovie != 'Movie Name' ? this.filterByMovieName(ele.films) : true;
      var SPECIES = this.selectedSpecies != 'Species' ? this.filterBySpeciesName(ele.speciesType) : true;
      var VEHICLE = this.selectedVehicle != 'Vehicle' ? this.filterByVehicleName(ele.vehicles) : true;
      var STAR_SHIP = this.selectedStarShip != 'Star ship' ? this.filterByStarShipName(ele.starships) : true;
      var BIRTH_YEAR = this.selectedBirthYear != 'Birth year' ? this.filterByBirthYear(ele.birth_year) : true;

      return MOVIE && SPECIES && VEHICLE && STAR_SHIP && BIRTH_YEAR
    })
  }

  filterByMovieName(movieList: any) {
    if(movieList.length) {
      return movieList.some((ele: any) => ele.title == this.selectedMovie)
    } else {
      return false
    }
  }

  filterBySpeciesName(species: any) {
    return species == this.selectedSpecies;
  }

  filterByVehicleName(vehicle: any) {
    if(vehicle.length) {
      return vehicle.some((ele: any) => ele.name == this.selectedVehicle)
    } else {
      return false
    }
  }

  filterByStarShipName(starShip: any) {
    if(starShip.length) {
      return starShip.some((ele: any) => ele.name == this.selectedStarShip)
    } else {
      return false
    }
  }

  filterByBirthYear(birthYear: any) {
     return birthYear == this.selectedBirthYear
  }

  selectSingleDataFromTable(id: any) {
    var index = this.totalData.findIndex((ele: any) => ele.id === id);
    this.selectedDataToPreview = this.totalData[index];
    this.tableSection = false;
    this.previewSection = true;
  }

  navigateToTablePage() {
    this.tableSection = true;
    this.previewSection = false;
  }
}
