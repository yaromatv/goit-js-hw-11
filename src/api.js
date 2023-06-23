const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '37654239-10094e2a01db37edd26da2ebf';

export default class PicsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.total = 0;
  }

  async fetchQuery() {
    try {
      const response = await axios.get(
        `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&per_page=40&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`
      );

      const data = response.data;
      this.total = data.totalHits;
      this.pageIncrem();

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  pageIncrem() {
    this.page += 1;
  }

  pageReset() {
    this.page = 1;
  }
}
