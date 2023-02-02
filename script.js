const { createApp } = Vue

createApp({
  data() {
    return {
      // artist1: './img/1.jpg',
      // artist2: './img/2.jpg',
      resultCount: 0,
      resultArray: [],
      items: {

      },
      displayedResults: [],
      genreArray: [],
      clicked_genre: {},
      arrayy: [],
      genres: {},
    
      filter: "",
      all: true,
      num_genres: 0,
      sortby: "Reset to original",
      options: ["Reset to original", "Collection Name", "Price"],
      sortedResults: [],
      hover: [false, false, false],
      tabarray:[]
    }
  },
  methods: {

    searchForArtist: function () {
      this.sortby = "Reset to original";
      this.clicked_genre = {}
      this.num_genres = 0;
      axios
        .get('https://itunes.apple.com/search?term=' + this.artistInputVal + '&attribute=allArtistTerm&limit=50&country=US')
        .then(response => response.data)
        .then((data) => {
          {
            console.log(data)
            this.handleResults(data)
            if (data.resultCount == 0) {
              alert("Artist '" + this.artistInputVal + "' not found!"  )
            }
          }
        })
      this.all = true;

    },
    handleResults(data) {
      this.genreArray = []
      this.genres = {}
      this.resultCount = data.resultCount
      this.resultArray = data.results
      this.displayedResults = data.results

      this.resultArray.forEach((element,i) => {
        //console.log(element.primaryGenreName)
        this.tabarray[i] = "desc"
        if (!this.genres[element.primaryGenreName]) {
          this.num_genres++;
          this.genreArray.push(element.primaryGenreName);
          this.genres[element.primaryGenreName] = []
          this.clicked_genre[element.primaryGenreName] = false
        }
        this.genres[element.primaryGenreName].push(element)
      });
      



   

    },
    load_genre_results(data) {
      if(data == "ALL"){}
      else{}
      this.arrayy = []
      if (this.clicked_genre[data]) {
        this.clicked_genre[data] = false
      }
      else {
        this.clicked_genre[data] = true
      }


      //console.log(this.genres[data])
      count_true = 0;
    
      for (let key in this.clicked_genre) {
        //  console.log(this.genres[key])
        if (this.clicked_genre[key] == true) {

          count_true++;

          for (let track in this.genres[key]) {
            //console.log(this.genres[key][track])
            this.arrayy.push(this.genres[key][track]);

          }

          
          this.displayedResults =this.arrayy
          this.resultCount = this.displayedResults.length

          if (this.sortby == "Price") {
            this.handleSorting("Price");
          }
          if (this.sortby == "Collection Name") {
            this.handleSorting("Collection Name")
          }




        }
      }

      if (count_true > 0) {
        this.all = false;
      }
      else {
        this.all = true;
      }
      if (count_true == this.num_genres) {
       
        for (let key in this.clicked_genre) {
          this.clicked_genre[key] = false;

        }
        this.all = true;
       
        this.displayedResults = this.resultArray
        this.resultCount = this.displayedResults.length

      }

      if (this.all) {
        this.displayedResults= [];
        this.displayedResults = this.resultArray
        this.resultCount = this.displayedResults.length



      }
      

    },
    remove_all_genres: function () {
      this.displayedResults = [];
      console.log(this.resultArray)
      this.displayedResults = this.resultArray
      this.resultCount = this.displayedResults.length
      this.all = true;
      
      for (let key in this.clicked_genre) {
        this.clicked_genre[key] = false;

      }
    







    },
    handleSorting(data) {
      if (data == "Reset to original") {
        this.remove_all_genres();



      }
    
      if (data == "Price") {
        this.displayedResults.sort((a, b) => a.collectionPrice
          - b.collectionPrice
        );
       
      }
      if (data == "Collection Name") {
        this.displayedResults.sort((a, b) => {
  
          const nameA = a.collectionName;
          const nameB = b.collectionName;
          if (!nameA || !nameB) {
            if (!nameA && !nameB) {
              return 0;
            }
            else if (nameA) {
              return -1;
            }
            else {
              return 1;
            }
          }
          nameA.toUpperCase(); // ignore upper and lowercase
          nameB.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });
      }


    },






  }

}).mount('#app')
