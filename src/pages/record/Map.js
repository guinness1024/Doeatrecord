import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import "./Map.scss";

const places = new kakao.maps.services.Places();

const Map = ({searchText}) => {
  const mapEl = useRef(null);
  const [map, setMap] = useState({});
  const [info, setInfo] = useState({overlays: [], markers: [], length: 0});
  
  useEffect(() => {
    setMap(new kakao.maps.Map(mapEl.current, {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    }));
  
    Object.keys(map).length && kakao.maps.event.addListener(map, "click", function () {
      console.log('event');
      const {length, overlays} = info;
      length && overlays.forEach(overlay => overlay.setMap(null));
    });
  }, [mapEl.current]);
  
  //TODO: Hook 에서 event 등록 로직 구현
  useEffect(() => {
    Object.keys(map).length && kakao.maps.event.addListener(map, "click", function () {
      const {length, overlays} = info;
      length && overlays.forEach(overlay => overlay.setMap(null));
    });
  }, [map]);
  
  useEffect(() => {
    places.keywordSearch(searchText, (searchPlaces, status) => {
      if (status === kakao.maps.services.Status.OK) {
        
        let bounds = new kakao.maps.LatLngBounds();
        
        const {overlays, markers, length} = info;
        if (length) {
          overlays.forEach(overlay => overlay.setMap(null));
          markers.forEach(marker => marker.setMap(null));
        }
        
        setInfo(searchPlaces.reduce((acc, place) => {
          const {x, y, place_name, address_name, road_address_name, phone, place_url} = place;
          
          const content = `
            <div class="overlay">
              <div class="info">
                <div class="title">
                  ${place_name}
                </div>
                <div class="body">
                  <div class="desc">
                    <div class="ellipsis">${road_address_name || address_name}</div>
                    <div class="jibun ellipsis">${phone}</div>
                    <div><a href="${place_url}" target="_blank" class="link">카카오맵 링크</a></div>
                    <div class="button-box"><button type="button" class="btn btn-record" onclick="">여기 먹었닷!</button></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          
          const marker = new kakao.maps.Marker({
            map,
            position: new kakao.maps.LatLng(y, x)
          });
          
          const overlay = new kakao.maps.CustomOverlay({
            content,
            position: marker.getPosition()
          });
          
          kakao.maps.event.addListener(marker, "click", function () {
            overlay.setMap(map);
          });
          
          bounds.extend(new kakao.maps.LatLng(y, x));
          
          acc.overlays.push(overlay);
          acc.markers.push(marker);
          acc.length++;
          
          return acc;
        }, {overlays: [], markers: [], length: 0}));
        
        map.setBounds(bounds, 500, 50, 0, 50);
      }
    });
  }, [searchText]);
  
  return <div id="map" className="map" ref={mapEl}/>;
};

Map.prototype = {
  searchText: PropTypes.string
};

export default Map;