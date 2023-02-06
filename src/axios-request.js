const axios = require('axios').default;
const ENDPOINT_URL = 'https://pixabay.com/api/';
const KEY_REQUEST = '33271147-5afaaee1c63d4032ce2c866af';
const PARAMETERS = `&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;

export default class ImagApiServes {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async queryOnServer() {
    const response = await axios.get(
      `${ENDPOINT_URL}?key=${KEY_REQUEST}&q=${this.searchQuery}${PARAMETERS}&page=${this.page}`
    );
    this.incrementPage();
    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  page() {
    return this.page;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newSearch) {
    this.searchQuery = newSearch;
  }
}
