var map;
var markers = [];
var timer = null;
var idx = 0;
function initMap() {
    var center = {lat: 42.7339, lng: 25.4858};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: center
    });

    map.addListener('idle', function () {
        if (timer != null) {
            clearTimeout(timer);
            timer = null;
        }
        getPlanes();
    });
}

function getPlanes() {
    // ajax request
    $.getJSON("/planes.json", {}, function (data) {
        var len = markers.length;
        var infoWindow = new google.maps.InfoWindow();
        if (len == 0) {
            data.forEach(function (item) {
                var point = (Math.round((item.HEADING * 32) / 360) % 32) * 34;
                var icon = new google.maps.MarkerImage('images/planes.png', new google.maps.Size(34, 34), new google.maps.Point(point, 34))
                var marker = new google.maps.Marker({
                    position: {lat: parseFloat(item.LAT), lng: parseFloat(item.LON)},
                    map: map,
                    icon: icon
                });


                marker.addListener('click', function () {
                    $.ajax({
                        url: `../moreinfo.php`, type: "get", data: {icao: item.ICAO, source: item.SOURCE}, success: function (result) {
                            let text = '';
                            let arr = JSON.parse(result);
                            if (arr[0] !== null) {
                                text = `<div class="iw-title">${arr[0]}</div>`;
                            }

                            infoWindow.setContent(`
                            <div class="gm-style-iw">
                                <div id="iw-container">
                                    ${text}
                                     <table class="table table-striped table-bordered" id="planesdata">
                                         <tbody id="tbody">
                                             <tr>
                                                 <td><span>ICAO:</span> ${item.ICAO}</td>
                                                 <td><span>Source:</span> ${arr[1]}</td>
                                             </tr>
                                             <tr>
                                                 <td><span>Heading:</span> ${item.HEADING}°</td>
                                                 <td><span>Speed:</span> ${item.SPEED} kts</td>
                                             </tr>
                                             <tr>
                                                 <td><span>Altitude:</span> ${Math.round(item.HEIGHT * 0.3048)} m</td>
                                                 <td><span>Vertical Speed:</span> ${Math.round((item.VERTSPEED * 0.3048)/60)} m/s</td>
                                             </tr>
                                             <tr>
                                                 <td><span>Latitude:</span> ${item.LAT}°</td>
                                                 <td><span>Longitude:</span> ${item.LON}°</td>
                                             </tr>
                                         </tbody>
                                     </table>
                                    <div class="iw-bottom-gradient"></div>
                                </div>
                            </div>
                            `
                            );

                            infoWindow.addListener('domready', function () {
                                var iwOuter = $('.gm-style-iw');
                                iwOuter.children(':nth-child(1)').css({'display': 'block'});
                                var iwBackground = iwOuter.prev();
                                iwBackground.children(':nth-child(2)').css({'display': 'none'});
                                iwBackground.children(':nth-child(4)').css({'display': 'none'});
                                iwBackground.children(':nth-child(3)').find('div').children().css({
                                    'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px',
                                    'z-index': '2'
                                });
                                var iwCloseBtn = iwOuter.next();

                                iwCloseBtn.css({
                                    opacity: '1', // by default the close button has an opacity of 0.7
                                    right: '35px', top: '5px', // button repositioning
                                    width: '27px',
                                    height: '27px',
                                    border: '7px solid #4268ad', // increasing button border and new color
                                    'border-radius': '13px', // circular effect
                                    'box-shadow': '0 0 5px #4268ad' // 3D effect to highlight the button
                                });

                                iwCloseBtn.mouseout(function () {
                                    $(this).css({opacity: '1'});
                                });
                            });

                            infoWindow.open(map, marker);
                        }
                    });
                });

                markers.push(marker)
            });
        } else {
            for (var i = 0; i < len; i++) {
                var plane = data[i];
                try {
                    markers[i].setPosition({lat: parseFloat(plane.LAT), lng: parseFloat(plane.LON)});
                    var p = (Math.round((plane.HEADING * 32) / 360) % 32) * 34;
                    var icon = new google.maps.MarkerImage('images/planes.png', new google.maps.Size(34, 34), new google.maps.Point(p, 34));
                    markers[i].setIcon(icon);
                } catch (e){};
            }
        }

        timer = setTimeout(getPlanes, 5000);
    });
}
//
// $(function() {
//     getPlanes();
//     time = setInterval( function(){
//         getPlanes();
//     }, 5000);
// });

window.onload = initMap;


/*
 * <table class="table table-striped table-bordered" id="planesdata">
 <tbody id="tbody">
 <tr>
 <td><span>Callsign</span>: </td>
 <td><span>Tail No</span>: </td>
 </tr>
 <tr>
 <td><span>Heading</span>: ${item.HEADING}°</td>
 <td><span>Speed</span>: ${item.SPEED}kts</td>
 </tr>
 <tr>
 <td><span>Altitude</span>: ${item.HEIGHT}</td>
 <td><span>Vertical Speed</span>: ${item.VERTSPEED}</td>
 </tr>
 <tr>
 <td><span>Latitude</span>: ${item.LAT}°</td>
 <td><span>Longitude</span>: ${item.LON}°</td>
 </tr>
 </tbody>
 </table>*/