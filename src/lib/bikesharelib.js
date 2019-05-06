import axios from 'axios'
import config from '../config'

const getBikeshareData = async (endpoint) => {
  const headers = { headers: { 'client-name': config.clientName } }
  const response = await axios.get(endpoint, headers)
  return response.data.data
}

const getEndpoints = async (apiAutoDiscoveryUrl) => {
  const autodiscoveryFile = await getBikeshareData(apiAutoDiscoveryUrl)
  const feeds = autodiscoveryFile.nb.feeds
  const stationInformationEndpoint = feeds.find(feed => feed.name === 'station_information').url
  const stationStatusEndpoint = feeds.find(feed => feed.name === 'station_status').url
  return {
    stationInformationEndpoint,
    stationStatusEndpoint
  }
}

const sortAlphabetically = (stations) => {
  return stations.sort((a, b) => {
    if (a.name < b.name) {
      return -1
    } else if (b.name < a.name) {
      return 1
    } else {
      return 0
    }
  })
}

const getStations = async (apiAutoDiscoveryUrl) => {
  const { stationInformationEndpoint, stationStatusEndpoint } = await getEndpoints(apiAutoDiscoveryUrl)
  const [stationInformation, stationStatus] = await Promise.all([getBikeshareData(stationInformationEndpoint), getBikeshareData(stationStatusEndpoint)])
  const stationNameMap = new Map(stationInformation.stations.map(station => [station.station_id, station.name]))
  const stations = stationStatus.stations.map(station => {
    const stationName = stationNameMap.get(station.station_id)
    return {
      id: station.station_id,
      name: stationName,
      numBikes: station.num_bikes_available,
      numDocks: station.num_docks_available
    }
  })
  const sortedStations = sortAlphabetically(stations)
  return { stations: sortedStations }
}

export { getStations }
