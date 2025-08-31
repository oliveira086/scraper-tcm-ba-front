import api from '../config/api';

const getAllCrawlers = async () => {
  try {
    let response = await api.get('/crawler');
    return response.data
  } catch (error) {
    return error.response.status;
  }
}

const editCrawler = async (params) => {
  try {
    let response = await api.post('/crawler/edit', params);
    return response.data
  } catch (error) {
    return error.response.status;
  }
}

const pauseCrawler = async (params) => {
  try {
    let response = await api.post('/crawler/pause', params);
    return response.data
  } catch (error) {
    return error.response.status;
  }
}

const gerarzip = async (params) => {
  try {
    let response = await api.post('/crawler/generate-zip', params);
    return response.data
  } catch (error) {
    return error.response.status;
  }
}


export { getAllCrawlers, editCrawler, pauseCrawler, gerarzip }