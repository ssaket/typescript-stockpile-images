import FetchProxy from "./FetchProxy"

export default class Unsplash {
    name: string;
    url: string;
    searchURL: string;
    clientId: string;
    params: any;
    
    constructor() {
      this.name = 'unsplash';
      this.url = "https://api.unsplash.com";
      this.searchURL = "/search/photos?";
      this.clientId = `${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`;
  
      this.params = {
        search: {
          query: null,
          page: 1,
          per_page: 20,
          order_by: "relevant",
          color: null,
          orientation: null,
        },
      };
    }
    
    searchByName(params: string | number | boolean) {
      return new Promise((resolve, reject) => {
        let queryString = "";
        let response;
        this.params["search"].query = encodeURIComponent(params);
        for (const [key, value] of Object.entries(this.params["search"])) {
          if (value) {
            queryString += `${key}=${value}`.concat("&");
          }
        }
        queryString =
          queryString.slice(0, queryString.length - 1) +
          "&client_id=" +
          this.clientId;
          const url = this.url + this.searchURL + queryString;
          const fetchProxy = new FetchProxy();
          fetchProxy.get(url).then((resp) => resp.json())
          .then((data) => {
            response = this.processResponse(data);
            resolve(response);
          });
      });
    }
  
    processResponse(response: { results: any; }) {
      const imageList: { id: any; src: any; }[] = [];
      const results = response.results;
      results.forEach((item: { id: any; urls: { regular: any; }; }) => {
        imageList.push({'id':item.id, 'src': item.urls.regular});
      });
      return imageList;
    }
  }